import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DocsToc } from "@/components/docs-toc";
import { RepoMarkdown } from "@/components/repo-markdown";
import { getBranchIdOrNull, getDocPageData } from "@/lib/execgo-data";

type PageProps = {
  params: Promise<{ branch: string; slug?: string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { branch, slug } = await params;
  const branchId = getBranchIdOrNull(branch);
  if (!branchId) return { title: "文档" };

  const doc = getDocPageData(branchId, slug ?? []);
  if (!doc) return { title: "文档" };

  return {
    title: doc.title,
    description: doc.excerpt.join(" ").slice(0, 160),
  };
}

export default async function ExecgoDocPage({ params }: PageProps) {
  const { branch, slug } = await params;
  const branchId = getBranchIdOrNull(branch);

  if (!branchId) {
    notFound();
  }

  const doc = getDocPageData(branchId, slug ?? []);

  if (!doc) {
    notFound();
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,46rem)_14rem] xl:justify-between xl:gap-8">
      <DocsToc headings={doc.headings} />

      <article className="min-w-0 border border-[var(--border)] bg-[var(--panel)] xl:order-first">
        <div className="px-4 py-5 sm:px-6 sm:py-6">
          <RepoMarkdown
            branchId={branchId}
            content={doc.content}
            currentDocPath={doc.entry.repoPath}
          />
        </div>
      </article>
    </div>
  );
}
