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
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_260px]">
      <article className="glass-card overflow-hidden">
        <div className="border-b border-white/10 p-6 sm:p-8">
          <p className="section-eyebrow">{snapshot.branchName}</p>
          <h2 className="section-title mt-2 text-3xl sm:text-4xl">
            {doc.title}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            默认展示 `docs/zh/README.md`。你可以从左侧文档树切到中文、英文、部署、
            集成、参考手册和发布说明中的任意 Markdown 文件。
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ["中文文档", snapshot.stats.zhDocs],
              ["英文文档", snapshot.stats.enDocs],
              ["文档总数", snapshot.docs.length],
            ].map(([label, value]) => (
              <div key={label} className="rounded-3xl bg-white/[0.06] p-4">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-1 text-2xl font-black text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {snapshot.recommendedDocs.slice(0, 6).map((entry) => (
              <Link
                key={entry.href}
                href={entry.href}
                className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-slate-200 transition hover:bg-white/[0.09]"
              >
                {entry.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8">
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
