import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DocsToc } from "@/components/docs-toc";
import { RepoMarkdown } from "@/components/repo-markdown";
import {
  getBranchIdOrNull,
  getBranchSnapshot,
  getDefaultDocPage,
} from "@/lib/execgo-data";

type PageProps = {
  params: Promise<{ branch: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { branch } = await params;
  const branchId = getBranchIdOrNull(branch);

  if (!branchId) {
    return {
      title: "文档未找到",
    };
  }

  const snapshot = getBranchSnapshot(branchId);
  return {
    title: `${snapshot.branchName} 文档`,
    description: snapshot.summary,
  };
}

export default async function BranchDocsHomePage({ params }: PageProps) {
  const { branch } = await params;
  const branchId = getBranchIdOrNull(branch);

  if (!branchId) {
    notFound();
  }

  const snapshot = getBranchSnapshot(branchId);
  const doc = getDefaultDocPage(branchId);

  if (!doc) {
    notFound();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,46rem)_15rem] xl:justify-between">
      <article className="glass-card overflow-hidden">
        <div className="mx-auto max-w-3xl border-b border-[#e1ebe5] px-6 py-6 sm:px-8 sm:py-8">
          <p className="section-eyebrow">{snapshot.branchName}</p>
          <h2 className="section-title mt-2 text-3xl sm:text-4xl">
            {doc.title}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#4f6d60]">
            默认展示 `docs/zh/README.md`。你可以从左侧目录切到中文、英文、部署、
            集成、编排语义、执行器与发布说明中的任意 Markdown 文档。
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ["中文文档", snapshot.stats.zhDocs],
              ["英文文档", snapshot.stats.enDocs],
              ["文档总数", snapshot.docs.length],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-[#e1ebe5] bg-[#fbfefd] p-4">
                <p className="text-xs text-[#7a9186]">{label}</p>
                <p className="mt-1 text-2xl font-black text-[#123222]">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {snapshot.recommendedDocs.slice(0, 6).map((entry) => (
              <Link
                key={entry.href}
                href={entry.href}
                className="rounded-full border border-[#d8e6de] bg-white px-3 py-1 text-xs text-[#335646] transition hover:border-[#bfd9ca] hover:bg-[#f4fbf7] hover:text-[#007b46]"
              >
                {entry.title}
              </Link>
            ))}
          </div>
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
