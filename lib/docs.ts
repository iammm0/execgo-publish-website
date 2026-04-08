export type DocSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  code?: string;
  tip?: string;
};

export type DocCategory = "开始使用" | "核心指南" | "进阶主题" | "参考手册";

export type DocPage = {
  slug: string[];
  title: string;
  description: string;
  category: DocCategory;
  order: number;
  updatedAt: string;
  readingTime: string;
  sections: DocSection[];
};

export type DocGroup = {
  category: DocCategory;
  pages: DocPage[];
};

const CATEGORY_ORDER: DocCategory[] = [
  "开始使用",
  "核心指南",
  "进阶主题",
  "参考手册",
];

const docs: DocPage[] = [
  {
    slug: ["introduction"],
    title: "项目简介",
    description:
      "了解 execgo 的定位、设计目标以及它与传统任务执行方案的差异。",
    category: "开始使用",
    order: 1,
    updatedAt: "2026-04-08",
    readingTime: "4 分钟",
    sections: [
      {
        id: "why-execgo",
        title: "为什么是 execgo",
        paragraphs: [
          "execgo 是面向执行编排场景设计的 Go 框架，关注任务定义、运行时调度、状态跟踪和失败恢复。",
          "与只处理单次命令执行的工具相比，execgo 更强调流程化编排、可观测性与团队协作能力。",
        ],
        bullets: [
          "统一任务入口：支持 CLI、HTTP、Webhook 等触发方式。",
          "显式状态流：任务从接收、执行、重试到完成都有可追踪事件。",
          "插件化扩展：通过适配器连接队列、存储、日志、通知系统。",
        ],
      },
      {
        id: "design-goals",
        title: "设计目标",
        paragraphs: [
          "项目以基础设施框架为目标，不追求一次性脚本效率，而是追求长期可维护与可治理。",
        ],
        bullets: [
          "可组合：核心能力拆分为最小模块，支持按需组合。",
          "可观测：默认输出结构化日志与执行指标。",
          "可迁移：配置驱动，降低跨环境迁移成本。",
          "可演进：功能通过插件和中间件扩展，避免核心臃肿。",
        ],
      },
      {
        id: "architecture-at-a-glance",
        title: "架构一览",
        paragraphs: [
          "典型执行链路为：请求进入 -> 路由匹配 -> 上下文注入 -> 流水线执行 -> 结果持久化 -> 事件通知。",
        ],
        code: [
          "Client -> Gateway -> execgo Router -> Pipeline -> Runner",
          "                                        |",
          "                                        +-> Storage",
          "                                        +-> Metrics",
          "                                        +-> Event Bus",
        ].join("\n"),
      },
    ],
  },
  {
    slug: ["quickstart"],
    title: "快速开始",
    description: "5 分钟内创建第一个 execgo 项目，并运行一个可观测的任务流。",
    category: "开始使用",
    order: 2,
    updatedAt: "2026-04-08",
    readingTime: "6 分钟",
    sections: [
      {
        id: "install",
        title: "安装",
        paragraphs: ["推荐使用 Go 1.22+，并通过 go install 安装 CLI。"],
        code: [
          "go install github.com/iammm0/execgo/cmd/execgo@latest",
          "execgo version",
        ].join("\n"),
      },
      {
        id: "create-project",
        title: "初始化项目",
        paragraphs: ["使用脚手架生成配置、目录和样例任务。"],
        code: [
          "execgo init hello-execgo",
          "cd hello-execgo",
          "execgo dev",
        ].join("\n"),
        tip: "执行后会启动本地调试服务，并输出任务执行日志。",
      },
      {
        id: "first-pipeline",
        title: "第一个 Pipeline",
        paragraphs: ["在 `pipelines/build.yaml` 中定义一个三步流水线：拉取、编译、发布。"],
        code: [
          "name: build-and-release",
          "steps:",
          "  - name: checkout",
          "    run: git clone {{ .repo }} ./workspace",
          "  - name: build",
          "    run: go build -o dist/app ./workspace/cmd/server",
          "  - name: publish",
          "    run: ./scripts/publish.sh dist/app",
        ].join("\n"),
      },
      {
        id: "run",
        title: "触发执行",
        paragraphs: ["可通过 CLI 或 HTTP 接口触发。下面示例为 CLI 方式："],
        code: [
          "execgo run build-and-release --payload '{\"repo\":\"https://github.com/acme/demo\"}'",
          "execgo logs --follow",
        ].join("\n"),
      },
    ],
  },
  {
    slug: ["core-concepts"],
    title: "核心概念",
    description: "理解 Task、Job、Pipeline、Runner、Plugin 等关键对象。",
    category: "核心指南",
    order: 3,
    updatedAt: "2026-04-08",
    readingTime: "5 分钟",
    sections: [
      {
        id: "entities",
        title: "对象关系",
        paragraphs: [
          "Task 是业务层定义，Job 是一次执行实例，Pipeline 负责描述执行步骤，Runner 负责实际落地。",
        ],
        bullets: [
          "Task：可复用的执行模板，声明输入和约束。",
          "Job：Task 的一次运行快照，包含上下文和状态。",
          "Pipeline：步骤拓扑，定义先后关系和失败策略。",
          "Runner：执行器，管理命令执行、超时与结果回传。",
        ],
      },
      {
        id: "context-model",
        title: "上下文模型",
        paragraphs: [
          "execgo 将请求上下文、任务上下文和运行上下文分层管理，防止状态污染。",
        ],
        bullets: [
          "Request Context：请求级元数据，如 trace id、操作者。",
          "Task Context：任务输入与中间变量。",
          "Runtime Context：资源句柄、取消信号、重试计数。",
        ],
      },
      {
        id: "failure-strategy",
        title: "失败与重试策略",
        paragraphs: [
          "每个步骤可定义独立的重试次数和退避策略，整体 Pipeline 也可配置失败后动作。",
        ],
        code: [
          "retry:",
          "  max_attempts: 3",
          "  backoff: exponential",
          "  min_delay: 1s",
          "  max_delay: 30s",
        ].join("\n"),
      },
    ],
  },
  {
    slug: ["router-and-handlers"],
    title: "路由与处理器",
    description: "将外部请求映射为 execgo 任务的入口层设计。",
    category: "核心指南",
    order: 4,
    updatedAt: "2026-04-08",
    readingTime: "6 分钟",
    sections: [
      {
        id: "route-definition",
        title: "路由定义",
        paragraphs: [
          "Router 负责协议适配和请求分发。你可以绑定 HTTP 路径、CLI 命令或事件主题。",
        ],
        code: [
          "r := execgo.NewRouter()",
          "r.POST(\"/v1/jobs/build\", handlers.Trigger(\"build-and-release\"))",
          "r.CLI(\"release\", handlers.Trigger(\"release-prod\"))",
        ].join("\n"),
      },
      {
        id: "middleware",
        title: "中间件能力",
        paragraphs: ["中间件支持鉴权、限流、审计、灰度策略等横切逻辑。"],
        bullets: [
          "AuthMiddleware：统一认证与租户识别。",
          "RateLimitMiddleware：防止突发流量压垮执行器。",
          "AuditMiddleware：将关键操作写入审计日志。",
        ],
      },
      {
        id: "handler-contract",
        title: "处理器约定",
        paragraphs: ["处理器返回统一结构，便于调用方与网关协同。"],
        code: [
          "type Response struct {",
          "  JobID   string `json:\"job_id\"`",
          "  Status  string `json:\"status\"`",
          "  Message string `json:\"message\"`",
          "}",
        ].join("\n"),
      },
    ],
  },
  {
    slug: ["pipelines"],
    title: "Pipeline 设计",
    description: "如何设计可维护、可复用、可回滚的执行流水线。",
    category: "核心指南",
    order: 5,
    updatedAt: "2026-04-08",
    readingTime: "7 分钟",
    sections: [
      {
        id: "step-model",
        title: "步骤模型",
        paragraphs: ["每个步骤都包含输入映射、执行命令、成功条件和补偿动作。"],
        bullets: [
          "输入映射：将上一步输出映射为当前参数。",
          "执行命令：支持 shell、binary、container runner。",
          "成功条件：可配置 exit code、stdout 关键字或自定义判定器。",
          "补偿动作：步骤失败时执行清理或回滚。",
        ],
      },
      {
        id: "dependency",
        title: "依赖关系",
        paragraphs: ["Pipeline 支持 DAG 模型，不强制线性执行。"],
        code: [
          "steps:",
          "  - name: unit-test",
          "  - name: lint",
          "  - name: package",
          "    needs: [unit-test, lint]",
        ].join("\n"),
      },
      {
        id: "template",
        title: "模板复用",
        paragraphs: ["通过模板参数复用流水线，减少重复配置。"],
        code: [
          "execgo run build-template \\",
          "  --var service=payment \\",
          "  --var env=staging",
        ].join("\n"),
      },
    ],
  },
  {
    slug: ["plugin-system"],
    title: "插件系统",
    description: "通过插件接入外部系统，如队列、对象存储、告警与审批。",
    category: "进阶主题",
    order: 6,
    updatedAt: "2026-04-08",
    readingTime: "6 分钟",
    sections: [
      {
        id: "plugin-lifecycle",
        title: "生命周期",
        paragraphs: [
          "插件包含 Init、Start、Stop 三阶段。框架在启动时自动注入依赖，关闭时执行优雅退出。",
        ],
      },
      {
        id: "plugin-interface",
        title: "插件接口",
        paragraphs: ["实现标准接口即可被加载。推荐将配置验证放在 Init 阶段。"],
        code: [
          "type Plugin interface {",
          "  Name() string",
          "  Init(ctx context.Context, cfg map[string]any) error",
          "  Start(ctx context.Context) error",
          "  Stop(ctx context.Context) error",
          "}",
        ].join("\n"),
      },
      {
        id: "best-practice",
        title: "实践建议",
        paragraphs: ["插件开发遵循最小职责原则，避免将业务逻辑混入基础设施插件。"],
        bullets: [
          "一类插件只做一件事，例如只负责告警投递。",
          "为插件补充健康检查与超时保护。",
          "插件内部错误应标准化，便于监控系统聚合。",
        ],
      },
    ],
  },
  {
    slug: ["configuration"],
    title: "配置体系",
    description: "管理环境配置、密钥、运行参数与多环境差异。",
    category: "进阶主题",
    order: 7,
    updatedAt: "2026-04-08",
    readingTime: "5 分钟",
    sections: [
      {
        id: "config-layer",
        title: "分层配置",
        paragraphs: [
          "execgo 配置遵循 Base -> Environment -> Secret 三层覆盖规则。",
        ],
        bullets: [
          "Base：通用默认配置，进仓库版本管理。",
          "Environment：环境差异配置，例如 staging 与 production。",
          "Secret：敏感信息，从密钥系统注入而非写入仓库。",
        ],
      },
      {
        id: "sample",
        title: "示例配置",
        code: [
          "server:",
          "  host: 0.0.0.0",
          "  port: 8080",
          "runtime:",
          "  worker: 8",
          "  max_concurrency: 32",
          "observability:",
          "  metrics: true",
          "  tracing: true",
        ].join("\n"),
        paragraphs: ["推荐把配置拆分到 `config/*.yaml` 并用 `--env` 选择。"],
      },
      {
        id: "validation",
        title: "配置校验",
        paragraphs: ["启动前执行配置校验，避免运行时才发现关键参数缺失。"],
        code: ["execgo config validate --env production"].join("\n"),
      },
    ],
  },
  {
    slug: ["observability"],
    title: "可观测性",
    description: "接入日志、指标和链路追踪，定位执行问题并持续优化。",
    category: "进阶主题",
    order: 8,
    updatedAt: "2026-04-08",
    readingTime: "6 分钟",
    sections: [
      {
        id: "logs",
        title: "结构化日志",
        paragraphs: [
          "日志默认以 JSON 输出，并附带 job_id、pipeline、step、duration 等字段。",
        ],
        code: [
          "{",
          "  \"level\": \"info\",",
          "  \"job_id\": \"job_01J...\",",
          "  \"pipeline\": \"build-and-release\",",
          "  \"step\": \"build\",",
          "  \"duration_ms\": 3120",
          "}",
        ].join("\n"),
      },
      {
        id: "metrics",
        title: "指标模型",
        paragraphs: ["框架内置执行成功率、重试次数、任务延迟等核心指标。"],
        bullets: [
          "execgo_job_total",
          "execgo_job_failed_total",
          "execgo_step_duration_seconds",
          "execgo_queue_lag_seconds",
        ],
      },
      {
        id: "tracing",
        title: "链路追踪",
        paragraphs: ["通过 OpenTelemetry 将跨服务执行链路串联起来。"],
        tip: "建议将 trace id 回传给调用方，便于排障时快速定位。",
      },
    ],
  },
  {
    slug: ["deployment"],
    title: "部署指南",
    description: "介绍从单机到集群的部署模式，以及生产环境建议。",
    category: "参考手册",
    order: 9,
    updatedAt: "2026-04-08",
    readingTime: "8 分钟",
    sections: [
      {
        id: "modes",
        title: "部署模式",
        bullets: [
          "单机模式：适合本地开发与小型环境。",
          "主从模式：将调度与执行分离，提升稳定性。",
          "集群模式：多实例横向扩展，适合高并发任务场景。",
        ],
        paragraphs: ["生产环境推荐至少 2 个调度实例和独立持久层。"],
      },
      {
        id: "container",
        title: "容器化部署",
        paragraphs: ["使用官方镜像可快速接入 Kubernetes 或其他容器平台。"],
        code: [
          "docker run -d --name execgo \\",
          "  -p 8080:8080 \\",
          "  -v $(pwd)/config:/app/config \\",
          "  ghcr.io/iammm0/execgo:latest",
        ].join("\n"),
      },
      {
        id: "production-checklist",
        title: "生产检查清单",
        bullets: [
          "开启鉴权与 RBAC。",
          "配置限流与任务并发上限。",
          "接入持久化存储与备份策略。",
          "启用日志与监控告警。",
          "预演失败恢复和回滚流程。",
        ],
        paragraphs: [],
      },
    ],
  },
  {
    slug: ["cli-reference"],
    title: "CLI 参考",
    description: "常用命令与参数速查。",
    category: "参考手册",
    order: 10,
    updatedAt: "2026-04-08",
    readingTime: "5 分钟",
    sections: [
      {
        id: "common-commands",
        title: "常用命令",
        code: [
          "execgo init <project>",
          "execgo dev",
          "execgo run <pipeline> --payload '<json>'",
          "execgo logs --follow --job <job_id>",
          "execgo config validate --env <env>",
        ].join("\n"),
        paragraphs: ["命令默认会读取当前目录 `execgo.yaml`。"],
      },
      {
        id: "global-options",
        title: "全局参数",
        bullets: [
          "--env: 指定配置环境。",
          "--config: 指定配置文件路径。",
          "--output: 输出格式（text/json）。",
          "--verbose: 输出调试日志。",
        ],
        paragraphs: [],
      },
      {
        id: "exit-codes",
        title: "退出码约定",
        bullets: [
          "0：执行成功。",
          "1：通用错误。",
          "2：配置错误。",
          "3：运行时错误或外部依赖不可用。",
        ],
        paragraphs: [],
      },
    ],
  },
  {
    slug: ["faq"],
    title: "常见问题",
    description: "汇总接入、运行和排障中的高频问题。",
    category: "参考手册",
    order: 11,
    updatedAt: "2026-04-08",
    readingTime: "4 分钟",
    sections: [
      {
        id: "faq-1",
        title: "execgo 与 cron/CI 有什么区别？",
        paragraphs: [
          "cron 更适合固定时间触发，CI 更强调代码构建流程，而 execgo 面向通用执行编排，支持更多触发源与状态治理能力。",
        ],
      },
      {
        id: "faq-2",
        title: "如何保证任务幂等？",
        paragraphs: [
          "建议在任务输入中加入幂等键，并在执行前做去重校验。对外部副作用操作可通过补偿步骤进行兜底。",
        ],
      },
      {
        id: "faq-3",
        title: "任务偶发超时应该怎么排查？",
        bullets: [
          "检查步骤级超时配置是否过低。",
          "查看外部依赖响应时延和错误率。",
          "通过 trace 关联上游请求链路。",
          "对易抖动步骤启用指数退避重试。",
        ],
        paragraphs: [],
      },
    ],
  },
];

function sortedDocs(): DocPage[] {
  return [...docs].sort((a, b) => a.order - b.order);
}

function slugToPath(slug: string[]): string {
  return slug.join("/");
}

export function getAllDocs(): DocPage[] {
  return sortedDocs();
}

export function getDocGroups(): DocGroup[] {
  const grouped = new Map<DocCategory, DocPage[]>();
  for (const category of CATEGORY_ORDER) {
    grouped.set(category, []);
  }

  for (const doc of sortedDocs()) {
    const collection = grouped.get(doc.category);
    if (collection) {
      collection.push(doc);
    }
  }

  return CATEGORY_ORDER.map((category) => ({
    category,
    pages: grouped.get(category) ?? [],
  }));
}

export function getDocBySlug(slug?: string[]): DocPage | undefined {
  const defaultPath = "introduction";
  const path = slug && slug.length > 0 ? slugToPath(slug) : defaultPath;
  return sortedDocs().find((doc) => slugToPath(doc.slug) === path);
}

export function getDocPath(slug: string[]): string {
  return `/docs/${slugToPath(slug)}`;
}

export function getPrevNextDoc(slug: string[]): {
  previous?: DocPage;
  next?: DocPage;
} {
  const currentPath = slugToPath(slug);
  const all = sortedDocs();
  const index = all.findIndex((doc) => slugToPath(doc.slug) === currentPath);

  return {
    previous: index > 0 ? all[index - 1] : undefined,
    next: index >= 0 && index < all.length - 1 ? all[index + 1] : undefined,
  };
}

export function getStaticDocSlugs(): string[][] {
  return sortedDocs().map((doc) => doc.slug);
}
