import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

import type { DocEntry, DocNavGroup, DocNavSection, MarkdownHeading } from "./execgo-data";
import { normalizeDocRouteSlug, slugifyHeading } from "./execgo-data";

const RUNTIME_CONTENT_ROOT = path.join(process.cwd(), "content", "execgo-runtime", "docs");
const RUNTIME_GITHUB_REPO = "https://github.com/iammm0/execgo-runtime";

export type RuntimeDocPageData = {
  entry: DocEntry;
  title: string;
  content: string;
  headings: MarkdownHeading[];
  excerpt: string[];
};

function humanizeFilename(filename: string): string {
  return filename
    .replace(/\.md$/i, "")
    .replace(/[-_]/g, " ")
    .replace(/^readme$/i, "概览")
    .replace(/^api$/i, "HTTP API")
    .replace(/^cli$/i, "CLI 命令行")
    .replace(/^architecture$/i, "架构说明")
    .replace(/^deployment$/i, "部署指南")
    .replace(/^development$/i, "本地开发");
}

function extractHeadings(markdown: string): MarkdownHeading[] {
  return markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .flatMap((line) => {
      const match = /^(##|###)\s+(.*)$/.exec(line);
      if (!match) return [];
      const depth = match[1].length;
      const title = match[2].replace(/\s+#*$/, "").trim();
      return [{ id: slugifyHeading(title), title, depth }];
    });
}

function extractTitle(content: string, fallback: string): string {
  const match = /^#\s+(.+)$/m.exec(content);
  return match ? match[1].trim() : fallback;
}

function extractExcerpt(content: string, maxParagraphs: number): string[] {
  const lines = content.split(/\r?\n/);
  const paragraphs: string[] = [];
  let current = "";

  for (const line of lines) {
    if (line.startsWith("#")) continue;
    if (line.trim() === "") {
      if (current) {
        paragraphs.push(current.trim());
        current = "";
        if (paragraphs.length >= maxParagraphs) break;
      }
      continue;
    }
    current += (current ? " " : "") + line.trim();
  }

  if (current && paragraphs.length < maxParagraphs) {
    paragraphs.push(current.trim());
  }

  return paragraphs;
}

export const getRuntimeDocEntries = cache((): DocEntry[] => {
  const zhDir = path.join(RUNTIME_CONTENT_ROOT, "zh");
  if (!fs.existsSync(zhDir)) return [];

  const files = fs.readdirSync(zhDir).filter((f) => f.endsWith(".md")).sort();

  return files.map((filename) => {
    const slug = filename.toLowerCase() === "readme.md"
      ? ["zh"]
      : ["zh", filename.replace(/\.md$/i, "").toLowerCase()];
    const title = humanizeFilename(filename);

    return {
      title,
      slug,
      slugKey: slug.join("/"),
      repoPath: `docs/${filename}`,
      locale: "zh",
      localeLabel: "中文",
      section: "runtime",
      sectionLabel: "Runtime",
      href: `/docs/runtime/${slug.join("/")}`,
    };
  });
});

export const getRuntimeDocGroups = cache((): DocNavGroup[] => {
  const entries = getRuntimeDocEntries();
  if (entries.length === 0) return [];

  const zhSection: DocNavSection = {
    title: "Runtime 文档",
    items: entries,
  };

  return [
    {
      locale: "zh",
      title: "中文",
      sections: [zhSection],
    },
  ];
});

export function getRuntimeDocPageData(slug: string[]): RuntimeDocPageData | null {
  const entries = getRuntimeDocEntries();
  const key = normalizeDocRouteSlug(slug).join("/");
  const entry = entries.find((e) => e.slugKey === key);

  if (!entry) return null;

  const filePath = path.join(RUNTIME_CONTENT_ROOT, "zh", path.basename(entry.repoPath));
  if (!fs.existsSync(filePath)) return null;

  const content = fs.readFileSync(filePath, "utf8");

  return {
    entry,
    title: extractTitle(content, entry.title),
    content,
    headings: extractHeadings(content),
    excerpt: extractExcerpt(content, 2),
  };
}

export function getRuntimeDefaultDoc(): RuntimeDocPageData | null {
  return getRuntimeDocPageData(["zh"]);
}

function safeDecodeRuntimeHref(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function runtimeRouteForSourceDoc(sourcePath: string): string | null {
  if (sourcePath === "docs/README.md") {
    return "/docs/runtime/zh";
  }

  if (!sourcePath.startsWith("docs/") || !sourcePath.endsWith(".md")) {
    return null;
  }

  const filename = path.posix.basename(sourcePath);
  const contentPath = path.join(RUNTIME_CONTENT_ROOT, "zh", filename);
  if (!fs.existsSync(contentPath)) {
    return null;
  }

  const slug = filename.toLowerCase() === "readme.md"
    ? "zh"
    : `zh/${filename.replace(/\.md$/i, "").toLowerCase()}`;
  return `/docs/runtime/${slug}`;
}

export function resolveRuntimeMarkdownHref(
  currentDocPath: string,
  href?: string,
): string | null {
  if (!href) {
    return null;
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
  const normalizedTarget = safeDecodeRuntimeHref(rawTarget)
    .replace(/\\/g, "/")
    .replace(/^\/+/, "");
  const resolved = normalizedTarget.startsWith("docs/") || fileUrlTarget
    ? path.posix.normalize(normalizedTarget)
    : path.posix.normalize(
        path.posix.join(path.posix.dirname(currentDocPath), normalizedTarget),
      );

  const runtimeRoute = runtimeRouteForSourceDoc(resolved);
  if (runtimeRoute) {
    return hash ? `${runtimeRoute}#${hash}` : runtimeRoute;
  }

  if (resolved === "README.md") {
    const githubHref = `${RUNTIME_GITHUB_REPO}/blob/main/README.md`;
    return hash ? `${githubHref}#${hash}` : githubHref;
  }

  if (resolved.endsWith(".md")) {
    const githubHref = `${RUNTIME_GITHUB_REPO}/blob/main/${resolved}`;
    return hash ? `${githubHref}#${hash}` : githubHref;
  }

  return hash ? `${resolved}#${hash}` : resolved;
}

/** 是否存在可打开的 runtime 文档首页（用于隐藏无内容时的文档入口）。 */
export function hasRuntimeDocIndex(): boolean {
  return getRuntimeDefaultDoc() !== null;
}
