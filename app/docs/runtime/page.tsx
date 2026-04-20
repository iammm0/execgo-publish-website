import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DocsToc } from "@/components/docs-toc";
import { RepoMarkdownSimple } from "@/components/repo-markdown-simple";
import { getRuntimeDefaultDoc } from "@/lib/runtime-data";

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
    <div className="grid gap-8 xl:grid-cols-[minmax(0,46rem)_14rem] xl:justify-between">
      <article className="min-w-0 border border-[var(--border)] bg-[var(--panel)]">
        <header className="border-b border-[var(--border)] px-5 py-6 sm:px-6">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">{doc.title}</h1>
        </header>
        <div className="repo-markdown px-5 py-6 sm:px-6">
          <RepoMarkdownSimple content={doc.content} />
        </div>
      </article>

      <DocsToc headings={doc.headings} />
    </div>
  );
}
