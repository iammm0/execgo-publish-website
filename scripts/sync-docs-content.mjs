import { existsSync, promises as fs } from "node:fs";
import path from "node:path";

const docsRoot = path.resolve("content/docs");

const repos = {
  execgo: {
    root: path.resolve("..", "execgo"),
    github:
      "https://github.com/iammm0/execgo/blob/release/agent-adapter-runtime",
  },
  runtime: {
    root: path.resolve("..", "execgo-runtime"),
    github: "https://github.com/iammm0/execgo-runtime/blob/main",
  },
};

const copies = [
  {
    repo: "execgo",
    source: "README.zh-CN.md",
    target: "execgo/quickstart.mdx",
    title: "ExecGo 快速开始",
    description: "构建并运行 ExecGo 控制面，提交任务，并通过 execgocli 接入成熟 Agent。",
  },
  {
    repo: "execgo",
    source: "docs/zh/README.md",
    target: "execgo/documentation-map.mdx",
    title: "ExecGo 文档地图",
  },
  {
    repo: "execgo",
    source: "docs/zh/integration/agent-adapter.md",
    target: "execgo/integration/agent-adapter.mdx",
  },
  {
    repo: "execgo",
    source: "docs/zh/integration/mode-a-cli.md",
    target: "execgo/integration/mode-a-cli.mdx",
  },
  {
    repo: "execgo",
    source: "docs/zh/integration/mode-b-upgrade.md",
    target: "execgo/integration/mode-b-upgrade.mdx",
  },
  {
    repo: "execgo",
    source: "docs/zh/integration/client-go.md",
    target: "execgo/integration/client-go.mdx",
  },
  {
    repo: "execgo",
    source: "docs/zh/integration/client-java.md",
    target: "execgo/integration/client-java.mdx",
  },
  {
    repo: "execgo",
    source: "docs/zh/integration/client-python.md",
    target: "execgo/integration/client-python.mdx",
  },
  {
    repo: "execgo",
    source: "docs/zh/integration/client-nodejs-ts.md",
    target: "execgo/integration/client-nodejs-ts.mdx",
  },
  {
    repo: "execgo",
    source: "docs/zh/orchestrator/README.md",
    target: "execgo/orchestrator/index.mdx",
  },
  {
    repo: "execgo",
    source: "docs/zh/orchestrator/mapping-dag-to-taskgraph.md",
    target: "execgo/orchestrator/mapping-dag-to-taskgraph.mdx",
  },
  {
    repo: "execgo",
    source: "docs/zh/orchestrator/polling-and-idempotency.md",
    target: "execgo/orchestrator/polling-and-idempotency.mdx",
  },
  {
    repo: "execgo",
    source: "docs/zh/orchestrator/failure-semantics.md",
    target: "execgo/orchestrator/failure-semantics.mdx",
  },
  {
    repo: "execgo",
    source: "docs/zh/deploy/compose.md",
    target: "execgo/deploy/compose.mdx",
  },
  {
    repo: "execgo",
    source: "docs/zh/deploy/kubernetes.md",
    target: "execgo/deploy/kubernetes.mdx",
  },
  {
    repo: "execgo",
    source: "docs/zh/reference/execgo-cli-contract.md",
    target: "execgo/reference/execgo-cli-contract.mdx",
  },
  {
    repo: "execgo",
    source: "docs/zh/reference/promotion-security.md",
    target: "execgo/reference/promotion-security.mdx",
  },
  {
    repo: "execgo",
    source: "docs/zh/reference/api.md",
    target: "execgo/reference/api.mdx",
  },
  {
    repo: "execgo",
    source: "docs/zh/reference/task-dsl.md",
    target: "execgo/reference/task-dsl.mdx",
  },
  {
    repo: "execgo",
    source: "docs/zh/reference/executors.md",
    target: "execgo/reference/executors.mdx",
  },
  {
    repo: "execgo",
    source: "docs/zh/faqs.md",
    target: "execgo/faqs.mdx",
  },
  {
    repo: "execgo",
    source: "docs/examples/execgocli-agent-wrappers.md",
    target: "execgo/examples/execgocli-agent-wrappers.mdx",
  },
  {
    repo: "execgo",
    source: "docs/zh/overview/execgo-and-runtime.md",
    target: "ecosystem/execgo-and-runtime.mdx",
  },
  {
    repo: "runtime",
    source: "docs/README.md",
    target: "runtime/documentation-map.mdx",
  },
  {
    repo: "runtime",
    source: "docs/architecture.md",
    target: "runtime/architecture.mdx",
  },
  {
    repo: "runtime",
    source: "docs/api.md",
    target: "runtime/api.mdx",
  },
  {
    repo: "runtime",
    source: "docs/cli.md",
    target: "runtime/cli.mdx",
  },
  {
    repo: "runtime",
    source: "docs/deployment.md",
    target: "runtime/deployment.mdx",
  },
  {
    repo: "runtime",
    source: "docs/development.md",
    target: "runtime/development.mdx",
  },
];

const managedTargets = [
  "execgo/quickstart.mdx",
  "execgo/documentation-map.mdx",
  "execgo/task-dsl.mdx",
  "execgo/agent-adapter.mdx",
  "execgo/runtime-integration.mdx",
  "execgo/faqs.mdx",
  "execgo/integration",
  "execgo/orchestrator",
  "execgo/deploy",
  "execgo/reference",
  "execgo/examples",
  "runtime/documentation-map.mdx",
  "runtime/architecture.mdx",
  "runtime/api.mdx",
  "runtime/cli.mdx",
  "runtime/deployment.mdx",
  "runtime/development.mdx",
  "runtime/operations.mdx",
  "ecosystem/execgo-and-runtime.mdx",
];

const metaFiles = {
  "meta.json": {
    title: "ExecGo 文档",
    pages: ["index", "execgo", "runtime", "agent", "ecosystem"],
  },
  "execgo/meta.json": {
    title: "控制面 execgo",
    pages: [
      "index",
      "quickstart",
      "documentation-map",
      "integration",
      "orchestrator",
      "deploy",
      "reference",
      "examples",
      "faqs",
    ],
  },
  "execgo/integration/meta.json": {
    title: "接入",
    pages: [
      "agent-adapter",
      "mode-a-cli",
      "mode-b-upgrade",
      "client-go",
      "client-java",
      "client-python",
      "client-nodejs-ts",
    ],
  },
  "execgo/orchestrator/meta.json": {
    title: "编排",
    pages: [
      "index",
      "mapping-dag-to-taskgraph",
      "polling-and-idempotency",
      "failure-semantics",
    ],
  },
  "execgo/deploy/meta.json": {
    title: "部署",
    pages: ["compose", "kubernetes"],
  },
  "execgo/reference/meta.json": {
    title: "参考",
    pages: [
      "execgo-cli-contract",
      "promotion-security",
      "api",
      "task-dsl",
      "executors",
    ],
  },
  "execgo/examples/meta.json": {
    title: "示例",
    pages: ["execgocli-agent-wrappers"],
  },
  "runtime/meta.json": {
    title: "数据面 execgo-runtime",
    pages: [
      "index",
      "quickstart",
      "documentation-map",
      "architecture",
      "api",
      "cli",
      "deployment",
      "development",
    ],
  },
  "agent/meta.json": {
    title: "通用 Agent 结合",
    pages: ["index"],
  },
  "ecosystem/meta.json": {
    title: "execgo 生态",
    pages: ["index", "execgo-and-runtime", "versioning"],
  },
};

const sourceToUrl = new Map();

for (const copy of copies) {
  const sourcePath = path.resolve(repos[copy.repo].root, copy.source);
  sourceToUrl.set(pathKey(sourcePath), targetToUrl(copy.target));
}

await ensureRepoRoots();
await removeManagedTargets();
await writeSyncedPages();
await writeMetaFiles();

console.log(`Synced ${copies.length} documentation pages into content/docs.`);

async function ensureRepoRoots() {
  for (const [name, repo] of Object.entries(repos)) {
    const stat = await fs.stat(repo.root).catch(() => null);

    if (!stat?.isDirectory()) {
      throw new Error(`Missing ${name} repository at ${repo.root}`);
    }
  }
}

async function removeManagedTargets() {
  for (const rel of managedTargets) {
    const target = resolveDocsPath(rel);
    await fs.rm(target, { recursive: true, force: true });
  }
}

async function writeSyncedPages() {
  for (const copy of copies) {
    const repo = repos[copy.repo];
    const sourcePath = path.resolve(repo.root, copy.source);
    const targetPath = resolveDocsPath(copy.target);
    const source = await fs.readFile(sourcePath, "utf8");
    const mdx = toMdx(source, copy, sourcePath);

    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, mdx, "utf8");
  }
}

async function writeMetaFiles() {
  for (const [rel, data] of Object.entries(metaFiles)) {
    const targetPath = resolveDocsPath(rel);
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(
      targetPath,
      `${JSON.stringify(data, null, 2)}\n`,
      "utf8",
    );
  }
}

function toMdx(source, copy, sourcePath) {
  const withoutFrontmatter = stripFrontmatter(source).trim();
  const { title, body } = extractTitle(withoutFrontmatter, copy.title);
  const description = copy.description ?? inferDescription(body);
  const rewritten = rewriteMarkdownLinks(
    normalizeAutolinks(escapeMdxExpressions(escapeTextPlaceholders(body))),
    copy.repo,
    sourcePath,
  ).trim();

  return [
    "---",
    `title: ${JSON.stringify(copy.title ?? title)}`,
    `description: ${JSON.stringify(description)}`,
    "---",
    "",
    rewritten,
    "",
  ].join("\n");
}

function stripFrontmatter(source) {
  return source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
}

function extractTitle(source, fallback) {
  const lines = source.split(/\r?\n/);
  const titleLine = lines.findIndex((line) => /^#\s+/.test(line));

  if (titleLine === -1) {
    return {
      title: fallback ?? "Documentation",
      body: source,
    };
  }

  const title = lines[titleLine].replace(/^#\s+/, "").trim();
  lines.splice(titleLine, 1);

  while (lines[0]?.trim() === "") {
    lines.shift();
  }

  return {
    title: fallback ?? title,
    body: lines.join("\n"),
  };
}

function inferDescription(body) {
  const lines = body.split(/\r?\n/);
  let inFence = false;

  for (const line of lines) {
    if (/^```/.test(line.trim())) {
      inFence = !inFence;
      continue;
    }

    const trimmed = line.trim();

    if (
      inFence ||
      trimmed === "" ||
      trimmed === "---" ||
      trimmed.startsWith("#") ||
      trimmed.startsWith("|") ||
      trimmed.startsWith("- ") ||
      trimmed.startsWith(">") ||
      trimmed.startsWith("[![") ||
      /^\d+\.\s/.test(trimmed)
    ) {
      continue;
    }

    const description = stripMarkdown(trimmed);

    if (!description) {
      continue;
    }

    return description.slice(0, 160);
  }

  return "从源仓库同步的文档。";
}

function stripMarkdown(value) {
  return value
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeTextPlaceholders(source) {
  const lines = source.split(/\r?\n/);
  let inFence = false;

  return lines
    .map((line) => {
      if (/^```/.test(line.trim())) {
        inFence = !inFence;
        return line;
      }

      if (inFence) {
        return line;
      }

      return line.replace(/<([A-Za-z][A-Za-z0-9_-]*)>/g, "&lt;$1&gt;");
    })
    .join("\n");
}

function normalizeAutolinks(source) {
  const lines = source.split(/\r?\n/);
  let inFence = false;

  return lines
    .map((line) => {
      if (/^```/.test(line.trim())) {
        inFence = !inFence;
        return line;
      }

      if (inFence) {
        return line;
      }

      return line.replace(
        /<((?:https?:\/\/|mailto:)[^>\s]+)>/g,
        (_, url) => `[${url}](${url})`,
      );
    })
    .join("\n");
}

function escapeMdxExpressions(source) {
  const lines = source.split(/\r?\n/);
  let inFence = false;

  return lines
    .map((line) => {
      if (/^```/.test(line.trim())) {
        inFence = !inFence;
        return line;
      }

      if (inFence || /<Docs[A-Za-z]/.test(line)) {
        return line;
      }

      return line.replace(/\{([A-Za-z_][A-Za-z0-9_]*)\}/g, "\\{$1\\}");
    })
    .join("\n");
}

function rewriteMarkdownLinks(source, repoName, sourcePath) {
  return source.replace(
    /(!?)\[([^\]]+)]\(([^)\s]+(?:\s+"[^"]*")?)\)/g,
    (match, bang, label, rawHref) => {
      if (bang) {
        return match;
      }

      const href = rawHref.replace(/\s+"[^"]*"$/, "");
      const title = rawHref.slice(href.length);
      const rewritten = rewriteHref(href, repoName, sourcePath);

      return `[${label}](${rewritten}${title})`;
    },
  );
}

function rewriteHref(href, repoName, sourcePath) {
  if (
    href.startsWith("#") ||
    href.startsWith("/") ||
    /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(href)
  ) {
    return href;
  }

  const { pathname, suffix } = splitHref(href);

  if (!pathname.toLowerCase().endsWith(".md")) {
    return href;
  }

  let decodedPath = pathname;

  try {
    decodedPath = decodeURI(pathname);
  } catch {
    // Leave malformed URI escapes as-is and let path resolution handle them.
  }

  const sourceTarget = path.resolve(path.dirname(sourcePath), decodedPath);
  const mappedUrl = sourceToUrl.get(pathKey(sourceTarget));

  if (mappedUrl) {
    return `${mappedUrl}${suffix}`;
  }

  const repo = repos[repoName];
  const externalTarget = resolveExternalTarget(repoName, sourceTarget);
  const relative = slash(path.relative(repo.root, externalTarget));

  if (relative.startsWith("../")) {
    return href;
  }

  return `${repo.github}/${encodePath(relative)}${suffix}`;
}

function resolveExternalTarget(repoName, sourceTarget) {
  if (existsSync(sourceTarget) || repoName !== "execgo") {
    return sourceTarget;
  }

  const repo = repos[repoName];
  const relative = slash(path.relative(repo.root, sourceTarget));

  const fallbackTarget = relative.startsWith("docs/zh/")
    ? path.resolve(repo.root, relative.replace(/^docs\/zh\//, "docs/en/"))
    : relative.startsWith("docs/en/")
      ? path.resolve(repo.root, relative.replace(/^docs\/en\//, "docs/zh/"))
      : null;

  if (fallbackTarget && existsSync(fallbackTarget)) {
    return fallbackTarget;
  }

  return sourceTarget;
}

function splitHref(href) {
  const match = href.match(/^([^?#]*)([?#].*)?$/);

  return {
    pathname: match?.[1] ?? href,
    suffix: match?.[2] ?? "",
  };
}

function targetToUrl(target) {
  let route = slash(target).replace(/\.mdx$/, "");

  if (route.endsWith("/index")) {
    route = route.slice(0, -"/index".length);
  }

  return `/docs/${route}`;
}

function resolveDocsPath(rel) {
  const resolved = path.resolve(docsRoot, rel);
  const relative = path.relative(docsRoot, resolved);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing to write outside content/docs: ${rel}`);
  }

  return resolved;
}

function pathKey(value) {
  return path.normalize(value).toLowerCase();
}

function slash(value) {
  return value.split(path.sep).join("/");
}

function encodePath(value) {
  return slash(value)
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}
