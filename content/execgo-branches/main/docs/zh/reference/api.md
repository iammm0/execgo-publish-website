# API 参考

这篇不是逐行枚举所有 JSON 字段，而是先把最常用的接口、调用顺序和排错重点整理清楚。第一次接入时，先把这篇和 [HTTP API 入门](../integration/http-api-getting-started.md) 配合着读，通常就够用了。

## 最常用的接口

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| `POST` | `/tasks` | 提交一张任务图 |
| `GET` | `/tasks/{id}` | 查询单个任务状态与结果 |
| `GET` | `/tasks` | 列出当前任务 |
| `DELETE` | `/tasks/{id}` | 删除任务状态记录 |
| `GET` | `/health` | 健康检查 |
| `GET` | `/metrics` | 读取 JSON 指标 |

如果你接入了 MCP 相关能力，还会看到：

- `GET /mcp/tools`
- `POST /mcp/call`
- `GET /mcp/tasks/{id}`

## 一次典型调用会怎么走

最常见的交互顺序是：

1. 调用 `POST /tasks` 提交任务图
2. 记录返回的 `task_ids`
3. 用 `GET /tasks/{id}` 轮询每个任务
4. 读到终态以后停止轮询
5. 需要清理状态时，再调用 `DELETE /tasks/{id}`

这套模式本质上是“异步提交 + 主动查询”，所以不要把 `202 Accepted` 理解成“已经执行完成”。

## POST /tasks 最值得注意什么

### 返回 `202 Accepted` 的含义

它表示服务端已经接受了任务图，并开始在后台推进调度。它不保证：

- 所有任务都已经执行
- 所有任务都能成功
- 下游参数会自动拿到上游结果

### 最容易触发 `400` 的原因

- `task.id` 重复
- `depends_on` 引用了不存在的任务
- 依赖图有环
- `type` 或参数结构不合法

所以第一次接入时，最好把 [Task DSL 参考](./task-dsl.md) 一起读掉。

## GET /tasks/{id} 应该优先看哪些字段

大多数场景里，先看这几个就够了：

- `status`
- `result`
- `error`
- `type`
- `tool_name`

一个很实用的读取顺序是：

1. 先看 `status`
2. `success` 时读 `result`
3. `failed` 时读 `error`
4. `skipped` 时回溯上游依赖

如果你的版本已经暴露更细的 `runtime` 包络，也可以继续往下看 `runtime.output` 和 `runtime.error`，但这不是第一次接入的必需前提。

## DELETE /tasks/{id} 适合做什么

它适合做两件事：

- 清理不再需要的任务状态
- 让状态存储保持可控

它不适合被当成“取消执行”的强语义接口，所以不要拿它设计中断流程。

## /health 和 /metrics 的角色

### /health

适合用来做：

- 容器健康检查
- 启动探针
- 基础可用性确认

### /metrics

适合用来做：

- 基础运行指标采集
- 任务量、成功率和失败量监控

## 更细的拆分页

如果你已经把主流程跑通，接下来可以按主题继续看：

- [API 总览拆分页](./API%20参考/API%20参考.md)
- [任务管理端点](./API%20参考/任务管理端点.md)
- [系统健康端点](./API%20参考/系统健康端点.md)
- [错误处理和状态码](./API%20参考/错误处理和状态码.md)
