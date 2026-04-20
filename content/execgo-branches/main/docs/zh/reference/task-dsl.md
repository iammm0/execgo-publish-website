# Task DSL 参考

如果你只打算认真读一篇参考文档，优先读这篇。因为无论你是手写请求、封装 SDK，还是把上层工作流翻译成任务图，最后都会落到 `TaskGraph` 和 `Task` 这套契约上。

## 先建立一个最小模型

ExecGo 接收的是一个 `TaskGraph`，最外层结构通常长这样：

```json
{
  "tasks": [
    {
      "id": "task-1",
      "type": "noop",
      "params": {
        "message": "hello"
      }
    }
  ]
}
```

你可以把它理解成：

- `TaskGraph` 负责装下一批任务
- `Task` 负责描述一条可执行动作

## Task 最常用的字段

| 字段 | 是否常用 | 作用 |
| --- | --- | --- |
| `id` | 必填 | 任务唯一标识 |
| `type` | 必填 | 任务类型或执行器类别 |
| `params` | 常用 | 便捷写法下的输入参数 |
| `depends_on` | 常用 | 上游任务 ID 列表 |
| `retry` | 可选 | 额外重试次数 |
| `timeout` | 可选 | 单次执行超时，单位毫秒 |
| `tool_name` | 进阶 | 当 `type` 是统一类别时，用它指定具体工具 |
| `input` | 进阶 | 与 `tool_name` 对应的输入体 |

如果你是第一次接入，只需要先掌握 `id`、`type`、`params`、`depends_on`、`retry`、`timeout` 这六个字段就够了。

## 两种提交风格

### 风格 A：便捷别名

这是第一次接入时最容易读懂的写法：

```json
{
  "id": "check-host",
  "type": "shell",
  "params": {
    "command": "hostname"
  }
}
```

### 风格 B：规范化写法

这是更接近运行时内部统一模型的写法：

```json
{
  "id": "check-host",
  "type": "os",
  "tool_name": "shell",
  "input": {
    "command": "hostname"
  }
}
```

两种写法最终会落到同一套执行逻辑。对于大多数 HTTP 客户端，先用风格 A 会更轻松。

## depends_on 到底表达什么

`depends_on` 只表达调度依赖，不表达数据注入。

例如：

```json
{
  "id": "verify",
  "type": "file",
  "params": {
    "action": "read",
    "path": "output.txt"
  },
  "depends_on": ["save-result"]
}
```

它的意思只是“`verify` 必须在 `save-result` 成功后才能执行”。它不意味着 `save-result.result` 会自动进入 `verify.params`。

## retry 和 timeout 怎么看

- `retry` 表示额外重试次数
- `timeout` 表示单次执行的超时时间

一个简单判断方式：

- `retry = 0` 表示最多执行 1 次
- `retry = 2` 表示最多执行 3 次

如果任务需要进入下一轮重试，`timeout` 会重新计算。

## 提交前最值得提前做的校验

为了减少运行时直接返回 `400`，建议在客户端或编排层提前检查：

- `id` 是否非空且唯一
- `depends_on` 是否只引用图内已有任务
- 是否存在自依赖或环
- `type` 是否能映射到服务端已支持的执行器
- `params` 是否满足你自己定义的任务模板

## 常见误区

### 误区 1：把任务图当成数据流引擎

ExecGo 更像调度和执行内核，而不是带变量替换的数据流引擎。参数传递最好由你的上层编排层显式处理。

### 误区 2：把 task.id 当成随便写的展示字段

默认存储会把 `task.id` 当成记录主键，所以它直接影响幂等和覆盖行为。

### 误区 3：把 retry 理解成总执行次数

它表示的是“额外重试次数”，不是“总共执行多少次”。

## 如果你还想继续深挖

更细的拆分页还在 `reference/任务 DSL 规范/` 目录下，适合你需要逐项核对字段和校验逻辑时使用：

- [任务 DSL 规范](./任务%20DSL%20规范/任务%20DSL%20规范.md)
- [任务模型定义](./任务%20DSL%20规范/任务模型定义.md)
- [任务图验证机制](./任务%20DSL%20规范/任务图验证机制.md)
- [任务定义示例](./任务%20DSL%20规范/任务定义示例.md)
