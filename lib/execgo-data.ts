import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

const EXECGO_ROOT = path.join(process.cwd(), "execgo");
const CONTENT_ROOT = path.join(process.cwd(), "content", "execgo-branches");
const GITHUB_REPO = "https://github.com/iammm0/execgo";
const DEFAULT_DOC_SLUG = ["zh"];

export type BranchId = "main" | "feat-add-cluster";

type BranchCopy = {
  id: BranchId;
  branchName: string;
  label: string;
  badge: string;
  channel: string;
  summary: string;
  description: string;
  audience: string;
  rollout: string;
  narrative: string[];
  focusAreas: string[];
  refCandidates: string[];
};

export type GitCommit = {
  hash: string;
  shortHash: string;
  subject: string;
  author: string;
  authoredAt: string;
  authoredDateLabel: string;
};

export type DiffItem = {
  status: string;
  path: string;
  previousPath?: string;
};

export type DiffSummary = {
  filesChanged: number;
  insertions: number;
  deletions: number;
  items: DiffItem[];
};

export type Capability = {
  title: string;
  description: string;
  evidence: string[];
  tags?: string[];
};

export type ModuleCard = {
  title: string;
  path: string;
  description: string;
  note?: string;
};

export type HttpRoute = {
  method: string;
  path: string;
};

export type GrpcMethod = {
  service: string;
  rpc: string;
};

export type ExecutorSurface = {
  categories: string[];
  tools: string[];
};

export type BranchStats = {
  totalFiles: number;
  goFiles: number;
  zhDocs: number;
  enDocs: number;
  unitTests: number;
  moduleTests: number;
  integrationTests: number;
  contribModules: number;
  httpRoutes: number;
  grpcMethods: number;
};

export type ChangedArea = {
  title: string;
  count: number;
  samples: string[];
};

export type DocEntry = {
  title: string;
  slug: string[];
  slugKey: string;
  repoPath: string;
  locale: string;
  localeLabel: string;
  section: string;
  sectionLabel: string;
  href: string;
};

export type DocNavSection = {
  title: string;
  items: DocEntry[];
};

export type DocNavGroup = {
  locale: string;
  title: string;
  sections: DocNavSection[];
};

export type MarkdownHeading = {
  id: string;
  title: string;
  depth: number;
};

export type BranchSnapshot = BranchCopy & {
  ref: string;
  latestCommit: GitCommit;
  stats: BranchStats;
  diff?: DiffSummary;
  changedAreas: ChangedArea[];
  docs: DocEntry[];
  docGroups: DocNavGroup[];
  recommendedDocs: DocEntry[];
  capabilities: Capability[];
  moduleCards: ModuleCard[];
  httpRoutes: HttpRoute[];
  grpcMethods: GrpcMethod[];
  executorSurface: ExecutorSurface;
  readmeExcerpt: string[];
  releaseHighlights: string[];
  releaseVersion: string;
  releaseDate: string;
  githubBranchUrl: string;
  topChangedFiles: DiffItem[];
};

export type DocPageData = {
  branch: BranchSnapshot;
  entry: DocEntry;
  title: string;
  content: string;
  headings: MarkdownHeading[];
  excerpt: string[];
};

type SiteTimelineItem = {
  shortHash: string;
  date: string;
  subject: string;
  decoration: string;
};

type SiteData = {
  releaseVersion: string;
  releaseDate: string;
  comparisonRows: Array<{
    aspect: string;
    main: string;
    cluster: string;
  }>;
  branches: BranchSnapshot[];
  timeline: SiteTimelineItem[];
};

const BRANCHES: Record<BranchId, BranchCopy> = {
  main: {
    id: "main",
    branchName: "main",
    label: "稳定主线",
    badge: "Stable Release",
    channel: "v1.0.0",
    summary:
      "当前正式发布线，强调稳定的 DAG 调度、内置执行器、HTTP/gRPC 接口、JSON 持久化和完整的发布链路。",
    description:
      "适合直接作为单节点执行内核、内部任务编排服务，或者嵌入到你自己的 Go 服务中。",
    audience:
      "平台工程师、Agent 平台研发，以及希望优先落地执行内核而不是先搭建分布式控制面的团队。",
    rollout: "生产可用",
    narrative: [
      "从 cmd/execgo/main.go 可以看到，这条线保持了非常清晰的装配顺序：配置、日志、指标、JSON 状态管理、调度器、HTTP 和可选 gRPC 服务逐步挂起。",
      "从 pkg/httpserver/engine.go 与 pkg/executor/os.go 可以确认，主线已经覆盖任务提交、查询、健康检查、指标、MCP 以及 shell、file、dns、tcp、sleep、noop、http 等基础工具能力。",
      "从 docs/、Dockerfile、Compose、Kubernetes 配置和 CHANGELOG 可以看出，它已经是一条文档、测试、部署、版本说明都闭环的发布线。",
    ],
    focusAreas: [
      "单节点执行内核",
      "HTTP / gRPC 双接口",
      "JSON 持久化",
      "Task DSL 与 DAG 校验",
      "v1.0.0 发布说明",
    ],
    refCandidates: [
      "main",
      "origin/main",
      "master",
      "origin/master",
      "HEAD",
    ],
  },
  "feat-add-cluster": {
    id: "feat-add-cluster",
    branchName: "feat-add-cluster",
    label: "集群预览线",
    badge: "Cluster Preview",
    channel: "Runtime v2",
    summary:
      "在稳定内核之上，引入事件溯源、任务队列、远程 Worker、沙箱执行和 WorkerControl gRPC 协议，形成分布式控制面的雏形。",
    description:
      "适合需要跨节点执行、事件回放、幂等提交、Redis 队列或 Postgres/SQLite 事件存储的场景。",
    audience:
      "正在建设 Agent Runtime、分布式任务平台，或者希望把 ExecGo 扩展为控制平面的团队。",
    rollout: "预览功能线",
    narrative: [
      "从 cmd/execgo/main.go 的初始化顺序可以直接看到，运行时已经扩展为事件存储、队列、Worker、沙箱和观测运行时的组合，而不再只是本地调度器加文件存储。",
      "从 pkg/store/eventsourced、pkg/events、pkg/taskqueue 与 pkg/worker 可以确认，这条线不是增加几个接口，而是把状态管理、调度与执行模型重构成了事件驱动架构。",
      "从 contrib/grpcapi/proto/execgo/v1/execgo.proto 的 WorkerControl 服务和新增端到端测试可以看出，控制面与执行面的拆分方向已经非常明确。",
    ],
    focusAreas: [
      "事件溯源状态管理",
      "Redis / Memory 队列",
      "本地与远程 Worker",
      "Docker / Local 沙箱",
      "WorkerControl gRPC",
    ],
    refCandidates: ["origin/feat-add-cluster", "feat-add-cluster"],
  },
};

const CAPABILITIES: Record<BranchId, Capability[]> = {
  main: [
    {
      title: "执行入口完整",
      description:
        "已经具备 POST /tasks、GET /tasks/{id}、GET /health、GET /metrics 以及 MCP 相关接口，可以直接作为任务执行服务对外发布。",
      evidence: [
        "pkg/httpserver/engine.go",
        "tests/integration/http_task_flow_integration_test.go",
        "tests/integration/http_error_flow_integration_test.go",
      ],
      tags: ["REST", "MCP", "Health"],
    },
    {
      title: "DAG 调度与校验",
      description:
        "任务图模型包含依赖校验、重试、超时和状态推进约束，适合充当上层 Agent 或 Orchestrator 的执行后端。",
      evidence: [
        "pkg/models/task.go",
        "pkg/scheduler/scheduler.go",
        "tests/unit/taskgraph_validation_test.go",
      ],
      tags: ["TaskGraph", "Retry", "Timeout"],
    },
    {
      title: "内置执行器矩阵",
      description:
        "通过 os 类别聚合 shell、file、dns、tcp、sleep、noop、http 等工具，同时补充 mcp 与 cli-skills 执行器。",
      evidence: [
        "pkg/executor/executor.go",
        "pkg/executor/os.go",
        "pkg/executor/mcp.go",
        "pkg/executor/cli_skills.go",
      ],
      tags: ["Shell", "File", "HTTP", "MCP"],
    },
    {
      title: "部署与接入闭环",
      description:
        "主线同时提供 Docker、Compose、Kubernetes、gRPC 协议和多语言接入文档，是可以直接拿来发布和接入的版本线。",
      evidence: [
        "Dockerfile",
        "docker-compose.yml",
        "k8s/deployment.yaml",
        "contrib/grpcapi/proto/execgo/v1/execgo.proto",
      ],
      tags: ["Docker", "K8s", "gRPC"],
    },
  ],
  "feat-add-cluster": [
    {
      title: "事件溯源状态中心",
      description:
        "运行时状态由事件日志回放构建，支持历史追踪、幂等窗口与 Worker 状态建模，不再依赖单纯的 JSON 快照。",
      evidence: [
        "pkg/store/eventsourced/manager.go",
        "pkg/events/store.go",
        "pkg/events/sqlite/store.go",
        "pkg/events/postgres/store.go",
      ],
      tags: ["Event Sourcing", "Replay", "Idempotency"],
    },
    {
      title: "队列化调度与远程执行",
      description:
        "调度器把可执行任务写入队列，由 Worker 拉取、租约、执行和上报结果，从而把控制面与执行面拆开。",
      evidence: [
        "pkg/scheduler/scheduler.go",
        "pkg/taskqueue/queue.go",
        "pkg/taskqueue/redis.go",
        "pkg/worker/worker.go",
      ],
      tags: ["Queue", "Lease", "Remote Worker"],
    },
    {
      title: "WorkerControl 协议",
      description:
        "新增 WorkerControl gRPC 服务，支持注册、心跳、拉取任务、Ack/Nack、进度与审计上报，让远程 Worker 接入成为一等能力。",
      evidence: [
        "contrib/grpcapi/proto/execgo/v1/execgo.proto",
        "contrib/grpcapi/pkg/grpcserver/worker_control.go",
        "pkg/worker/remote_grpc_worker.go",
      ],
      tags: ["gRPC", "Control Plane", "Audit"],
    },
    {
      title: "沙箱与观测运行时",
      description:
        "分支内置 Local / Docker 沙箱运行器，并把 HTTP 中间件、Prometheus 和 OpenTelemetry 运行时接入主进程。",
      evidence: [
        "pkg/sandbox/runner.go",
        "pkg/observability/observability.go",
        "cmd/execgo/main.go",
      ],
      tags: ["Sandbox", "Prometheus", "OpenTelemetry"],
    },
  ],
};

const MODULE_CARDS: Record<BranchId, ModuleCard[]> = {
  main: [
    {
      title: "入口进程",
      path: "cmd/execgo/main.go",
      description: "负责装配配置、日志、JSON 状态管理、调度器以及 HTTP / gRPC 服务。",
    },
    {
      title: "HTTP API",
      path: "pkg/httpserver/engine.go",
      description: "定义 /tasks、/mcp/*、/health、/metrics 等核心对外接口。",
    },
    {
      title: "执行器系统",
      path: "pkg/executor",
      description: "通过注册表统一管理内置工具和扩展执行器。",
      note: "shell / file / dns / tcp / sleep / noop / http / mcp / cli-skills",
    },
    {
      title: "调度器",
      path: "pkg/scheduler/scheduler.go",
      description: "负责 DAG 拓扑、依赖计数、并发执行和结果回写。",
    },
    {
      title: "持久化",
      path: "pkg/store/jsonfile/jsonfile.go",
      description: "默认 JSON 文件状态持久化，是主线最轻量的部署方式。",
    },
    {
      title: "文档入口",
      path: "docs/zh",
      description: "覆盖快速开始、DSL、执行器、API、部署、可观测性和扩展开发。",
    },
  ],
  "feat-add-cluster": [
    {
      title: "事件溯源 Store",
      path: "pkg/store/eventsourced/manager.go",
      description: "以事件日志驱动任务、工作流和 Worker 的读模型，并支持回放恢复。",
    },
    {
      title: "事件后端",
      path: "pkg/events",
      description: "提供 memory / sqlite / postgres 三套事件存储实现。",
    },
    {
      title: "任务队列",
      path: "pkg/taskqueue",
      description: "抽象 Memory 与 Redis 队列，为 Worker 拉取和租约提供基础设施。",
    },
    {
      title: "Worker Runtime",
      path: "pkg/worker",
      description: "本地 Worker 和远程 gRPC Worker 都从这里发起执行和上报。",
    },
    {
      title: "沙箱运行器",
      path: "pkg/sandbox/runner.go",
      description: "把执行动作封装进 Local / Docker runner，为隔离与资源约束预留能力。",
    },
    {
      title: "控制面协议",
      path: "contrib/grpcapi/proto/execgo/v1/execgo.proto",
      description: "新增 WorkerControl 服务，把控制面协议显式化。",
    },
  ],
};

const CHANGE_AREA_RULES = [
  {
    title: "控制面与入口层",
    matches: ["cmd/execgo", "contrib/grpcapi", "pkg/httpserver", "pkg/config"],
  },
  {
    title: "运行时与状态机",
    matches: ["pkg/scheduler", "pkg/worker", "pkg/fsm", "pkg/models"],
  },
  {
    title: "事件与存储",
    matches: ["pkg/events", "pkg/store"],
  },
  {
    title: "队列、插件与沙箱",
    matches: ["pkg/taskqueue", "pkg/plugins", "pkg/sandbox"],
  },
  {
    title: "测试回归",
    matches: ["tests/"],
  },
] as const;

const PREFERRED_DOCS: Record<BranchId, string[]> = {
  main: [
    "docs/zh/README.md",
    "docs/zh/releases/v1.0.0.md",
    "docs/zh/integration/http-api-getting-started.md",
    "docs/zh/reference/task-dsl.md",
    "docs/zh/reference/api.md",
    "docs/zh/reference/executors.md",
    "docs/zh/deploy/kubernetes.md",
  ],
  "feat-add-cluster": [
    "docs/zh/README.md",
    "docs/zh/agent-kernel-roadmap.md",
    "docs/zh/orchestrator/polling-and-idempotency.md",
    "docs/zh/reference/runtime-semantics.md",
    "docs/zh/reference/executors.md",
  ],
};

const CURATED_ZH_DOCS: Record<BranchId, string[]> = {
  main: [
    "docs/zh/README.md",
    "docs/zh/orchestrator/README.md",
    "docs/zh/orchestrator/mapping-dag-to-taskgraph.md",
    "docs/zh/orchestrator/failure-semantics.md",
    "docs/zh/orchestrator/polling-and-idempotency.md",
    "docs/zh/integration/http-api-getting-started.md",
    "docs/zh/integration/client-go.md",
    "docs/zh/integration/client-java.md",
    "docs/zh/integration/client-python.md",
    "docs/zh/integration/client-nodejs-ts.md",
    "docs/zh/reference/task-dsl.md",
    "docs/zh/reference/api.md",
    "docs/zh/reference/executors.md",
    "docs/zh/deploy/compose.md",
    "docs/zh/deploy/kubernetes.md",
    "docs/zh/faqs.md",
    "docs/zh/releases/v1.0.0.md",
  ],
  "feat-add-cluster": [
    "docs/zh/README.md",
    "docs/zh/agent-kernel-roadmap.md",
    "docs/zh/orchestrator/README.md",
    "docs/zh/orchestrator/mapping-dag-to-taskgraph.md",
    "docs/zh/orchestrator/failure-semantics.md",
    "docs/zh/orchestrator/polling-and-idempotency.md",
    "docs/zh/integration/http-api-getting-started.md",
    "docs/zh/integration/client-go.md",
    "docs/zh/integration/client-java.md",
    "docs/zh/integration/client-python.md",
    "docs/zh/integration/client-nodejs-ts.md",
    "docs/zh/reference/runtime-semantics.md",
    "docs/zh/reference/task-dsl.md",
    "docs/zh/reference/api.md",
    "docs/zh/reference/executors.md",
    "docs/zh/deploy/compose.md",
    "docs/zh/deploy/kubernetes.md",
    "docs/zh/faqs.md",
  ],
};

const COMPARISON_ROWS = [
  {
    aspect: "运行时形态",
    main: "单节点服务 / 可嵌入执行内核",
    cluster: "控制面 + 队列 + Worker 的分布式预览架构",
  },
  {
    aspect: "状态管理",
    main: "JSON 文件持久化，按周期落盘",
    cluster: "事件溯源 Store，支持事件回放和幂等命中",
  },
  {
    aspect: "执行拓扑",
    main: "进程内调度与执行",
    cluster: "队列化调度，支持本地和远程 Worker",
  },
  {
    aspect: "协议面",
    main: "HTTP + 可选 gRPC ExecGo 服务",
    cluster: "HTTP + ExecGo gRPC + WorkerControl gRPC",
  },
  {
    aspect: "扩展能力",
    main: "执行器、存储子模块、文档与部署模板",
    cluster: "插件管理、沙箱运行器、任务租约和审计",
  },
  {
    aspect: "适用阶段",
    main: "正式发布、官网主叙事、直接落地",
    cluster: "预研、灰度验证、集群演进路线展示",
  },
];

function runGit(args: string[], trim = true): string {
  const output = execFileSync("git", ["-C", EXECGO_ROOT, ...args], {
    encoding: "utf8",
    env: {
      ...process.env,
      LANG: "C.UTF-8",
      LC_ALL: "C.UTF-8",
    },
  });

  return trim ? output.trim() : output;
}

function normalizeRepoPath(filePath: string): string {
  return filePath.split(path.sep).join(path.posix.sep);
}

function branchContentRoot(branchId: BranchId): string {
  return path.join(CONTENT_ROOT, branchId);
}

function walkFiles(root: string): string[] {
  const results: string[] = [];

  function walk(current: string) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const absolutePath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(absolutePath);
        continue;
      }
      results.push(absolutePath);
    }
  }

  walk(root);
  return results;
}

type SnapshotManifest = {
  branch?: string;
  ref?: string;
  generatedAt?: string;
  files?: string[];
};

function readBranchSnapshotManifest(branchId: BranchId): SnapshotManifest | null {
  const filePath = path.join(branchContentRoot(branchId), "snapshot.json");
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as SnapshotManifest;
  } catch {
    return null;
  }
}

function emptyDiffSummary(): DiffSummary {
  return {
    filesChanged: 0,
    insertions: 0,
    deletions: 0,
    items: [],
  };
}

function staticPlaceholderCommit(branchId: BranchId): GitCommit {
  const snap = readBranchSnapshotManifest(branchId);
  const authoredAt = snap?.generatedAt ?? "";

  return {
    hash: "0000000000000000000000000000000000000000",
    shortHash: "local",
    subject: "使用 content 快照（未配置可解析的 execgo Git 引用）",
    author: "execgo-publish-website",
    authoredAt,
    authoredDateLabel: authoredAt ? authoredAt.slice(0, 10) : "",
  };
}

/** 在 ../execgo 仓库中解析分支引用；无法解析时返回 null，由调用方走静态快照逻辑。 */
const resolveExecgoRef = cache((branchId: BranchId): string | null => {
  if (!fs.existsSync(path.join(EXECGO_ROOT, ".git"))) {
    return null;
  }

  for (const ref of BRANCHES[branchId].refCandidates) {
    try {
      runGit(["rev-parse", "--verify", ref]);
      return ref;
    } catch {
      continue;
    }
  }

  return null;
});

const listGitFiles = cache((ref: string): string[] => {
  return runGit(["ls-tree", "-r", "--name-only", ref])
    .split(/\r?\n/)
    .filter(Boolean);
});

const listBranchContentFiles = cache((branchId: BranchId): string[] => {
  return walkFiles(branchContentRoot(branchId))
    .map((absoluteFile) => normalizeRepoPath(path.relative(branchContentRoot(branchId), absoluteFile)))
    .sort((left, right) => left.localeCompare(right, "zh-CN"));
});

const readGitFile = cache((ref: string, repoPath: string): string => {
  return runGit(["show", `${ref}:${repoPath}`], false);
});

const readGitFileSafe = cache((ref: string, repoPath: string): string | null => {
  try {
    return readGitFile(ref, repoPath);
  } catch {
    return null;
  }
});

const readStaticBranchFile = cache((branchId: BranchId, repoPath: string): string => {
  const absolutePath = path.join(branchContentRoot(branchId), ...repoPath.split("/"));
  return fs.readFileSync(absolutePath, "utf8");
});

function countMatching(files: string[], pattern: RegExp): number {
  return files.filter((file) => pattern.test(file)).length;
}

function parseLatestCommit(ref: string): GitCommit {
  const raw = runGit([
    "log",
    ref,
    "-1",
    "--date=short",
    "--format=%H%x1f%h%x1f%s%x1f%an%x1f%aI%x1f%ad",
  ]);
  const [hash, shortHash, subject, author, authoredAt, authoredDateLabel] =
    raw.split("\x1f");

  return {
    hash,
    shortHash,
    subject,
    author,
    authoredAt,
    authoredDateLabel,
  };
}

function parseDiffSummary(baseRef: string, headRef: string): DiffSummary {
  const range = `${baseRef}..${headRef}`;
  const items = runGit(["diff", "--name-status", range])
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("\t");
      return {
        status: parts[0] ?? "",
        previousPath: parts.length === 3 ? parts[1] : undefined,
        path: parts[parts.length - 1] ?? "",
      };
    });

  const shortStat = runGit(["diff", "--shortstat", range]);
  const match =
    /(\d+)\s+files?\s+changed(?:,\s+(\d+)\s+insertions?\(\+\))?(?:,\s+(\d+)\s+deletions?\(-\))?/i.exec(
      shortStat,
    );

  return {
    filesChanged: Number(match?.[1] ?? items.length),
    insertions: Number(match?.[2] ?? 0),
    deletions: Number(match?.[3] ?? 0),
    items,
  };
}

function humanizeSegment(segment: string): string {
  if (!segment) {
    return "总览";
  }

  if (segment === "zh") {
    return "中文";
  }

  return segment.replace(/[-_]/g, " ");
}

function localeLabel(locale: string): string {
  if (locale === "zh") {
    return "中文";
  }

  return locale.toUpperCase();
}

function docPathToSlug(repoPath: string): string[] {
  const withoutPrefix = repoPath.replace(/^docs\//, "").replace(/\.md$/i, "");
  const segments = withoutPrefix.split("/");

  if (segments.at(-1)?.toLowerCase() === "readme") {
    return segments.slice(0, -1);
  }

  return segments;
}

function slugToKey(slug: string[]): string {
  return slug.join("/");
}

/** Next.js 可能把路径段以百分号编码字面量传入，需解码后再与 doc.slugKey 对齐。 */
function decodePathSegment(segment: string): string {
  if (!segment.includes("%")) {
    return segment;
  }
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export function normalizeDocRouteSlug(segments: string[]): string[] {
  return segments.map((segment) => decodePathSegment(segment).normalize("NFC"));
}

function docTitleFromPath(repoPath: string): string {
  const fileName = path.posix.basename(repoPath, ".md");
  const slug = docPathToSlug(repoPath);

  if (fileName.toLowerCase() === "readme") {
    return humanizeSegment(slug.at(-1) ?? "docs");
  }

  return humanizeSegment(fileName);
}

function docSectionMeta(
  repoPath: string,
  locale: string,
): { section: string; sectionLabel: string } {
  if (locale === "zh") {
    if (repoPath === "docs/zh/README.md") {
      return { section: "overview", sectionLabel: "开始这里" };
    }
    if (repoPath === "docs/zh/agent-kernel-roadmap.md") {
      return { section: "roadmap", sectionLabel: "路线图" };
    }
    if (repoPath.startsWith("docs/zh/orchestrator/")) {
      return { section: "orchestrator", sectionLabel: "编排接入" };
    }
    if (repoPath.startsWith("docs/zh/integration/")) {
      return { section: "integration", sectionLabel: "客户端接入" };
    }
    if (repoPath === "docs/zh/reference/runtime-semantics.md") {
      return { section: "runtime", sectionLabel: "运行时语义" };
    }
    if (repoPath.startsWith("docs/zh/reference/")) {
      return { section: "reference", sectionLabel: "核心参考" };
    }
    if (repoPath.startsWith("docs/zh/deploy/")) {
      return { section: "deploy", sectionLabel: "部署" };
    }
    if (repoPath === "docs/zh/faqs.md") {
      return { section: "faq", sectionLabel: "FAQ" };
    }
    if (repoPath.startsWith("docs/zh/releases/")) {
      return { section: "releases", sectionLabel: "发布说明" };
    }
  }

  const slug = docPathToSlug(repoPath);
  const section =
    slug.length <= 1
      ? "overview"
      : slug[1] === "reference" && slug.length > 2
        ? slug[2]
        : slug[1] ?? "overview";

  return {
    section,
    sectionLabel: slug.length <= 1 ? "总览" : humanizeSegment(section),
  };
}

function docOrderIndex(branchId: BranchId, entry: DocEntry): number {
  if (entry.locale === "zh") {
    const index = CURATED_ZH_DOCS[branchId].indexOf(entry.repoPath);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  }

  return Number.MAX_SAFE_INTEGER;
}

function buildDocEntries(branchId: BranchId): DocEntry[] {
  return listBranchContentFiles(branchId)
    .filter((file) => file.startsWith("docs/") && file.endsWith(".md"))
    .filter((file) => file.startsWith("docs/zh/"))
    .map((repoPath) => {
      const slug = docPathToSlug(repoPath);
      const locale = slug[0] ?? "zh";
      const content = readStaticBranchFile(branchId, repoPath);
      const { section, sectionLabel } = docSectionMeta(repoPath, locale);

      return {
        title: extractDocTitle(content, docTitleFromPath(repoPath)),
        slug,
        slugKey: slugToKey(slug),
        repoPath,
        locale,
        localeLabel: localeLabel(locale),
        section,
        sectionLabel,
        href: `/docs/execgo/${branchId}/${slug.join("/")}`,
      };
    })
    .sort((left, right) => left.repoPath.localeCompare(right.repoPath, "zh-CN"));
}

function buildDocGroups(branchId: BranchId, entries: DocEntry[]): DocNavGroup[] {
  const locales = new Map<string, Map<string, DocEntry[]>>();

  const visibleEntries = entries.filter((entry) => {
    return entry.locale === "zh" && CURATED_ZH_DOCS[branchId].includes(entry.repoPath);
  });

  for (const entry of visibleEntries) {
    const sections = locales.get(entry.locale) ?? new Map<string, DocEntry[]>();
    const items = sections.get(entry.sectionLabel) ?? [];
    items.push(entry);
    sections.set(entry.sectionLabel, items);
    locales.set(entry.locale, sections);
  }

  return Array.from(locales.entries())
    .sort(([left], [right]) => {
      const order = (value: string) => (value === "zh" ? 0 : 1);
      return order(left) - order(right) || left.localeCompare(right);
    })
    .map(([locale, sections]) => ({
      locale,
      title: localeLabel(locale),
      sections: Array.from(sections.entries())
        .sort(([, leftItems], [, rightItems]) => {
          const leftOrder = Math.min(...leftItems.map((entry) => docOrderIndex(branchId, entry)));
          const rightOrder = Math.min(...rightItems.map((entry) => docOrderIndex(branchId, entry)));
          return leftOrder - rightOrder;
        })
        .map(([sectionTitle, items]) => {
          const sorted = [...items].sort((left, right) => {
            const leftOrder = docOrderIndex(branchId, left);
            const rightOrder = docOrderIndex(branchId, right);
            return (
              leftOrder - rightOrder ||
              left.repoPath.localeCompare(right.repoPath, "zh-CN")
            );
          });
          // 同一分组下若已有子页面，则省略与分组同名的「目录索引」页，避免侧栏重复且误导。
          const navItems =
            sorted.length > 1
              ? sorted.filter((entry) => entry.title !== sectionTitle)
              : sorted;
          return {
            title: sectionTitle,
            items: navItems,
          };
        }),
    }));
}

function extractReleaseHighlights(changelog: string): string[] {
  const lines = changelog.split(/\r?\n/);
  const highlights: string[] = [];
  let inReleaseSection = false;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (inReleaseSection) {
        break;
      }
      inReleaseSection = true;
      continue;
    }

    if (!inReleaseSection) {
      continue;
    }

    const bullet = line.match(/^\s*-\s+(.*)$/);
    if (bullet?.[1]) {
      highlights.push(bullet[1].trim());
    }
  }

  return highlights.slice(0, 6);
}

function extractExcerpt(markdown: string, limit = 3): string[] {
  const lines = markdown.split(/\r?\n/);
  const paragraphs: string[] = [];
  let inFence = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      inFence = !inFence;
      continue;
    }

    if (inFence || !trimmed) {
      continue;
    }

    if (
      trimmed.startsWith("#") ||
      trimmed.startsWith("|") ||
      trimmed.startsWith(">") ||
      trimmed.startsWith("- ") ||
      trimmed.startsWith("* ") ||
      /^\d+\.\s/.test(trimmed)
    ) {
      continue;
    }

    paragraphs.push(trimmed);
    if (paragraphs.length >= limit) {
      break;
    }
  }

  return paragraphs;
}

export function slugifyHeading(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[`*_~[\]]/g, "")
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function extractHeadings(markdown: string): MarkdownHeading[] {
  return markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .flatMap((line) => {
      const match = /^(##|###)\s+(.*)$/.exec(line);
      if (!match) {
        return [];
      }

      const depth = match[1].length;
      const title = match[2].replace(/\s+#*$/, "").trim();
      return [{ id: slugifyHeading(title), title, depth }];
    });
}

function extractHttpRoutes(ref: string): HttpRoute[] {
  const content = readGitFile(ref, "pkg/httpserver/engine.go");
  return Array.from(content.matchAll(/HandleFunc\("([A-Z]+)\s+([^"]+)"/g)).map(
    (match) => ({
      method: match[1] ?? "",
      path: match[2] ?? "",
    }),
  );
}

function extractGrpcMethods(ref: string): GrpcMethod[] {
  const content = readGitFileSafe(
    ref,
    "contrib/grpcapi/proto/execgo/v1/execgo.proto",
  );
  if (!content) {
    return [];
  }

  const methods: GrpcMethod[] = [];
  let currentService = "";

  for (const line of content.split(/\r?\n/)) {
    const serviceMatch = line.match(/^service\s+(\w+)\s+\{/);
    if (serviceMatch?.[1]) {
      currentService = serviceMatch[1];
      continue;
    }

    const rpcMatch = line.match(/^\s*rpc\s+(\w+)\s+\(/);
    if (rpcMatch?.[1] && currentService) {
      methods.push({
        service: currentService,
        rpc: rpcMatch[1],
      });
    }
  }

  return methods;
}

function normalizeExecutorCategory(value: string): string {
  const known: Record<string, string> = {
    OS: "os",
    MCP: "mcp",
    CLISkills: "cli-skills",
  };

  if (known[value]) {
    return known[value];
  }

  return value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function extractExecutorSurface(ref: string): ExecutorSurface {
  const osExecutor = readGitFile(ref, "pkg/executor/os.go");
  const builtinRegistry = readGitFile(ref, "pkg/executor/executor.go");

  const tools = Array.from(osExecutor.matchAll(/"([^"]+)":\s+\w+\.Execute/g))
    .map((match) => match[1] ?? "")
    .filter(Boolean);

  const categories = Array.from(
    builtinRegistry.matchAll(/Register\(New([A-Za-z]+)Executor/g),
  )
    .map((match) => normalizeExecutorCategory(match[1] ?? ""))
    .filter(Boolean);

  return {
    categories: Array.from(new Set(categories)),
    tools: Array.from(new Set(tools)).sort((left, right) => left.localeCompare(right)),
  };
}

function buildChangedAreas(diff?: DiffSummary): ChangedArea[] {
  if (!diff) {
    return [];
  }

  return CHANGE_AREA_RULES.map((rule) => {
    const matched = diff.items.filter((item) =>
      rule.matches.some((prefix) => item.path.startsWith(prefix)),
    );

    return {
      title: rule.title,
      count: matched.length,
      samples: matched.slice(0, 3).map((item) => item.path),
    };
  }).filter((entry) => entry.count > 0);
}

function parseVersion(versionSource: string): string {
  const match = versionSource.match(/Current\s*=\s*"([^"]+)"/);
  return match?.[1] ?? "v1";
}

function parseReleaseDate(changelog: string): string {
  const match = changelog.match(/##\s+v[^\n]*-\s+(\d{4}-\d{2}-\d{2})/);
  return match?.[1] ?? "";
}

function pickRecommendedDocs(branchId: BranchId, docs: DocEntry[]): DocEntry[] {
  const entries = new Map(docs.map((doc) => [doc.repoPath, doc] as const));
  return PREFERRED_DOCS[branchId]
    .map((repoPath) => entries.get(repoPath))
    .filter((doc): doc is DocEntry => Boolean(doc));
}

function extractDocTitle(markdown: string, fallback: string): string {
  const titleLine = markdown
    .split(/\r?\n/)
    .find((line) => line.trim().startsWith("# "));

  if (!titleLine) {
    return fallback;
  }

  return titleLine.replace(/^#\s+/, "").trim();
}

function stripLeadingTitle(markdown: string): string {
  const lines = markdown.split(/\r?\n/);
  let index = 0;

  while (index < lines.length && !lines[index].trim()) {
    index += 1;
  }

  if (!lines[index]?.trim().startsWith("# ")) {
    return markdown;
  }

  index += 1;
  while (index < lines.length && !lines[index].trim()) {
    index += 1;
  }

  return lines.slice(index).join("\n");
}

function ensureBranchId(value: string): BranchId | null {
  if (value === "main" || value === "feat-add-cluster") {
    return value;
  }

  return null;
}

function getDocEntry(branchId: BranchId, slugKey: string): DocEntry | null {
  const branch = getBranchSnapshot(branchId);
  const targetKey = slugKey || slugToKey(DEFAULT_DOC_SLUG);
  return branch.docs.find((doc) => doc.slugKey === targetKey) ?? null;
}

export const getBranchSnapshot = cache((branchId: BranchId): BranchSnapshot => {
  const gitRef = resolveExecgoRef(branchId);
  const useGit = gitRef !== null;
  const ref = useGit ? gitRef : `content/execgo-branches/${branchId}`;
  const fileIndex = useGit ? listGitFiles(gitRef) : listBranchContentFiles(branchId);
  const docs = buildDocEntries(branchId);
  const changelog = readStaticBranchFile(branchId, "CHANGELOG.md");
  const readme = readStaticBranchFile(branchId, "README.md");
  const versionSource = readStaticBranchFile(branchId, "pkg/version/version.go");
  const mainRef = resolveExecgoRef("main");
  const diff =
    branchId === "main"
      ? undefined
      : useGit && mainRef
        ? parseDiffSummary(mainRef, gitRef!)
        : emptyDiffSummary();

  return {
    ...BRANCHES[branchId],
    ref,
    latestCommit: useGit ? parseLatestCommit(gitRef) : staticPlaceholderCommit(branchId),
    stats: {
      totalFiles: fileIndex.length,
      goFiles: countMatching(fileIndex, /\.go$/),
      zhDocs: countMatching(docs.map((doc) => doc.repoPath), /^docs\/zh\/.*\.md$/),
      enDocs: countMatching(docs.map((doc) => doc.repoPath), /^docs\/en\/.*\.md$/),
      unitTests: countMatching(fileIndex, /^tests\/unit\/.*_test\.go$/),
      moduleTests: countMatching(fileIndex, /^tests\/module\/.*_test\.go$/),
      integrationTests: countMatching(fileIndex, /^tests\/integration\/.*_test\.go$/),
      contribModules: Array.from(
        new Set(
          fileIndex
            .filter((file) => file.startsWith("contrib/"))
            .map((file) => file.split("/").slice(0, 2).join("/")),
        ),
      ).length,
      httpRoutes: useGit ? extractHttpRoutes(gitRef).length : 0,
      grpcMethods: useGit ? extractGrpcMethods(gitRef).length : 0,
    },
    diff,
    changedAreas: buildChangedAreas(diff),
    docs,
    docGroups: buildDocGroups(branchId, docs),
    recommendedDocs: pickRecommendedDocs(branchId, docs),
    capabilities: CAPABILITIES[branchId],
    moduleCards: MODULE_CARDS[branchId],
    httpRoutes: useGit ? extractHttpRoutes(gitRef) : [],
    grpcMethods: useGit ? extractGrpcMethods(gitRef) : [],
    executorSurface: useGit ? extractExecutorSurface(gitRef) : { categories: [], tools: [] },
    readmeExcerpt: extractExcerpt(readme),
    releaseHighlights: extractReleaseHighlights(changelog),
    releaseVersion: parseVersion(versionSource),
    releaseDate: parseReleaseDate(changelog),
    githubBranchUrl: `${GITHUB_REPO}/tree/${BRANCHES[branchId].branchName}`,
    topChangedFiles: diff?.items.slice(0, 16) ?? [],
  };
});

export const getSiteData = cache((): SiteData => {
  const main = getBranchSnapshot("main");
  const cluster = getBranchSnapshot("feat-add-cluster");

  const canQueryExecgoGit =
    resolveExecgoRef("main") !== null || resolveExecgoRef("feat-add-cluster") !== null;

  const timeline = (() => {
    if (!canQueryExecgoGit) {
      return [];
    }

    try {
      return runGit([
        "log",
        "--all",
        "--date=short",
        "--format=%h%x1f%ad%x1f%s%x1f%d",
        "-n",
        "10",
      ])
        .split(/\r?\n/)
        .filter(Boolean)
        .map((line) => {
          const [shortHash, date, subject, decoration] = line.split("\x1f");
          return {
            shortHash,
            date,
            subject,
            decoration: decoration?.replace(/[()]/g, "").trim() ?? "",
          };
        });
    } catch {
      return [];
    }
  })();

  return {
    releaseVersion: main.releaseVersion,
    releaseDate: main.releaseDate,
    comparisonRows: COMPARISON_ROWS,
    branches: [main, cluster],
    timeline,
  };
});

export function getBranchIdOrNull(input: string): BranchId | null {
  return ensureBranchId(input);
}

export function getDocPageData(
  branchId: BranchId,
  slug: string[] = [],
): DocPageData | null {
  const normalizedSlug = normalizeDocRouteSlug(slug);
  const entry = getDocEntry(branchId, slugToKey(normalizedSlug));
  if (!entry) {
    return null;
  }

  const content = readStaticBranchFile(branchId, entry.repoPath);
  const contentWithoutTitle = stripLeadingTitle(content);
  const branch = getBranchSnapshot(branchId);

  return {
    branch,
    entry,
    title: extractDocTitle(content, entry.title),
    content: contentWithoutTitle,
    headings: extractHeadings(contentWithoutTitle),
    excerpt: extractExcerpt(contentWithoutTitle, 2),
  };
}

export function getDefaultDocPage(branchId: BranchId): DocPageData | null {
  return getDocPageData(branchId, DEFAULT_DOC_SLUG);
}

/** 当前快照是否存在可打开的文档首页（用于隐藏无内容时的「文档目录」等入口）。 */
export function branchHasDocIndex(branchId: BranchId): boolean {
  return getDefaultDocPage(branchId) !== null;
}

function splitPathHash(repoPath: string): { pathname: string; hash: string } {
  const hashIndex = repoPath.indexOf("#");
  if (hashIndex === -1) {
    return { pathname: repoPath, hash: "" };
  }

  return {
    pathname: repoPath.slice(0, hashIndex),
    hash: repoPath.slice(hashIndex),
  };
}

export function toBranchBlobUrl(branch: BranchSnapshot, repoPath: string): string {
  const { pathname, hash } = splitPathHash(repoPath);
  const normalizedPath = pathname.replace(/^\/+/, "");
  const looksLikeFile = Boolean(path.posix.extname(normalizedPath));
  const gitRef = resolveExecgoRef(branch.id);
  const knownFiles = gitRef ? listGitFiles(gitRef) : listBranchContentFiles(branch.id);
  const kind =
    knownFiles.includes(normalizedPath) || looksLikeFile
      ? "blob"
      : "tree";

  return `${GITHUB_REPO}/${kind}/${branch.branchName}/${normalizedPath}${hash}`;
}

function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function resolveMarkdownHref(
  branchId: BranchId,
  currentDocPath: string,
  href?: string,
): string | undefined {
  if (!href) {
    return href;
  }

  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("#")
  ) {
    return href;
  }

  const [targetPath, hash] = href.split("#");
  if (!targetPath) {
    return hash ? `#${hash}` : href;
  }

  const fileUrlTarget = targetPath.startsWith("file://");
  const rawTarget = fileUrlTarget ? targetPath.replace(/^file:\/\//, "") : targetPath;
  const normalizedTarget = safeDecodeURIComponent(rawTarget)
    .replace(/\\/g, "/")
    .replace(/^\/+/, "");
  const resolved = normalizedTarget.startsWith("docs/") || fileUrlTarget
    ? path.posix.normalize(normalizedTarget)
    : path.posix.normalize(
        path.posix.join(path.posix.dirname(currentDocPath), normalizedTarget),
      );

  if (resolved.endsWith(".md") && resolved.startsWith("docs/")) {
    const slug = docPathToSlug(resolved);
    const base = `/docs/execgo/${branchId}/${slug.join("/")}`;
    return hash ? `${base}#${hash}` : base;
  }

  return hash ? `${resolved}#${hash}` : resolved;
}
