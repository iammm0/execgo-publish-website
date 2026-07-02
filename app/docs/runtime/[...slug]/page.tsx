import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DocsArticleHeader } from "@/components/docs-article-header";
import { DocsToc } from "@/components/docs-toc";
import { RepoMarkdownSimple } from "@/components/repo-markdown-simple";
import {
  getRuntimeDocPageData,
  resolveRuntimeMarkdownHref,
  toRuntimeBlobUrl,
} from "@/lib/runtime-data";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getRuntimeDocPageData(slug);
  if (!doc) {
    return { title: "Document not found" };
  }
  return { title: doc.title };
}

export default async function RuntimeDocPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = getRuntimeDocPageData(slug);

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
