import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { DocsToc } from "@/components/docs-toc";
import { RepoMarkdown } from "@/components/repo-markdown";
import { getBranchIdOrNull, getDocPageData } from "@/lib/execgo-data";

type PageProps = {
  params: Promise<{ branch: string; slug?: string[] }>;
};

function docHref(branchId: string, slug: string[] = []): string {
  if (slug.length === 0) {
    return `/docs/execgo/${branchId}`;
  }

  return `/docs/execgo/${branchId}/${slug.map(encodeURIComponent).join("/")}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { branch, slug } = await params;
  const branchId = getBranchIdOrNull(branch);
  if (!branchId) return { title: "Docs" };

  const doc = getDocPageData(branchId, slug ?? []);
  if (!doc) return { title: "Docs" };

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

  if (branch !== branchId) {
    redirect(docHref(branchId, slug ?? []));
  }

  const doc = getDocPageData(branchId, slug ?? []);

  if (!doc) {
    notFound();
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_12.5rem] xl:items-start xl:gap-6">
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
