import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { DocsArticleHeader } from "@/components/docs-article-header";
import { DocsToc } from "@/components/docs-toc";
import { RepoMarkdown } from "@/components/repo-markdown";
import {
  getBranchIdOrNull,
  getDocPageData,
  toBranchBlobUrl,
} from "@/lib/execgo-data";

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
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_14rem] xl:items-start xl:gap-6">
      <DocsToc headings={doc.headings} />

      <article className="docs-article min-w-0 xl:order-first">
        <DocsArticleHeader
          eyebrow="ExecGo docs"
          title={doc.title}
          description={doc.excerpt[0]}
          badges={[doc.entry.sectionLabel, doc.entry.localeLabel, doc.branch.branchName]}
          sourceHref={toBranchBlobUrl(doc.branch, doc.entry.repoPath)}
        />
        <div className="px-4 py-5 sm:px-7 sm:py-7">
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
