import Link from "next/link";

import { getSiteData } from "@/lib/execgo-data";

export const metadata = {
  title: "双分支总览",
};

export default function BranchesPage() {
  const site = getSiteData();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="max-w-4xl">
        <p className="section-eyebrow">Branches</p>
        <h1 className="section-title text-4xl sm:text-5xl">
          ExecGo 双分支发布总览
        </h1>
        <p className="mt-5 text-lg leading-8 text-[#4f6d60]">
          `main` 负责稳定交付，`feat-add-cluster` 负责展示向事件驱动控制面、
          队列化运行时与远程 Worker 演进的方向。两条线都不是一句话带过，而是各自独立成页。
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {site.branches.map((branch) => (
          <article key={branch.id} className="glass-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7a9186]">
                  {branch.badge}
                </p>
                <h2 className="mt-2 text-3xl font-black text-[#113222]">
                  {branch.branchName}
                </h2>
              </div>
              <span className="rounded-full bg-[#f4fbf7] px-3 py-1 text-xs font-semibold text-[#007b46]">
                {branch.channel}
              </span>
            </div>

            <p className="mt-4 text-sm leading-7 text-[#4f6d60]">
              {branch.summary}
            </p>
            <p className="mt-3 text-sm leading-7 text-[#5f7b6f]">
              适用人群：{branch.audience}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["Go 文件", branch.stats.goFiles],
                ["文档总数", branch.stats.zhDocs + branch.stats.enDocs],
                [
                  "测试总数",
                  branch.stats.unitTests +
                    branch.stats.moduleTests +
                    branch.stats.integrationTests,
                ],
                ["gRPC 方法", branch.stats.grpcMethods],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-[#e1ebe5] bg-[#fbfefd] p-4">
                  <p className="text-xs text-[#7a9186]">{label}</p>
                  <p className="mt-1 text-2xl font-black text-[#123222]">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              {branch.narrative.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-7 text-[#4f6d60]">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {branch.focusAreas.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#d8e6de] bg-[#f7faf8] px-3 py-1 text-xs text-[#335646]"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/branches/${branch.id}`}
                className="rounded-full bg-[#123222] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#009e5b]"
              >
                查看详情
              </Link>
              <Link
                href={`/docs/${branch.id}`}
                className="rounded-full border border-[#bfd9ca] px-4 py-2 text-sm font-semibold text-[#123222] transition hover:border-[#009e5b] hover:text-[#007b46]"
              >
                查看文档
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
