# FAQ

这页不追求把所有细节都展开，而是把最常见的问题先回答到“能继续往前做事”的程度。每个问题后面都附了进一步阅读入口。

## 1. 我应该把 ExecGo 当成什么

最准确的理解是：它是一个执行内核，而不是完整的工作流产品。上层系统负责决定要做什么，ExecGo 负责把一张任务图按约定执行出来，并记录状态和结果。

继续阅读：

- [编排接入指南](./orchestrator/README.md)
- [Agent-First 路线说明](./agent-kernel-roadmap.md)

## 2. 一次提交的最小单位是什么

最小单位是一张 `TaskGraph`，核心字段是 `tasks` 数组。数组里的每个元素都是一个 `Task`，包含 `id`、`type`、`params` 等字段。

继续阅读：

- [Task DSL 参考](./reference/task-dsl.md)
- [HTTP API 入门](./integration/http-api-getting-started.md)

## 3. depends_on 会自动传递上游结果吗

不会。`depends_on` 只表示调度依赖，不表示数据注入。如果下游参数依赖上游结果，通常应该由你的编排层先轮询拿到结果，再把结果写进下一张任务图。

继续阅读：

- [DAG 到 TaskGraph 的映射](./orchestrator/mapping-dag-to-taskgraph.md)
- [轮询与幂等](./orchestrator/polling-and-idempotency.md)

## 4. 为什么查询到的 type 和提交时不一样

因为便捷别名会被规范化。例如你提交 `type: "noop"`，查询时可能看到的是 `type: "os"` 和 `tool_name: "noop"`。这不是错误，而是服务端统一执行模型后的表现。

继续阅读：

- [执行器参考](./reference/executors.md)
- [HTTP API 入门](./integration/http-api-getting-started.md)

## 5. 什么时候算执行失败

真正需要重点处理的是 `failed` 和 `skipped`：

- `failed`：任务自己执行过，但最终失败
- `skipped`：因为上游失败而没有执行

继续阅读：

- [失败与跳过语义](./orchestrator/failure-semantics.md)

## 6. 如何避免重复提交同一个任务

关键在于你怎么设计 `task.id`。如果你希望同一次业务运行只执行一次，就要为它生成稳定 ID，并在重试前先查状态；如果你希望每次都算新执行轮次，就要生成新的 ID。

继续阅读：

- [轮询与幂等](./orchestrator/polling-and-idempotency.md)

## 7. 哪些文档最适合第一次接入

推荐顺序通常是：

1. [HTTP API 入门](./integration/http-api-getting-started.md)
2. [Task DSL 参考](./reference/task-dsl.md)
3. [API 参考](./reference/api.md)
4. [FAQ](./faqs.md)

## 8. 上线前最少要补哪几篇部署文档

至少看下面两篇：

- [Docker Compose 部署](./deploy/compose.md)
- [Kubernetes 部署](./deploy/kubernetes.md)

如果你要把这个版本作为生产基线，还建议补看：

- [v1.0.0 发布说明](./releases/v1.0.0.md)
