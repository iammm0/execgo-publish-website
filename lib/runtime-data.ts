import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

import type { DocEntry, DocNavGroup, DocNavSection, MarkdownHeading } from "./execgo-data";
import { normalizeDocRouteSlug, slugifyHeading } from "./execgo-data";

const RUNTIME_CONTENT_ROOT = path.join(process.cwd(), "content", "execgo-runtime", "docs");
const RUNTIME_DOC_LOCALES = ["en", "zh"] as const;
const DEFAULT_RUNTIME_DOC_LOCALE = "en";
const RUNTIME_GITHUB_REPO = "https://github.com/iammm0/execgo-runtime";

type RuntimeDocLocale = (typeof RUNTIME_DOC_LOCALES)[number];

export type RuntimeDocPageData = {
  entry: DocEntry;
  title: string;
  content: string;
  headings: MarkdownHeading[];
  excerpt: string[];
};

function isRuntimeDocLocale(value: string): value is RuntimeDocLocale {
  return RUNTIME_DOC_LOCALES.includes(value as RuntimeDocLocale);
}

function runtimeLocaleLabel(locale: RuntimeDocLocale): string {
  return locale === "en" ? "English" : "Chinese";
}

function runtimeSectionTitle(locale: RuntimeDocLocale): string {
  return locale === "en" ? "Runtime docs" : "运行时文档";
}

function humanizeFilename(filename: string, locale: RuntimeDocLocale): string {
  if (locale === "zh") {
    return filename
      .replace(/\.md$/i, "")
      .replace(/^readme$/i, "概览")
      .replace(/^api$/i, "HTTP API")
      .replace(/^cli$/i, "CLI")
      .replace(/^architecture$/i, "架构")
      .replace(/^deployment$/i, "部署")
      .replace(/^development$/i, "开发");
  }

  return filename
    .replace(/\.md$/i, "")
    .replace(/[-_]/g, " ")
    .replace(/^readme$/i, "Overview")
    .replace(/^api$/i, "HTTP API")
    .replace(/^cli$/i, "CLI")
    .replace(/^architecture$/i, "Architecture")
    .replace(/^deployment$/i, "Deployment")
    .replace(/^development$/i, "Development");
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
  const entries: DocEntry[] = [];

  for (const locale of RUNTIME_DOC_LOCALES) {
    const localeDir = path.join(RUNTIME_CONTENT_ROOT, locale);
    if (!fs.existsSync(localeDir)) continue;

    const files = fs.readdirSync(localeDir).filter((f) => f.endsWith(".md")).sort();

    for (const filename of files) {
      const slug = filename.toLowerCase() === "readme.md"
        ? [locale]
        : [locale, filename.replace(/\.md$/i, "").toLowerCase()];
      const title = humanizeFilename(filename, locale);

      entries.push({
        title,
        slug,
        slugKey: slug.join("/"),
        repoPath: locale === DEFAULT_RUNTIME_DOC_LOCALE
          ? `docs/${filename}`
          : `docs/${locale}/${filename}`,
        locale,
        localeLabel: runtimeLocaleLabel(locale),
        section: "runtime",
        sectionLabel: "Runtime",
        href: `/docs/runtime/${slug.join("/")}`,
      });
    }
  }

  return entries;
});

export const getRuntimeDocGroups = cache((): DocNavGroup[] => {
  const entries = getRuntimeDocEntries();
  if (entries.length === 0) return [];

  return RUNTIME_DOC_LOCALES.flatMap((locale) => {
    const items = entries.filter((entry) => entry.locale === locale);
    if (items.length === 0) return [];

    const runtimeSection: DocNavSection = {
      title: runtimeSectionTitle(locale),
      items,
    };

    return [
      {
        locale,
        title: runtimeLocaleLabel(locale),
        sections: [runtimeSection],
      },
    ];
  });
});

export function getRuntimeDocPageData(slug: string[]): RuntimeDocPageData | null {
  const entries = getRuntimeDocEntries();
  const key = normalizeDocRouteSlug(slug).join("/");
  const entry = entries.find((e) => e.slugKey === key);

  if (!entry) return null;

  if (!isRuntimeDocLocale(entry.locale)) return null;

  const filePath = path.join(RUNTIME_CONTENT_ROOT, entry.locale, path.basename(entry.repoPath));
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
  return getRuntimeDocPageData([DEFAULT_RUNTIME_DOC_LOCALE]);
}

function safeDecodeRuntimeHref(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function runtimeRouteForSourceDoc(sourcePath: string): string | null {
  if (!sourcePath.startsWith("docs/") || !sourcePath.endsWith(".md")) {
    return null;
  }

  const normalizedSourcePath = sourcePath.startsWith("docs/en/")
    ? sourcePath.replace(/^docs\/en\//, "docs/")
    : sourcePath;

  return getRuntimeDocEntries().find((entry) => entry.repoPath === normalizedSourcePath)?.href ?? null;
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

/** Whether a runtime docs index page is available (used to hide nav when empty). */
export function hasRuntimeDocIndex(): boolean {
  return getRuntimeDefaultDoc() !== null;
}
