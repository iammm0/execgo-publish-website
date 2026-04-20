# ExecGo Cluster Preview

`feat-add-cluster` 是 ExecGo 的集群预览线。它保留了稳定版的任务图和 HTTP 接入体验，但把内部运行时扩展为事件溯源、任务队列、Worker、沙箱和更明确的控制面协议。

这条分支更适合用来评估 ExecGo 的下一阶段架构，而不是替代 `main` 作为默认生产基线。如果你需要最稳妥的单节点版本，请先选择 `main`。

## 这条分支在探索什么

- 用事件日志作为运行时状态来源，支持回放和更清晰的审计。
- 把调度和执行拆开，让任务可以进入队列并由 Worker 消费。
- 为本地 Worker 和远程 Worker 预留统一控制面。
- 引入 Local / Docker 沙箱，让执行隔离成为运行时的一等能力。
- 通过更明确的 `runtime` 结果包络，整理状态、输出、错误和尝试次数。

## 与 main 的区别

| 维度 | main | feat-add-cluster |
| --- | --- | --- |
| 运行形态 | 单节点执行内核 | 控制面 + 队列 + Worker 的预览架构 |
| 状态管理 | JSON 文件持久化 | 事件溯源 Store |
| 执行路径 | 进程内调度执行 | 队列化调度，本地或远程 Worker 执行 |
| 运行时语义 | 稳定的任务状态与结果字段 | 更明确的句柄、输出和错误包络 |
| 适用阶段 | 生产基线 | 架构评估和集群能力验证 |

## 快速启动

最小本地模式仍然可以直接启动：

```bash
go build -o execgo ./cmd/execgo
./execgo
```

如果要验证事件存储和队列配置，可以使用本地开发模式：

```bash
EXECGO_EVENT_STORE_BACKEND=sqlite \
EXECGO_EVENT_STORE_SQLITE_PATH=./data/eventlog.sqlite \
EXECGO_QUEUE_BACKEND=memory \
./execgo
```

验证健康检查：

```bash
curl http://localhost:8080/health
```

提交一个最小任务：

```bash
curl -X POST http://localhost:8080/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "tasks": [
      {
        "id": "hello-cluster-preview",
        "type": "noop",
        "params": {
          "message": "hello cluster preview"
        }
      }
    ]
  }'
```

## 生产形态参考

这条分支的方向是把事件存储和队列换成更适合生产的后端，例如：

```bash
EXECGO_EVENT_STORE_BACKEND=postgres \
EXECGO_EVENT_STORE_POSTGRES_DSN='postgres://user:pass@127.0.0.1:5432/execgo?sslmode=disable' \
EXECGO_QUEUE_BACKEND=redis \
EXECGO_REDIS_ADDR=127.0.0.1:6379 \
EXECGO_WORKER_ID=worker-a \
EXECGO_WORKER_CONCURRENCY=16 \
./execgo
```

Docker 沙箱可以这样启用：

```bash
EXECGO_SANDBOX_MODE=docker \
EXECGO_DOCKER_IMAGE=alpine:3.21 \
EXECGO_DOCKER_NO_NETWORK=true \
./execgo
```

## 文档入口

- [中文文档总览](docs/zh/README.md)
- [Agent-First 路线图](docs/zh/agent-kernel-roadmap.md)
- [执行运行时语义](docs/zh/reference/runtime-semantics.md)
- [编排接入指南](docs/zh/orchestrator/README.md)
- [Task DSL 参考](docs/zh/reference/task-dsl.md)
- [API 参考](docs/zh/reference/api.md)
- [执行器参考](docs/zh/reference/executors.md)

## 阅读建议

如果你只是想调用任务接口，先按稳定版思路读 HTTP API 和 Task DSL 即可。如果你要评估这条分支的价值，请优先读路线图和运行时语义，它们解释了为什么这条线会引入事件、队列、Worker 和沙箱。
