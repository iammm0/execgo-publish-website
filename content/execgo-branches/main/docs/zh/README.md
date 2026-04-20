# ExecGo 文档总览

这套文档对应 `main` 分支，也就是当前的稳定发布线。你可以把它理解为一套已经闭环的单节点执行内核文档：接口、任务模型、执行器、部署方式和客户端接入路径都已经固定下来，适合直接评估、试跑和接入。

## 先判断你应该从哪读起

如果你是第一次接触 ExecGo，建议按下面的顺序阅读：

1. 先读 [HTTP API 入门](./integration/http-api-getting-started.md)，用最小示例把服务跑起来。
2. 再读 [Task DSL 参考](./reference/task-dsl.md)，确认任务结构、依赖关系和校验规则。
3. 最后按你的角色继续分流：
   - 做工作流编排：看 [编排接入指南](./orchestrator/README.md)
   - 做服务接入：看客户端示例或 [API 参考](./reference/api.md)
   - 做部署上线：看 [Compose 部署](./deploy/compose.md) 或 [Kubernetes 部署](./deploy/kubernetes.md)

如果你已经明确知道自己要把 ExecGo 作为上层 Agent 的执行后端，那么可以直接从 [编排接入指南](./orchestrator/README.md) 开始。

## 这条分支解决什么问题

`main` 分支适合下面这类场景：

- 你需要一个可嵌入的执行内核，把任务图可靠地转成实际的工具调用。
- 你想优先交付单节点版本，而不是先建设完整的分布式控制面。
- 你希望接口简单，部署轻量，默认只依赖 Go 标准库和本地 JSON 持久化。

这条线强调的是“稳定交付”而不是“集群能力预研”。如果你更关心事件溯源、队列、Worker 和远程执行，请改读 `feat-add-cluster` 分支文档。

## 推荐阅读路径

### 路径 A：先把链路跑通

1. [HTTP API 入门](./integration/http-api-getting-started.md)
2. [Task DSL 参考](./reference/task-dsl.md)
3. [API 参考](./reference/api.md)
4. [FAQ](./faqs.md)

### 路径 B：把 ExecGo 接到自己的编排层

1. [编排接入指南](./orchestrator/README.md)
2. [DAG 到 TaskGraph 的映射](./orchestrator/mapping-dag-to-taskgraph.md)
3. [失败与跳过语义](./orchestrator/failure-semantics.md)
4. [轮询与幂等](./orchestrator/polling-and-idempotency.md)

### 路径 C：准备上线部署

1. [Docker Compose 部署](./deploy/compose.md)
2. [Kubernetes 部署](./deploy/kubernetes.md)
3. [v1.0.0 发布说明](./releases/v1.0.0.md)

## 文档地图

### 1. 编排接入

- [编排接入指南](./orchestrator/README.md)：先建立正确心智模型，再决定是否一次性提交整张 DAG。
- [DAG 到 TaskGraph 的映射](./orchestrator/mapping-dag-to-taskgraph.md)：解释节点、边、依赖和动态参数应该怎么翻译。
- [失败与跳过语义](./orchestrator/failure-semantics.md)：说明 `failed`、`skipped`、`retry` 各自意味着什么。
- [轮询与幂等](./orchestrator/polling-and-idempotency.md)：给出稳定的提交和查询策略。

### 2. 接口与任务模型

- [HTTP API 入门](./integration/http-api-getting-started.md)：最适合第一次接入。
- [Task DSL 参考](./reference/task-dsl.md)：整理任务字段、两种提交风格和常见校验错误。
- [API 参考](./reference/api.md)：整理请求顺序、状态码和查询方式。
- [执行器参考](./reference/executors.md)：介绍内置执行器、参数入口和安全边界。

### 3. 客户端接入

- [Go 客户端示例](./integration/client-go.md)
- [Java 客户端示例](./integration/client-java.md)
- [Python 客户端示例](./integration/client-python.md)
- [Node.js + TypeScript 客户端示例](./integration/client-nodejs-ts.md)

### 4. 部署与发布

- [Docker Compose 部署](./deploy/compose.md)
- [Kubernetes 部署](./deploy/kubernetes.md)
- [v1.0.0 发布说明](./releases/v1.0.0.md)

### 5. 补充资料

`reference/` 目录下还保留了更细的拆分页，方便你在需要时继续深挖某一部分实现细节。它们更像资料库，而不是第一次阅读时的主线入口。
