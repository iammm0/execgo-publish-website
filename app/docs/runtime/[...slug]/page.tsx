import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DocsToc } from "@/components/docs-toc";
import { RepoMarkdownSimple } from "@/components/repo-markdown-simple";
import { getRuntimeDocPageData } from "@/lib/runtime-data";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getRuntimeDocPageData(slug);
  if (!doc) {
    return { title: "文档未找到" };
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
    <div className="grid gap-8 xl:grid-cols-[minmax(0,46rem)_14rem] xl:justify-between">
      <article className="min-w-0 border border-[var(--border)] bg-[var(--panel)]">
        <header className="border-b border-[var(--border)] px-5 py-6 sm:px-6">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">{doc.title}</h1>
          <p className="mt-2 font-mono text-xs text-[var(--muted)]">{doc.entry.repoPath}</p>
        </header>
        <div className="repo-markdown px-5 py-6 sm:px-6">
          <RepoMarkdownSimple content={doc.content} />
        </div>
      </article>

      <DocsToc headings={doc.headings} />
    </div>
  );
}
