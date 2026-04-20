# Task DSL 参考

即使 `feat-add-cluster` 分支内部已经开始演进出更复杂的运行时，这条分支对外的基础契约仍然是 `TaskGraph` 和 `Task`。所以不管你最终要不要用到更丰富的 `runtime` 字段，这篇都值得先读。

## 先建立一个最小模型

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
| `tool_name` | 进阶 | 指定统一类别下的具体工具 |
| `input` | 进阶 | 与 `tool_name` 对应的输入体 |

## 两种提交风格

### 风格 A：便捷别名

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

对这条分支来说，两种写法依然都成立；区别只在于后者更贴近未来统一运行时的内部表达。

## depends_on 只负责调度，不负责传值

这条规则和稳定版完全一致。`depends_on` 表示“先后关系”，不是“结果透传”。如果下游参数依赖上游结果，请在你的编排层显式取出 `result` 或 `runtime.output`，再提交下一阶段任务。

## retry 和 timeout 怎么看

- `retry` 仍然表示额外重试次数
- `timeout` 仍然表示单次执行超时

随着运行时逐步丰富，这些字段未来可能会有更细的配套状态，但它们的基本含义不应该变化。

## 提交前最值得做的本地校验

- `id` 非空且唯一
- `depends_on` 只引用图内任务
- 没有自依赖或环
- `type` 与服务端支持的执行器一致
- `params` 至少满足你的业务模板要求

## 常见误区

### 误区 1：觉得内部架构升级后，外部任务契约就会完全变掉

不会。运行时可以演进，但 `TaskGraph` 作为编排输入，反而更需要保持稳定。

### 误区 2：一看到 runtime 字段就想绕过基础状态

更好的顺序通常是：先判断 `status`，再在需要时深入读取 `runtime` 细节。

## 如果你还想继续深挖

- [执行运行时语义](./runtime-semantics.md)
- [任务 DSL 规范](./任务%20DSL%20规范/任务%20DSL%20规范.md)
- [任务模型定义](./任务%20DSL%20规范/任务模型定义.md)
- [任务图验证机制](./任务%20DSL%20规范/任务图验证机制.md)
