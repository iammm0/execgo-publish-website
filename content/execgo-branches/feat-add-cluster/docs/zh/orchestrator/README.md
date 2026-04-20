# 编排接入指南

如果你准备把 ExecGo 放在上层 Agent、工作流引擎或业务编排层的下方，这一组文档应该先读。即使 `feat-add-cluster` 分支内部已经开始向事件溯源、队列和 Worker 架构演进，对上层编排层来说，最先需要守住的仍然是三个约定：

1. 你的工作流应该如何翻译成 ExecGo 能接受的 `TaskGraph`
2. 任务失败以后，应该如何理解 `failed` 和 `skipped`
3. 异步执行场景下，怎样做稳定的轮询和幂等控制

## 先建立一个简单心智模型

这条分支虽然更强调运行时演进，但对接入方的边界依然清晰：

- 上层编排层负责决定何时提交、何时继续、何时停止
- ExecGo 负责接收任务图、推进执行状态、记录运行结果
- 任务间的数据传递、业务补偿和策略判断，依然应该留在你的编排层

也就是说，内部架构可以演进，外部接入心智模型不应该越来越复杂。

## 推荐阅读顺序

### 1. 先看映射关系

[DAG 到 TaskGraph 的映射](./mapping-dag-to-taskgraph.md)

### 2. 再看失败语义

[失败与跳过语义](./failure-semantics.md)

### 3. 最后看轮询与幂等

[轮询与幂等](./polling-and-idempotency.md)

如果你还想理解这条分支为什么会引入句柄、运行时状态和更明确的错误包络，建议再继续看：

- [执行运行时语义](../reference/runtime-semantics.md)
- [Agent-First 路线图](../agent-kernel-roadmap.md)

## 什么时候应该拆成多次提交

只要下游任务的参数依赖上游运行结果，就不建议把所有节点强塞进同一张图里。更稳妥的做法通常还是：

1. 先提交上游任务
2. 轮询拿到 `result` 或 `runtime.error`
3. 在你的编排层完成数据整形和参数注入
4. 再提交下一张 `TaskGraph`

内部是否使用队列、Worker 或事件日志，不会改变这个判断。

## 建议一起参考的索引页

- [Task DSL 参考](../reference/task-dsl.md)
- [API 参考](../reference/api.md)
- [执行器参考](../reference/executors.md)
