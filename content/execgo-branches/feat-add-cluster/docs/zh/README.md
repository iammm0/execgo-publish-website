# ExecGo 文档总览

这套文档对应 `feat-add-cluster` 分支，也就是正在演进中的集群预览线。它保留了稳定版的任务提交体验，但在运行时内部引入了事件溯源、队列、Worker、沙箱和更明确的控制面协议，因此阅读重点会从“单节点怎么落地”转向“控制面怎么演进”。

## 先判断你该看哪条路径

如果你想快速理解这条分支和稳定版有什么本质差异，建议先按下面的顺序阅读：

1. [Agent-First 路线图](./agent-kernel-roadmap.md)
2. [执行运行时语义](./reference/runtime-semantics.md)
3. [编排接入指南](./orchestrator/README.md)

如果你只是想先把接口跑通，再决定是否继续深入，那就先读：

1. [HTTP API 入门](./integration/http-api-getting-started.md)
2. [Task DSL 参考](./reference/task-dsl.md)
3. [API 参考](./reference/api.md)

## 这条分支更适合谁

`feat-add-cluster` 更适合下面这类团队：

- 正在从单节点执行服务演进到控制面 + Worker 架构。
- 需要事件日志、任务队列、远程执行和回放能力。
- 想提前评估未来的运行时语义、句柄模型和结构化错误约定。

如果你当前最看重的是“部署简单、文档稳定、今天就能上线”，请优先选择 `main` 分支文档。这个分支更像一条预览线，用来展示 ExecGo 未来会长成什么样。

## 推荐阅读路径

### 路径 A：先理解演进方向

1. [Agent-First 路线图](./agent-kernel-roadmap.md)
2. [执行运行时语义](./reference/runtime-semantics.md)
3. [FAQ](./faqs.md)

### 路径 B：评估对现有编排层的影响

1. [编排接入指南](./orchestrator/README.md)
2. [DAG 到 TaskGraph 的映射](./orchestrator/mapping-dag-to-taskgraph.md)
3. [失败与跳过语义](./orchestrator/failure-semantics.md)
4. [轮询与幂等](./orchestrator/polling-and-idempotency.md)

### 路径 C：验证 HTTP 接口与客户端接入

1. [HTTP API 入门](./integration/http-api-getting-started.md)
2. [Task DSL 参考](./reference/task-dsl.md)
3. [API 参考](./reference/api.md)
4. 各语言客户端示例

## 文档地图

### 1. 路线与语义

- [Agent-First 路线图](./agent-kernel-roadmap.md)：解释为什么 ExecGo 不想变成另一个泛工作流引擎。
- [执行运行时语义](./reference/runtime-semantics.md)：整理状态机、句柄、结果结构和错误结构的目标形态。

### 2. 编排接入

- [编排接入指南](./orchestrator/README.md)
- [DAG 到 TaskGraph 的映射](./orchestrator/mapping-dag-to-taskgraph.md)
- [失败与跳过语义](./orchestrator/failure-semantics.md)
- [轮询与幂等](./orchestrator/polling-and-idempotency.md)

虽然内部实现已经开始向事件驱动和 Worker 架构演进，但对上层编排层来说，最先需要守住的依然是任务图、状态判断和幂等策略。

### 3. 接口与任务模型

- [HTTP API 入门](./integration/http-api-getting-started.md)
- [Task DSL 参考](./reference/task-dsl.md)
- [API 参考](./reference/api.md)
- [执行器参考](./reference/executors.md)

### 4. 客户端与部署

- [Go 客户端示例](./integration/client-go.md)
- [Java 客户端示例](./integration/client-java.md)
- [Python 客户端示例](./integration/client-python.md)
- [Node.js + TypeScript 客户端示例](./integration/client-nodejs-ts.md)
- [Docker Compose 部署](./deploy/compose.md)
- [Kubernetes 部署](./deploy/kubernetes.md)

## 阅读提示

这条分支里仍然保留了一些更细的拆分页和设计资料。你可以把它们理解为“参考资料库”，但第一次阅读时不建议直接跳进去，否则很容易被实现细节打断。
