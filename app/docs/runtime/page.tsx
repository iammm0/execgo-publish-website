import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DocsArticleHeader } from "@/components/docs-article-header";
import { DocsToc } from "@/components/docs-toc";
import { RepoMarkdownSimple } from "@/components/repo-markdown-simple";
import {
  getRuntimeDefaultDoc,
  resolveRuntimeMarkdownHref,
  toRuntimeBlobUrl,
} from "@/lib/runtime-data";

export const metadata: Metadata = {
  title: "execgo-runtime docs",
  description: "Documentation for the ExecGo data-plane runtime",
};

export default function RuntimeDocsHomePage() {
  const doc = getRuntimeDefaultDoc();

  if (!doc) {
    notFound();
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_14rem] xl:items-start xl:gap-6">
      <DocsToc headings={doc.headings} />

      <article className="docs-article min-w-0 xl:order-first">
        <DocsArticleHeader
          eyebrow="Runtime docs"
          title={doc.title}
          description={doc.excerpt[0]}
          badges={[doc.entry.sectionLabel, doc.entry.localeLabel, "Data plane"]}
          sourceHref={toRuntimeBlobUrl(doc.entry.repoPath)}
        />
        <div className="repo-markdown px-4 py-5 sm:px-7 sm:py-7">
          <RepoMarkdownSimple
            content={doc.content}
            resolveHref={(href) => resolveRuntimeMarkdownHref(doc.entry.repoPath, href)}
          />
        </div>
      </article>
    </div>
  );
}
