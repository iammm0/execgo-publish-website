import Link from "next/link";
import { notFound } from "next/navigation";

import { DocsSidebar } from "@/components/docs-sidebar";
import { getBranchIdOrNull, getBranchSnapshot } from "@/lib/execgo-data";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ branch: string }>;
};

export default async function BranchDocsLayout({
  children,
  params,
}: LayoutProps) {
  const { branch } = await params;
  const branchId = getBranchIdOrNull(branch);

  if (!branchId) {
    notFound();
  }

  const snapshot = getBranchSnapshot(branchId);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-[1.6rem] border border-[#d8e6de] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#009e5b]">
              Docs snapshot
            </p>
            <h1 className="mt-2 text-3xl font-black text-[#113222]">
              {snapshot.branchName} 文档目录
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/branches/${snapshot.id}`}
              className="rounded-full border border-[#bfd9ca] px-4 py-2 text-sm font-semibold text-[#123222] transition hover:border-[#009e5b] hover:text-[#007b46]"
            >
              分支详情
            </Link>
            <a
              href={snapshot.githubBranchUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[#123222] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#009e5b]"
            >
              GitHub 分支
            </a>
          </div>
        </div>

        <p className="mt-4 max-w-4xl text-sm leading-7 text-[#4f6d60]">
          这里读取的是发布网站项目内的静态文档快照目录，而不是运行时直接访问
          `execgo` 仓库。左侧目录来自快照文件树，右侧保留本页目录，整体布局参考官方文档站的结构。
        </p>
        <div className="mt-5 flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#789487]">
          <span>{snapshot.stats.zhDocs} 中文文档</span>
          <span>{snapshot.stats.enDocs} English docs</span>
          <span>{snapshot.docs.length} Markdown pages</span>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[18.5rem_minmax(0,1fr)] xl:items-start">
        <DocsSidebar branchId={branchId} groups={snapshot.docGroups} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
