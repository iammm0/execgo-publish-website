# DAG 到 TaskGraph 的映射

当你把 ExecGo 作为执行后端时，最重要的一步不是“怎么调接口”，而是“怎么把自己的工作流模型翻译成一张正确的任务图”。这篇文档只做一件事：把这层映射关系说清楚。

## 一句话先记住

ExecGo 只关心两件事：

- 你提交的 `TaskGraph` 在结构上是否合法
- 每个 `Task` 的类型和参数，是否能被对应执行器正确解析

它不关心你在上层是 DAG、状态机、步骤树还是别的业务模型。只要最后能落成一组合法任务，它就能执行。

## 映射时最常见的四个对应关系

| 你的概念 | ExecGo 中的落点 | 说明 |
| --- | --- | --- |
| 一个可执行节点 | 一个 `Task` | 每个真正要执行的动作都应该是一条任务 |
| 一条依赖边 `A -> B` | `B.depends_on = ["A"]` | 只表达先后约束，不表达数据传递 |
| 节点重试策略 | `task.retry` | 表示额外重试次数，不含首次执行 |
| 节点超时策略 | `task.timeout` | 单次执行超时，单位毫秒 |

## 第一步：把节点翻译成 Task

一个 `Task` 至少要回答下面几个问题：

- 这条任务的唯一 ID 是什么
- 它要调用哪一类执行器
- 输入参数是什么
- 它依赖哪些上游任务
- 是否有独立的超时和重试策略

一个最小示例如下：

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

这里没有什么“工作流专用语法”，本质上就是把一个可执行动作翻译成结构化任务。

## 第二步：把依赖边翻译成 depends_on

如果你的工作流里有一条边 `fetch-profile -> summarize`，那么在 ExecGo 里应该写成：

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

这里最容易误解的一点是：`depends_on` 只表达调度顺序，不表达结果注入。它的意思是“`summarize` 必须在 `fetch-profile` 成功后才有资格被调度”，而不是“把 `fetch-profile.result` 自动塞进 `summarize.params`”。

## 第三步：区分一次性提交和分阶段提交

是否可以一次性提交整张 DAG，取决于下游参数是不是在提交时就已经确定。

### 适合一次性提交的情况

- 下游参数是静态的
- 下游只依赖“是否执行成功”，不依赖上游返回值本身
- 你的工作流更像一个固定编排模板

### 更适合分阶段提交的情况

- 下游参数依赖上游结果
- 你需要根据上游输出决定后续是否继续
- 你希望在每个阶段之间插入人工审批或额外校验

一旦出现这些情况，更稳妥的做法通常是：

1. 先提交第一阶段任务
2. 轮询拿到结果
3. 在编排层完成数据整形
4. 再提交下一阶段任务

## 一个完整示例

假设你的业务流程是：

1. 通过 HTTP 拉取原始数据
2. 把结果写入文件
3. 再读取文件做校验

如果第二步写入的是固定内容，那么它可以被翻译成同一张 DAG：

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

但如果 `save-result.params.content` 必须来自 `fetch-data.result`，那就不应该继续假装它是一张“静态可提交”的 DAG 了。

## 提交前建议做的本地校验

为了减少 `400 Bad Request`，建议你在自己的编排层提前做一次轻量校验：

- `task.id` 非空且在同一张图内唯一
- `depends_on` 只引用图内存在的任务
- 没有自依赖，也没有环
- `type` 能映射到当前服务端已注册的执行器
- `params` 至少满足你自己对该任务模板的约束

这样真正调用 ExecGo 时，错误会更少，也更容易定位。

## 下一篇该看什么

如果你已经理解了结构映射，下一篇建议读 [失败与跳过语义](./failure-semantics.md)。因为真正把工作流接稳，关键不只在“怎么提交”，还在“失败以后怎么判断后续动作”。
