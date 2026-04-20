# ExecGo

ExecGo 是一个面向 AI Agent 的执行内核。它接收一张结构化任务图，按依赖关系调度执行，并把每个任务的状态、结果和错误记录下来，供上层编排层继续决策。

`main` 分支是当前稳定发布线，适合直接作为单节点执行服务、内部任务编排后端，或嵌入到你自己的 Go 服务中。它优先保证接口清晰、部署轻量和运行行为可预测。

## 适合什么场景

- 你已经有上层 Agent、Planner 或工作流系统，只缺一个可靠的执行后端。
- 你希望先落地单节点版本，而不是一开始就引入完整的分布式控制面。
- 你需要 HTTP/gRPC 接入、DAG 调度、重试、超时、状态持久化和基础可观测能力。

如果你要评估事件溯源、队列、远程 Worker 和沙箱执行，请改看 `feat-add-cluster` 分支。

## 核心能力

| 能力 | 说明 |
| --- | --- |
| Task DSL | 用 `TaskGraph` 描述任务、依赖、重试和超时 |
| DAG 调度 | 按依赖关系并发推进任务，检测无效依赖和环 |
| 执行器模型 | 内置 `os`、`mcp`、`cli-skills` 等类别 |
| 常用工具 | `shell`、`file`、`dns`、`tcp`、`sleep`、`noop`、`http` |
| 状态持久化 | 默认内存状态 + JSON 文件落盘 |
| 可观测性 | 结构化日志、Trace ID、健康检查和指标端点 |
| 优雅停机 | 关闭 HTTP/gRPC 服务，停止调度器并持久化状态 |

## 快速开始

```bash
go build -o execgo ./cmd/execgo
./execgo
```

默认 HTTP 监听 `:8080`。确认服务可用：

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
        "id": "hello-noop",
        "type": "noop",
        "params": {
          "message": "hello execgo"
        }
      }
    ]
  }'
```

查询任务结果：

```bash
curl http://localhost:8080/tasks/hello-noop
```

## 任务图示例

```json
{
  "tasks": [
    {
      "id": "fetch-data",
      "type": "http",
      "params": {
        "url": "https://httpbin.org/json",
        "method": "GET"
      },
      "retry": 1,
      "timeout": 10000
    },
    {
      "id": "save-result",
      "type": "file",
      "params": {
        "action": "write",
        "path": "output.txt",
        "content": "fetched!"
      },
      "depends_on": ["fetch-data"]
    },
    {
      "id": "verify",
      "type": "file",
      "params": {
        "action": "read",
        "path": "output.txt"
      },
      "depends_on": ["save-result"]
    }
  ]
}
```

注意：`depends_on` 只负责执行顺序，不会自动把上游结果注入下游参数。需要动态参数时，请在上层编排层分阶段提交。

## 文档入口

- [中文文档总览](docs/zh/README.md)
- [HTTP API 入门](docs/zh/integration/http-api-getting-started.md)
- [编排接入指南](docs/zh/orchestrator/README.md)
- [Task DSL 参考](docs/zh/reference/task-dsl.md)
- [API 参考](docs/zh/reference/api.md)
- [执行器参考](docs/zh/reference/executors.md)
- [English Documentation](docs/en/README.md)

## 发布

`main` 分支当前对应稳定发布线。发布说明请看 [v1.0.0 发布说明](docs/zh/releases/v1.0.0.md)。
