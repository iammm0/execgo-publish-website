import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

const EXECGO_ROOT = path.join(process.cwd(), "execgo");
const CONTENT_ROOT = path.join(process.cwd(), "content", "execgo-branches");
const GITHUB_REPO = "https://github.com/iammm0/execgo";
const DEFAULT_DOC_SLUG = ["en"];
const DEFAULT_DOC_LOCALE = "en";

export type BranchId = "release-agent-adapter-runtime" | "preview-distributed-runtime";

const DEFAULT_BRANCH_ID: BranchId = "release-agent-adapter-runtime";
const LEGACY_BRANCH_ALIASES: Record<string, BranchId> = {
  main: "release-agent-adapter-runtime",
  "feat-add-cluster": "preview-distributed-runtime",
  "feat-add-adapter": "release-agent-adapter-runtime",
};

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
    release: string;
    preview: string;
  }>;
  branches: BranchSnapshot[];
  timeline: SiteTimelineItem[];
};

const BRANCHES: Record<BranchId, BranchCopy> = {
  "release-agent-adapter-runtime": {
    id: "release-agent-adapter-runtime",
    branchName: "release/agent-adapter-runtime",
    label: "适配器与 Runtime 发布线",
    badge: "Release",
    channel: "release",
    summary:
      "release/agent-adapter-runtime 已集成成熟 Agent 适配器、execgo-runtime 执行器、execgocli 标准壳与 MCP HTTP 路由，是当前稳定接入线。",
    description:
      "适合需要结构化动作翻译、外部 runtime 执行平面，以及 Codex / Claude Code / Hermes Agent / OpenClaw 共用接入路径的团队。",
    audience:
      "Agent 工具链工程师、需要把 ExecGo 接到 execgo-runtime 或自研 Runtime 的平台团队。",
    rollout: "release/agent-adapter-runtime 可用",
    narrative: [
      "从 pkg/httpserver/engine.go 可见 /adapters/* 与 /mcp/* 与任务 API 并存，控制面可在同一端口服务编排器与工具发现。",
      "从 pkg/executor/runtime.go 与 EXECGO_RUNTIME_URL 可把异步任务交给符合 execgo-runtime HTTP 契约的执行平面，并支持 control_context 与取消链路。",
      "从 cmd/execgocli 与 internal/execgocli 可将适配器与任务轮询固化为单二进制工作流，降低各 IDE 插件重复实现成本。",
    ],
    focusAreas: [
      "成熟 Agent 适配器",
      "runtime 类型任务与外部 Runtime",
      "execgocli HTTP 壳",
      "MCP 工具 HTTP",
      "execgo-skills 接入",
    ],
    refCandidates: [
      "origin/release/agent-adapter-runtime",
      "release/agent-adapter-runtime",
    ],
  },
  "preview-distributed-runtime": {
    id: "preview-distributed-runtime",
    branchName: "preview/distributed-runtime",
    label: "分布式运行时预览线",
    badge: "Preview",
    channel: "preview",
    summary:
      "在事件溯源、队列、Worker 和租约恢复之上，继续完善 cancel、dead-letter ops 与 capability-aware dispatch 的分布式运行时预览线。",
    description:
      "适合需要跨节点执行、事件回放、幂等提交、Redis 队列或 Postgres/SQLite 事件存储的场景。",
    audience:
      "正在建设 Agent Runtime、分布式任务平台，或者希望把 ExecGo 扩展为控制平面的团队。",
    rollout: "预览功能线",
    narrative: [
      "从 cmd/execgo/main.go 的初始化顺序可以直接看到，运行时已经扩展为事件存储、队列、Worker、沙箱和观测运行时的组合，而不再只是本地调度器加文件存储。",
      "从 pkg/scheduler/scheduler.go、pkg/taskqueue 与 pkg/worker 可以确认，任务租约回收、取消和 capability-aware dispatch 已经形成一条分布式控制路径。",
      "从 contrib/grpcapi/proto/execgo/v1/execgo.proto 的 WorkerControl 服务和端到端测试可以看出，控制面与执行面的拆分方向已经非常明确。",
    ],
    focusAreas: [
      "事件溯源状态管理",
      "Redis / Memory 队列",
      "本地与远程 Worker",
      "任务取消与 lease recovery",
      "WorkerControl 与 capability-aware dispatch",
    ],
    refCandidates: [
      "origin/preview/distributed-runtime",
      "preview/distributed-runtime",
    ],
  },
};

const CAPABILITIES: Record<BranchId, Capability[]> = {
  "release-agent-adapter-runtime": [
    {
      title: "成熟 Agent 适配器 HTTP",
      description:
        "提供 /adapters/capabilities、/adapters/tools、/adapters/translate 与 /adapters/actions，统一结构化动作的翻译与提交。",
      evidence: [
        "pkg/httpserver/engine.go",
        "pkg/adapter/adapter.go",
        "docs/en/integration/agent-adapter.md",
      ],
      tags: ["REST", "Adapter", "Agents"],
    },
    {
      title: "execgo-runtime 执行器",
      description:
        "内置 runtime 任务类型，通过 EXECGO_RUNTIME_URL 调用外部 runtime HTTP API，支持 tenant/owner 注入与 Kill 请求头。",
      evidence: [
        "pkg/executor/runtime.go",
        "docs/en/overview/execgo-and-runtime.md",
      ],
      tags: ["Runtime", "HTTP", "Cancel"],
    },
    {
      title: "execgocli 标准壳",
      description:
        "cmd/execgocli 暴露 capabilities、tools、act、translate、wait、submit、ensure-running 等子命令，面向 Codex / Claude Code 共用路径。",
      evidence: [
        "cmd/execgocli/main.go",
        "internal/execgocli",
        "docs/en/reference/execgo-cli-contract.md",
      ],
      tags: ["CLI", "Stdlib"],
    },
    {
      title: "MCP 工具 HTTP 面",
      description:
        "提供 GET /mcp/tools、POST /mcp/call、GET /mcp/tasks/{id}，与任务 API 并列，便于工具发现与调试。",
      evidence: ["pkg/httpserver/engine.go", "pkg/executor/mcp.go"],
      tags: ["MCP", "Tools"],
    },
  ],
  "preview-distributed-runtime": [
    {
      title: "事件驱动状态与恢复",
      description:
        "运行时状态由事件日志回放构建，Scheduler 可回收过期 lease，并标记失联 worker 为 stale。",
      evidence: [
        "pkg/store/eventsourced/manager.go",
        "pkg/events/store.go",
        "pkg/scheduler/scheduler.go",
      ],
      tags: ["Event Sourcing", "Recovery", "Worker"],
    },
    {
      title: "队列恢复与死信运维",
      description:
        "Memory / Redis 队列支持 dead-letter 列表与 requeue，Redis Streams 可以 reclaim pending message。",
      evidence: [
        "pkg/taskqueue/queue.go",
        "pkg/taskqueue/memory.go",
        "pkg/taskqueue/redis.go",
      ],
      tags: ["Queue", "Dead Letter", "Redis"],
    },
    {
      title: "协作式取消",
      description:
        "PUT /tasks/{id}/cancel 可取消 ready/running/retrying 任务，运行中 worker 通过 context 尽快停止，并跳过未终态下游。",
      evidence: [
        "pkg/scheduler/scheduler.go",
        "pkg/worker/worker.go",
        "pkg/fsm/fsm.go",
      ],
      tags: ["Cancel", "FSM", "Cooperative"],
    },
    {
      title: "能力感知分派",
      description:
        "任务可声明 required_capabilities，WorkerControl 和本地 Worker 只 lease 匹配 executor / sandbox 的任务。",
      evidence: [
        "contrib/grpcapi/proto/execgo/v1/execgo.proto",
        "pkg/worker/remote_grpc_worker.go",
        "pkg/worker/worker.go",
      ],
      tags: ["Dispatch", "gRPC", "Capabilities"],
    },
  ],
};

const MODULE_CARDS: Record<BranchId, ModuleCard[]> = {
  "release-agent-adapter-runtime": [
    {
      title: "适配器核心",
      path: "pkg/adapter/adapter.go",
      description: "成熟 Agent 动作契约、工具清单与 translate/actions 管线。",
    },
    {
      title: "HTTP API",
      path: "pkg/httpserver/engine.go",
      description: "任务、适配器与 MCP 路由共存，适合作为 agent 的统一动作入口。",
    },
    {
      title: "RuntimeExecutor",
      path: "pkg/executor/runtime.go",
      description: "向 execgo-runtime 提交与轮询异步执行句柄。",
    },
    {
      title: "execgocli",
      path: "cmd/execgocli/main.go",
      description: "标准库 HTTP 客户端封装适配器子命令与任务轮询。",
    },
    {
      title: "CLI 内部库",
      path: "internal/execgocli",
      description: "ensure-running、compose 提示与 JSON 输出。",
    },
    {
      title: "适配器文档",
      path: "docs/en/integration/agent-adapter.md",
      description: "适配器集成与模式说明入口。",
    },
  ],
  "preview-distributed-runtime": [
    {
      title: "事件溯源 Store",
      path: "pkg/store/eventsourced/manager.go",
      description: "以事件日志驱动任务、工作流和 Worker 的读模型，并支持回放恢复。",
    },
    {
      title: "Scheduler Recovery",
      path: "pkg/scheduler/scheduler.go",
      description: "处理 lease 过期、worker stale、取消和 capability-aware dispatch。",
    },
    {
      title: "队列平面",
      path: "pkg/taskqueue",
      description: "抽象 Memory 与 Redis 队列，支持 pending reclaim 与 dead-letter requeue。",
    },
    {
      title: "Worker Runtime",
      path: "pkg/worker",
      description: "本地 Worker 和远程 gRPC Worker 都从这里注册能力、执行任务和上报状态。",
    },
    {
      title: "控制面协议",
      path: "contrib/grpcapi/proto/execgo/v1/execgo.proto",
      description: "ExecGo 与 WorkerControl gRPC 协议承载远程 worker、取消和能力上报。",
    },
    {
      title: "观测与运维",
      path: "pkg/observability/observability.go",
      description: "HTTP 指标、Prometheus 与运行时队列/取消/分派观测入口。",
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
    title: "适配器与 CLI 壳层",
    matches: ["pkg/adapter", "internal/execgocli", "cmd/execgocli"],
  },
  {
    title: "测试回归",
    matches: ["tests/"],
  },
] as const;

const PREFERRED_DOCS: Record<BranchId, string[]> = {
  "release-agent-adapter-runtime": [
    "docs/en/README.md",
    "docs/en/overview/execgo-and-runtime.md",
    "docs/en/integration/agent-adapter.md",
    "docs/en/reference/execgo-cli-contract.md",
    "docs/en/reference/task-dsl.md",
    "docs/en/reference/api.md",
    "docs/en/deploy/kubernetes.md",
  ],
  "preview-distributed-runtime": [
    "docs/en/README.md",
    "docs/en/orchestrator/polling-and-idempotency.md",
    "docs/en/reference/executors.md",
  ],
};

const CURATED_EN_DOCS: Record<BranchId, string[]> = {
  "release-agent-adapter-runtime": [
    "docs/en/README.md",
    "docs/en/overview/execgo-and-runtime.md",
    "docs/en/orchestrator/README.md",
    "docs/en/orchestrator/mapping-dag-to-taskgraph.md",
    "docs/en/orchestrator/failure-semantics.md",
    "docs/en/orchestrator/polling-and-idempotency.md",
    "docs/en/integration/agent-adapter.md",
    "docs/en/integration/mode-a-cli.md",
    "docs/en/integration/mode-b-upgrade.md",
    "docs/en/integration/client-go.md",
    "docs/en/integration/client-java.md",
    "docs/en/integration/client-python.md",
    "docs/en/integration/client-nodejs-ts.md",
    "docs/en/reference/execgo-cli-contract.md",
    "docs/en/reference/task-dsl.md",
    "docs/en/reference/api.md",
    "docs/en/reference/executors.md",
    "docs/en/deploy/compose.md",
    "docs/en/deploy/kubernetes.md",
    "docs/en/faqs.md",
  ],
  "preview-distributed-runtime": [
    "docs/en/README.md",
    "docs/en/orchestrator/README.md",
    "docs/en/orchestrator/mapping-dag-to-taskgraph.md",
    "docs/en/orchestrator/failure-semantics.md",
    "docs/en/orchestrator/polling-and-idempotency.md",
    "docs/en/integration/client-go.md",
    "docs/en/integration/client-java.md",
    "docs/en/integration/client-python.md",
    "docs/en/integration/client-nodejs-ts.md",
    "docs/en/reference/task-dsl.md",
    "docs/en/reference/api.md",
    "docs/en/reference/executors.md",
    "docs/en/deploy/compose.md",
    "docs/en/deploy/kubernetes.md",
    "docs/en/faqs.md",
  ],
};

const COMPARISON_ROWS = [
  {
    aspect: "运行时形态",
    release: "单节点控制面 + 外部 execgo-runtime HTTP 执行平面",
    preview: "控制面 + 队列 + Worker 的分布式预览架构",
  },
  {
    aspect: "状态管理",
    release: "控制面状态在 ExecGo，长生命周期任务态在外部 Runtime 侧维护",
    preview: "事件溯源 Store，支持事件回放、lease recovery 和幂等命中",
  },
  {
    aspect: "执行拓扑",
    release: "调度仍在 ExecGo；重任务经 runtime 类型委派给外部进程",
    preview: "队列化调度，支持本地和远程 Worker",
  },
  {
    aspect: "协议面",
    release: "HTTP 任务 / 适配器 / MCP；Runtime 侧走 execgo-runtime HTTP API",
    preview: "HTTP + ExecGo gRPC + WorkerControl gRPC",
  },
  {
    aspect: "扩展能力",
    release: "适配器契约、execgocli、runtime 集成与租户/所有者上下文字段",
    preview: "沙箱运行器、任务取消、死信运维和 capability-aware dispatch",
  },
  {
    aspect: "适用阶段",
    release: "推荐接入线，面向 Codex / Claude Code / Hermes Agent / OpenClaw",
    preview: "预研、灰度验证、分布式运行时演进路线展示",
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
    .sort((left, right) => left.localeCompare(right, "en"));
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
    return "Overview";
  }

  if (segment === "en") {
    return "English";
  }

  if (segment === "zh") {
    return "Chinese";
  }

  return segment.replace(/[-_]/g, " ");
}

function localeLabel(locale: string): string {
  if (locale === "en") {
    return "English";
  }

  if (locale === "zh") {
    return "Chinese";
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
  if (locale === "en") {
    if (repoPath === "docs/en/README.md") {
      return { section: "overview", sectionLabel: "Start here" };
    }
    if (repoPath.startsWith("docs/en/overview/")) {
      return { section: "overview", sectionLabel: "Overview" };
    }
    if (repoPath === "docs/en/agent-kernel-roadmap.md") {
      return { section: "roadmap", sectionLabel: "Roadmap" };
    }
    if (repoPath.startsWith("docs/en/orchestrator/")) {
      return { section: "orchestrator", sectionLabel: "Orchestration" };
    }
    if (repoPath.startsWith("docs/en/integration/")) {
      return { section: "integration", sectionLabel: "Integration" };
    }
    if (repoPath === "docs/en/reference/runtime-semantics.md") {
      return { section: "runtime", sectionLabel: "Runtime semantics" };
    }
    if (repoPath.startsWith("docs/en/reference/")) {
      return { section: "reference", sectionLabel: "Reference" };
    }
    if (repoPath.startsWith("docs/en/deploy/")) {
      return { section: "deploy", sectionLabel: "Deployment" };
    }
    if (repoPath === "docs/en/faqs.md") {
      return { section: "faq", sectionLabel: "FAQ" };
    }
    if (repoPath.startsWith("docs/en/releases/")) {
      return { section: "releases", sectionLabel: "Release notes" };
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
    sectionLabel: slug.length <= 1 ? "Overview" : humanizeSegment(section),
  };
}

function docOrderIndex(branchId: BranchId, entry: DocEntry): number {
  if (entry.locale === DEFAULT_DOC_LOCALE) {
    const index = CURATED_EN_DOCS[branchId].indexOf(entry.repoPath);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  }

  return Number.MAX_SAFE_INTEGER;
}

function buildDocEntries(branchId: BranchId): DocEntry[] {
  return listBranchContentFiles(branchId)
    .filter((file) => file.startsWith("docs/") && file.endsWith(".md"))
    .filter((file) => file.startsWith("docs/en/"))
    .map((repoPath) => {
      const slug = docPathToSlug(repoPath);
      const locale = slug[0] ?? DEFAULT_DOC_LOCALE;
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
    .sort((left, right) => left.repoPath.localeCompare(right.repoPath, "en"));
}

function buildDocGroups(branchId: BranchId, entries: DocEntry[]): DocNavGroup[] {
  const locales = new Map<string, Map<string, DocEntry[]>>();

  const visibleEntries = entries.filter((entry) => {
    return entry.locale === DEFAULT_DOC_LOCALE && CURATED_EN_DOCS[branchId].includes(entry.repoPath);
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
      const order = (value: string) => (value === DEFAULT_DOC_LOCALE ? 0 : 1);
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
              left.repoPath.localeCompare(right.repoPath, "en")
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
  const builtinRegistry = readGitFile(ref, "pkg/executor/core.go");

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
  if (
    value === "release-agent-adapter-runtime" ||
    value === "preview-distributed-runtime"
  ) {
    return value;
  }

  return LEGACY_BRANCH_ALIASES[value] ?? null;
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
  const releaseRef = resolveExecgoRef(DEFAULT_BRANCH_ID);
  const diff =
    branchId === DEFAULT_BRANCH_ID
      ? undefined
      : useGit && releaseRef
        ? parseDiffSummary(releaseRef, gitRef!)
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
  const releaseBranch = getBranchSnapshot(DEFAULT_BRANCH_ID);
  const previewBranch = getBranchSnapshot("preview-distributed-runtime");

  const canQueryExecgoGit =
    resolveExecgoRef(DEFAULT_BRANCH_ID) !== null ||
    resolveExecgoRef("preview-distributed-runtime") !== null;

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
    releaseVersion: releaseBranch.releaseVersion,
    releaseDate: releaseBranch.releaseDate,
    comparisonRows: COMPARISON_ROWS,
    branches: [releaseBranch, previewBranch],
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
