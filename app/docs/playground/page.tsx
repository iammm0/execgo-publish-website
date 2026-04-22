import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DocsToc } from "@/components/docs-toc";
import { RepoMarkdownSimple } from "@/components/repo-markdown-simple";
import { getPlaygroundDefaultDoc, resolvePlaygroundMarkdownHref } from "@/lib/playground-data";

export const metadata: Metadata = {
  title: "execgo-playground 训练场",
  description: "ExecGo 训练场与 AI 编排可靠性实验平台文档",
};

export default function PlaygroundDocsHomePage() {
  const doc = getPlaygroundDefaultDoc();

  if (!doc) {
    notFound();
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,46rem)_14rem] xl:justify-between xl:gap-8">
      <DocsToc headings={doc.headings} />

      <article className="min-w-0 border border-[var(--border)] bg-[var(--panel)] xl:order-first">
        <div className="repo-markdown px-4 py-5 sm:px-6 sm:py-6">
          <RepoMarkdownSimple
            content={doc.content}
            resolveHref={(href) => resolvePlaygroundMarkdownHref(doc.entry.repoPath, href)}
          />
        </div>
      </article>
    </div>
  );
}
