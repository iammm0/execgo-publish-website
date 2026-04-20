# FAQ

这页聚焦 `feat-add-cluster` 分支最常见的判断问题，目标不是一次把所有实现细节讲完，而是先帮你判断这条分支适不适合你现在的阶段。

## 1. 这条分支和 main 最大的区别是什么

`main` 更强调稳定交付的单节点执行内核；`feat-add-cluster` 更强调运行时演进，包括事件溯源、队列、Worker、沙箱以及更明确的控制面语义。

继续阅读：

- [文档总览](./README.md)
- [Agent-First 路线图](./agent-kernel-roadmap.md)

## 2. 接入方式会不会完全不一样

不会。对上层编排层来说，最基本的接入动作依然是：提交任务图、轮询状态、读取结果。变化主要发生在运行时内部和更细的语义建模上。

继续阅读：

- [编排接入指南](./orchestrator/README.md)
- [执行运行时语义](./reference/runtime-semantics.md)

## 3. 我还需要关心 depends_on 和 TaskGraph 吗

仍然需要。无论内部是不是队列化调度，对外暴露的基本编排契约依然是 `TaskGraph` 和任务依赖关系。

继续阅读：

- [DAG 到 TaskGraph 的映射](./orchestrator/mapping-dag-to-taskgraph.md)
- [Task DSL 参考](./reference/task-dsl.md)

## 4. 运行时语义增强以后，我是不是必须改成新字段

不一定。如果你只是想保持兼容接入，继续消费 `status`、`result`、`error` 也可以。如果你想利用这条分支更丰富的状态、句柄和错误包络，再逐步接入 `runtime.*` 相关字段即可。

继续阅读：

- [执行运行时语义](./reference/runtime-semantics.md)
- [API 参考](./reference/api.md)

## 5. 失败时我应该看 failed 还是 skipped

两者都要看，但用途不同：

- `failed` 用来找真正执行失败的节点
- `skipped` 用来判断哪些节点是被上游失败连带影响

继续阅读：

- [失败与跳过语义](./orchestrator/failure-semantics.md)

## 6. 这条分支适合直接上生产吗

如果你要的是稳定基线，优先用 `main`。如果你要的是提前评估集群化演进方向、验证更先进的运行时语义，这条分支才更值得投入。

## 7. 如何避免重复提交

结论和稳定版一致：关键还是 `task.id` 设计。内部架构变复杂，不会自动帮你解决客户端的重复提交问题。

继续阅读：

- [轮询与幂等](./orchestrator/polling-and-idempotency.md)

## 8. 我该先看哪些文档

如果你是评估方向，建议看：

1. [Agent-First 路线图](./agent-kernel-roadmap.md)
2. [执行运行时语义](./reference/runtime-semantics.md)
3. [FAQ](./faqs.md)

如果你是验证接入，建议看：

1. [HTTP API 入门](./integration/http-api-getting-started.md)
2. [Task DSL 参考](./reference/task-dsl.md)
3. [API 参考](./reference/api.md)
