import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

import type { DocEntry, DocNavGroup, DocNavSection, MarkdownHeading } from "./execgo-data";
import { normalizeDocRouteSlug, slugifyHeading } from "./execgo-data";

const PLAYGROUND_CONTENT_ROOT = path.join(process.cwd(), "content", "execgo-playground", "docs", "zh");

type PlaygroundDocConfig = {
  filename: string;
  title: string;
  slug: string[];
  repoPath: string;
};

const PLAYGROUND_DOCS: PlaygroundDocConfig[] = [
  {
    filename: "README.md",
    title: "训练场概览",
    slug: ["zh"],
    repoPath: "README.md",
  },
  {
    filename: "getting-started.md",
    title: "上手指南",
    slug: ["zh", "getting-started"],
    repoPath: "docs/getting-started.md",
  },
  {
    filename: "architecture.md",
    title: "架构说明",
    slug: ["zh", "architecture"],
    repoPath: "docs/architecture.md",
  },
  {
    filename: "scenarios.md",
    title: "场景规范",
    slug: ["zh", "scenarios"],
    repoPath: "docs/scenarios.md",
  },
  {
    filename: "benchmarks.md",
    title: "测评指南",
    slug: ["zh", "benchmarks"],
    repoPath: "docs/benchmarks.md",
  },
  {
    filename: "chaos.md",
    title: "故障注入",
    slug: ["zh", "chaos"],
    repoPath: "docs/chaos.md",
  },
  {
    filename: "observability.md",
    title: "可观测性",
    slug: ["zh", "observability"],
    repoPath: "docs/observability.md",
  },
  {
    filename: "desktop-client.md",
    title: "桌面客户端",
    slug: ["zh", "desktop-client"],
    repoPath: "desktop-client/README.md",
  },
];

export type PlaygroundDocPageData = {
  entry: DocEntry;
  title: string;
  content: string;
  headings: MarkdownHeading[];
  excerpt: string[];
};

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

export const getPlaygroundDocEntries = cache((): DocEntry[] => {
  if (!fs.existsSync(PLAYGROUND_CONTENT_ROOT)) return [];

  return PLAYGROUND_DOCS.filter((doc) =>
    fs.existsSync(path.join(PLAYGROUND_CONTENT_ROOT, doc.filename)),
  ).map((doc) => ({
    title: doc.title,
    slug: doc.slug,
    slugKey: doc.slug.join("/"),
    repoPath: doc.repoPath,
    locale: "zh",
    localeLabel: "中文",
    section: "playground",
    sectionLabel: "训练场",
    href: `/docs/playground/${doc.slug.join("/")}`,
  }));
});

export const getPlaygroundDocGroups = cache((): DocNavGroup[] => {
  const entries = getPlaygroundDocEntries();
  if (entries.length === 0) return [];

  const zhSection: DocNavSection = {
    title: "训练场文档",
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

export function getPlaygroundDocPageData(slug: string[]): PlaygroundDocPageData | null {
  const entries = getPlaygroundDocEntries();
  const key = normalizeDocRouteSlug(slug).join("/");
  const entry = entries.find((item) => item.slugKey === key);

  if (!entry) return null;

  const config = PLAYGROUND_DOCS.find((doc) => doc.repoPath === entry.repoPath);
  if (!config) return null;

  const filePath = path.join(PLAYGROUND_CONTENT_ROOT, config.filename);
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

export function getPlaygroundDefaultDoc(): PlaygroundDocPageData | null {
  return getPlaygroundDocPageData(["zh"]);
}

export function hasPlaygroundDocIndex(): boolean {
  return getPlaygroundDefaultDoc() !== null;
}

export function resolvePlaygroundMarkdownHref(currentRepoPath: string, href?: string): string | null {
  if (!href) return null;
  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("#")
  ) {
    return href;
  }

  const [targetPath, hash] = href.split("#");
  const currentDir = path.posix.dirname(currentRepoPath);
  const resolvedPath = path.posix.normalize(path.posix.join(currentDir, targetPath));
  const entries = getPlaygroundDocEntries();
  const entry = entries.find((item) => item.repoPath === resolvedPath);

  if (!entry) return href;

  return hash ? `${entry.href}#${hash}` : entry.href;
}
