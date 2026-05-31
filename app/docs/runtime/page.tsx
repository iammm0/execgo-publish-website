import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DocsToc } from "@/components/docs-toc";
import { RepoMarkdownSimple } from "@/components/repo-markdown-simple";
import { getRuntimeDefaultDoc, resolveRuntimeMarkdownHref } from "@/lib/runtime-data";

export const metadata: Metadata = {
  title: "execgo-runtime 文档",
  description: "ExecGo 数据面运行时文档",
};

export default function RuntimeDocsHomePage() {
  const doc = getRuntimeDefaultDoc();

  if (!doc) {
    notFound();
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_12.5rem] xl:items-start xl:gap-6">
      <DocsToc headings={doc.headings} />

      <article className="min-w-0 border border-[var(--border)] bg-[var(--panel)] xl:order-first">
        <div className="repo-markdown px-4 py-5 sm:px-6 sm:py-6">
          <RepoMarkdownSimple
            content={doc.content}
            resolveHref={(href) => resolveRuntimeMarkdownHref(doc.entry.repoPath, href)}
          />
        </div>
      </article>
    </div>
  );
}
