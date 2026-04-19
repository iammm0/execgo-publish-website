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
      <div className="mb-6 rounded-[1.8rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
              Docs Branch
            </p>
            <h1 className="mt-2 text-3xl font-black text-white">
              {snapshot.branchName} 文档目录
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/branches/${snapshot.id}`}
              className="rounded-full border border-white/12 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              分支详情
            </Link>
            <a
              href={snapshot.githubBranchUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-emerald-300/24 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/16"
            >
              GitHub 分支
            </a>
          </div>
        </div>

        <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300">
          这个文档区会直接读取 `{snapshot.branchName}` 分支下的
          `docs/` Markdown 内容；左侧目录来自仓库文件树，而不是手工维护的静态数组。
        </p>
      </div>

      <div className="mb-4 rounded-[1.6rem] border border-white/10 bg-white/[0.05] p-4 xl:hidden">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          快速切换
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/docs/main"
            className={`rounded-full px-4 py-2 text-sm ${
              branchId === "main"
                ? "bg-amber-300 text-slate-950"
                : "bg-white/[0.06] text-white"
            }`}
          >
            main
          </Link>
          <Link
            href="/docs/feat-add-cluster"
            className={`rounded-full px-4 py-2 text-sm ${
              branchId === "feat-add-cluster"
                ? "bg-amber-300 text-slate-950"
                : "bg-white/[0.06] text-white"
            }`}
          >
            feat-add-cluster
          </Link>
        </div>
      </div>

      <div className="flex gap-8">
        <DocsSidebar branchId={branchId} groups={snapshot.docGroups} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
