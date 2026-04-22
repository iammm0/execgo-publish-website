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
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_12.5rem] xl:items-start xl:gap-6">
      <DocsToc headings={doc.headings} />

      <article className="min-w-0 border border-[var(--border)] bg-[var(--panel)] xl:order-first">
        <div className="repo-markdown px-4 py-5 sm:px-6 sm:py-6">
          <RepoMarkdownSimple content={doc.content} />
        </div>
      </article>
    </div>
  );
}
