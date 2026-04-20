# DAG 到 TaskGraph 的映射

就算 `feat-add-cluster` 分支内部已经开始引入事件日志、队列和 Worker，外部接入时最先要做的事情仍然没有变：把你的工作流正确翻译成一张 `TaskGraph`。这篇文档只关心这件事。

## 一句话先记住

ExecGo 只关心两件事：

- 你提交的 `TaskGraph` 在结构上是否合法
- 每个 `Task` 的类型和参数，是否能被对应执行器正确解析

至于你在上层是 DAG、状态机，还是一个更复杂的 Agent 计划器，对 ExecGo 来说都不重要。

## 映射时最常见的四个对应关系

| 你的概念 | ExecGo 中的落点 | 说明 |
| --- | --- | --- |
| 一个可执行节点 | 一个 `Task` | 每个真正要执行的动作都应该是一条任务 |
| 一条依赖边 `A -> B` | `B.depends_on = ["A"]` | 表达先后关系，不负责数据注入 |
| 节点重试策略 | `task.retry` | 表示额外重试次数 |
| 节点超时策略 | `task.timeout` | 单次执行超时，单位毫秒 |

## 第一步：把节点翻译成 Task

一个最小任务示例如下：

```json
{
  "id": "fetch-profile",
  "type": "http",
  "params": {
    "url": "https://example.com/api/profile",
    "method": "GET"
  },
  "retry": 1,
  "timeout": 10000
}
```

这条分支虽然会在更深层暴露 `runtime`、句柄和更多运行时细节，但对提交格式来说，核心仍然是这些基础字段。

## 第二步：把依赖边翻译成 depends_on

如果你的工作流里有一条边 `fetch-profile -> summarize`，那么在 ExecGo 里应当写成：

```json
{
  "id": "summarize",
  "type": "shell",
  "params": {
    "command": "cat profile.json | jq '.name'"
  },
  "depends_on": ["fetch-profile"]
}
```

要特别注意：`depends_on` 仍然只负责调度顺序。即使内部运行时以后支持更丰富的句柄和事件，这条规则也不会自动变成“上游结果透传到下游参数”。

## 第三步：什么时候拆成多次提交

判断标准和稳定版一致：

### 适合一次性提交

- 下游参数在提交时已经确定
- 下游只关心上游是否成功，不需要消费上游结果

### 更适合分阶段提交

- 下游参数依赖上游结果
- 你需要根据 `runtime.output` 或错误包络做策略判断
- 你希望在阶段之间插入审批、缓存命中或人工确认

推荐做法：

1. 先提交第一阶段
2. 轮询拿到结果
3. 在你的编排层决定下一步
4. 再提交下一张 `TaskGraph`

## 一个完整示例

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

如果 `save-result` 里的 `content` 要来自 `fetch-data` 的真实输出，那么最稳妥的做法依然是拆成两次提交，而不是指望运行时替你做变量替换。

## 提交前建议做的本地校验

- `task.id` 非空且唯一
- `depends_on` 只引用图内任务
- 没有自依赖和环
- `type` 与当前服务端支持的执行器一致
- `params` 至少满足你自己的业务模板要求

## 下一篇建议

看完结构映射以后，建议继续读 [失败与跳过语义](./failure-semantics.md)。这条分支最大的复杂度往往不在“怎么提交”，而在“拿到状态以后怎么做判断”。
