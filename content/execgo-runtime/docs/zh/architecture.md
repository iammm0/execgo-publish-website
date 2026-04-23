# 架构说明

## 定位

`execgo-runtime` 是 ExecGo 的**执行后端（数据面）**：接收任务描述、落盘、调度执行，并通过 HTTP 暴露状态与运维接口。控制面（如 ExecGo 自身）通过 HTTP 与本服务交互，**不直接** fork 用户进程。

## 面向的技术场景（分层）

ExecGo 系列面向的是「上层 Agent 编排」与「底层真实执行」之间的工程化断层：上层希望只关心决策与工作流，而底层需要稳定地调度进程、隔离资源、持久化与可观测。

分层职责可以拆成三类：

| 层级 | 职责 | 典型技术 | ExecGo 对应组件 | 关键价值 |
|------|------|----------|-----------------|----------|
| 编排层（Orchestration Layer） | 连接 LLM，规划任务，角色协作，Prompt 管理，决策循环 | LangGraph、CrewAI、LangChain、AutoGen、LlamaIndex 等 | 上层框架（不属于 ExecGo） | 智能决策、动态工作流 |
| 执行层（Execution Layer / Kernel） | 任务契约化，DAG 调度，状态机，策略（重试、超时、依赖），可观测性 | Task DSL、DAG Scheduler、v2 Executors | `execgo`（Go 控制面） | 把“决策”可靠翻译成“可执行动作”，提供契约与治理 |
| 运行时层（Runtime Layer） | 实际进程执行，沙箱，持久化，HTTP/CLI 接口，资源管理 | 异步调度、子进程 shim、存储、指标 | `execgo-runtime`（Rust 数据面） | 真正干活，提供进程隔离、安全边界与水平扩展基础 |

在这个分层里：

- **编排层（Orchestration）**：LLM / Agent 框架侧输出“工具调用 / 子任务”，负责规划、提示词与决策循环（不属于 ExecGo）。
- **执行层（Execution / Kernel）**：`execgo`（控制面）把“决策”翻译成“可执行任务图（TaskGraph）”，提供任务契约、调度策略与治理能力。
- **运行时层（Runtime）**：`execgo-runtime`（数据面）做真正的脏活累活：进程执行、资源隔离（cgroup / sandbox）、持久化（SQLite + 文件目录）、队列与异步调度、指标与运维接口。

## 任务契约化：连接点

上层编排层输出的“工具调用 / 子任务”，可以映射为 ExecGo 的 Task DSL（`id + type + params + depends_on + retry + timeout` 等）。这样上层不需要再维护一套状态机、重试语义、DAG 依赖解析与失败语义（`failed` vs `skipped` 等），由执行层与运行时层统一处理，显著降低集成复杂度。

这条连接点的价值可以分三层理解：

1. **任务契约化是核心连接点**

   LangGraph、CrewAI 等编排层输出的“工具调用”或“子任务”，可以标准化映射成 ExecGo 的 Task DSL，包括 `id`、`type`、`params`、`depends_on`、`retry`、`timeout` 等字段。这样编排层不需要再维护自己的状态机、重试逻辑、DAG 依赖解析、失败语义（例如 `failed` 与 `skipped` 的区别），而是把这些执行内核能力交给 ExecGo 统一处理，从而明显降低集成复杂度。

2. **ExecGo 的主要价值**

   | 能力 | 说明 |
   |------|------|
   | 管理 TaskGraph 生命周期 | 统一管理任务图从提交、调度、运行到终态落盘的完整生命周期。 |
   | 保证执行过程稳定、可追踪、可恢复 | 通过状态持久化、traceID、结构化日志、重试策略和优雅关闭，让执行过程可以审计、复盘和恢复。 |
   | 提供安全、可插拔的 v2 执行器 | 通过 `category + tool` 描述 shell、file、http、mcp 等执行能力，让执行器可以按业务扩展。 |
   | 分离思考与执行 | 让上层 Agent 专注于“思考”和“规划”，把“执行”这件脏活累活封装到执行内核里。 |

3. **生产环境多实例时的角色**

   多个 `execgo`（控制面）实例可以同时运行，接收来自不同 Agent 的任务提交。这时 `execgo-runtime`（数据面）成为关键组件：它负责真正的进程执行、资源隔离（cgroup、sandbox）、持久化（SQLite + 文件目录）和队列调度。一个 runtime 可以被多个 `execgo` 共享；未来 cluster 分支成熟后，还可以由多个 runtime 组成集群，通过 queue + event sourcing 统一协调资源和任务分发。

## 模块划分

| 模块 | 路径 | 职责 |
|------|------|------|
| `server` | `src/server.rs` | Axum 路由：`/api/v1/*`、`/healthz`、`/readyz`、`/metrics` |
| `runtime` | `src/runtime.rs` | 运行时核心：提交、查询、kill、dispatcher、GC、shim 入口、进程执行 |
| `capabilities` | `src/capabilities.rs` | 启动时探测宿主环境，生成 capability manifest |
| `policy` | `src/policy.rs` | 将任务请求解析为 requested/effective execution plan，处理 strict/adaptive 策略 |
| `ledger` | `src/ledger.rs` | 本机 ResourceLedger 的 capacity/reservation/available 计算 |
| `repo` | `src/repo.rs` | SQLite 访问：任务表、事件表、指标聚合 |
| `types` | `src/types.rs` | 请求/响应与策略类型（执行规格、沙箱、限额） |
| `metrics` | `src/metrics.rs` | 将仓库快照渲染为 Prometheus 文本 |
| `cli` | `src/cli.rs` | 命令行解析 |
| `error` | `src/error.rs` | 错误类型与 HTTP 映射 |

## 任务状态机

任务在数据库中的 `status` 取值（JSON 中为 snake_case）：

- `accepted`：已入队，等待调度。
- `running`：已派发 shim，且（在 shim 内）进程已启动或即将启动。
- `success` / `failed` / `cancelled`：终态。

终态任务在 `limits` 与保留策略下可被 **GC** 删除（见 `serve` 的 `--result-retention-secs` 等参数）。

## 调度与 shim

1. **EnvironmentProbe** 在 `serve` 启动时生成 capability manifest，并缓存到 `RuntimeService`。
2. 提交任务时，**PolicyResolver** 基于请求、capabilities 与可选 `control_context` 生成 `execution_plan`；`adaptive` 模式会显式降级，`strict` 模式会拒绝不满足能力的任务。
3. **Dispatcher** 循环从队列中取 `accepted` 任务，先通过本机 **ResourceLedger** 做 `task_slots` / `memory_bytes` / `pids` reservation，再派发 shim。
4. 派发时以**当前可执行文件**再执行 `internal-shim` 子命令，传入 `--database`、`--data-dir`、`--task-id` 等。
5. **Shim** 读取任务记录与持久化的 `execution_plan`，构建 `Command`/`Script` 执行，在 `pre_exec` 中设置进程组、按 effective plan 应用 `rlimit`，在 Linux 上可选应用 Linux 沙箱与 cgroup。
6. shim 通过 `wait4` 等待子进程结束，并结合取消、超时、OOM 等条件写入 `CompletionUpdate`；终态写入时会释放活动 reservation。

运行时重启后，`recover` 会扫描非终态任务：`accepted` 不应持有活动 reservation，若发现会释放；`running` 若 shim 仍在则保留或重建 reservation 并标记恢复事件，否则标记为失败、释放 reservation 并落盘结果。

## 持久化布局

在 `--data-dir` 下：

- `runtime.db`：SQLite 数据库（WAL 模式）。
- `tasks/<task_id>/` 目录：
  - `request.json`：提交时的完整请求。
  - `result.json`：终态快照（与 API 状态结构一致）。
  - `stdout.log` / `stderr.log`：输出日志。
  - `workspace/` 或 `workspace/<subdir>/`：工作目录（由 `sandbox.workspace_subdir` 决定）。

数据库中任务行还持久化 `execution_plan_json`、`control_context_json`、`reservation_json`、`reserved_at_ms`、`released_at_ms`，用于能力审计、恢复对账与资源释放。

## 沙箱与平台差异

- **`sandbox.profile = process`**（默认）：在普通进程环境中执行，依赖 `rlimit` 等限制。
- **`sandbox.profile = linux_sandbox`**：作为 requested capability 提交；runtime 会按 capability mode 决定 strict 拒绝或 adaptive fallback，并在 `execution_plan` 中暴露 effective sandbox。

详见 [api.md](api.md) 中的沙箱字段说明。

## 指标

`GET /metrics` 输出 Prometheus 文本指标，包括按状态任务数、错误码分布、以及基于历史 `duration_ms` 的直方图近似（实现见 `metrics.rs`）。
