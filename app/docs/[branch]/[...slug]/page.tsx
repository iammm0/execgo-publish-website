import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DocsToc } from "@/components/docs-toc";
import { RepoMarkdown } from "@/components/repo-markdown";
import { getBranchIdOrNull, getDocPageData } from "@/lib/execgo-data";

type PageProps = {
  params: Promise<{ branch: string; slug: string[] }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { branch, slug } = await params;
  const branchId = getBranchIdOrNull(branch);

  if (!branchId) {
    return {
      title: "文档未找到",
    };
  }

  const doc = getDocPageData(branchId, slug);
  if (!doc) {
    return {
      title: "文档未找到",
    };
  }

  return {
    title: doc.title,
    description: doc.excerpt.join(" "),
  };
}

export default async function BranchDocArticlePage({ params }: PageProps) {
  const { branch, slug } = await params;
  const branchId = getBranchIdOrNull(branch);

  if (!branchId) {
    notFound();
  }

  const doc = getDocPageData(branchId, slug);
  if (!doc) {
    notFound();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,46rem)_15rem] xl:justify-between">
      <article className="glass-card overflow-hidden">
        <div className="mx-auto max-w-3xl border-b border-[#e1ebe5] px-6 py-6 sm:px-8 sm:py-8">
          <p className="section-eyebrow">{doc.entry.localeLabel}</p>
          <h1 className="section-title mt-2 text-3xl sm:text-4xl">
            {doc.title}
          </h1>
          <p className="mt-4 font-mono text-xs text-[#007b46]">
            {doc.entry.repoPath}
          </p>
          {doc.excerpt.length > 0 ? (
            <div className="mt-4 space-y-2">
              {doc.excerpt.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-7 text-[#4f6d60]">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mx-auto max-w-3xl px-6 py-6 sm:px-8 sm:py-8">
          <RepoMarkdown
            branchId={branchId}
            currentDocPath={doc.entry.repoPath}
            content={doc.content}
          />
        </div>
      </article>

      <DocsToc headings={doc.headings} />
    </div>
  );
}
