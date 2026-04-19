import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getBranchIdOrNull,
  getBranchSnapshot,
  toBranchBlobUrl,
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
      title: "分支未找到",
    };
  }

  const snapshot = getBranchSnapshot(branchId);

  return {
    title: `${snapshot.branchName} 分支详情`,
    description: snapshot.summary,
  };
}

export default async function BranchDetailPage({ params }: PageProps) {
  const { branch } = await params;
  const branchId = getBranchIdOrNull(branch);

  if (!branchId) {
    notFound();
  }

  const snapshot = getBranchSnapshot(branchId);
  const totalTests =
    snapshot.stats.unitTests +
    snapshot.stats.moduleTests +
    snapshot.stats.integrationTests;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-card p-7">
          <p className="section-eyebrow">{snapshot.badge}</p>
          <h1 className="section-title mt-2 text-4xl sm:text-5xl">
            {snapshot.branchName}
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            {snapshot.description}
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            目标用户：{snapshot.audience}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/docs/${snapshot.id}`}
              className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-amber-200"
            >
              浏览该分支文档
            </Link>
            <a
              href={snapshot.githubBranchUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/12 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              打开 GitHub 分支
            </a>
          </div>

          <div className="mt-8 space-y-4">
            {snapshot.narrative.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-7 text-slate-300">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="glass-card p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Latest commit
            </p>
            <p className="mt-3 text-sm font-semibold text-white">
              {snapshot.latestCommit.subject}
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-400">
              <span className="font-mono text-emerald-200">
                {snapshot.latestCommit.shortHash}
              </span>
              <span>{snapshot.latestCommit.authoredDateLabel}</span>
              <span>{snapshot.latestCommit.author}</span>
            </div>
          </div>

          <div className="glass-card p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Snapshot
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                ["Go 文件", snapshot.stats.goFiles],
                ["文档", snapshot.stats.zhDocs + snapshot.stats.enDocs],
                ["测试", totalTests],
                ["HTTP 路由", snapshot.stats.httpRoutes],
                ["gRPC 方法", snapshot.stats.grpcMethods],
                ["Contrib 模块", snapshot.stats.contribModules],
              ].map(([label, value]) => (
                <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.05] p-4">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-1 text-2xl font-black text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-card p-6">
          <p className="section-eyebrow">Capabilities</p>
          <h2 className="section-title">关键能力与证据文件</h2>
          <div className="mt-6 space-y-4">
            {snapshot.capabilities.map((capability) => (
              <div
                key={capability.title}
                className="rounded-[1.4rem] border border-white/10 bg-slate-950/35 p-5"
              >
                <div className="flex flex-wrap gap-2">
                  {capability.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/[0.08] px-2.5 py-1 text-xs text-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="mt-3 text-xl font-bold text-white">
                  {capability.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  {capability.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {capability.evidence.map((filePath) => (
                    <a
                      key={filePath}
                      href={toBranchBlobUrl(snapshot, filePath)}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-mono text-emerald-100 transition hover:bg-emerald-300/16"
                    >
                      {filePath}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <div className="glass-card p-6">
            <p className="section-eyebrow">Module Map</p>
            <h2 className="section-title">模块分布</h2>
            <div className="mt-5 space-y-3">
              {snapshot.moduleCards.map((module) => (
                <div
                  key={module.path}
                  className="rounded-[1.4rem] border border-white/10 bg-white/[0.05] p-4"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-semibold text-white">{module.title}</p>
                    <a
                      href={toBranchBlobUrl(snapshot, module.path)}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-xs text-amber-200"
                    >
                      {module.path}
                    </a>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    {module.description}
                  </p>
                  {module.note ? (
                    <p className="mt-2 text-xs leading-6 text-slate-400">
                      {module.note}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <p className="section-eyebrow">Readme Signal</p>
            <h2 className="section-title">README 关键信息</h2>
            <div className="mt-5 space-y-3">
              {snapshot.readmeExcerpt.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-7 text-slate-300">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-card p-6">
          <p className="section-eyebrow">API Surface</p>
          <h2 className="section-title">接口面</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/34 p-4">
              <p className="font-semibold text-white">HTTP Routes</p>
              <div className="mt-3 space-y-2">
                {snapshot.httpRoutes.map((route) => (
                  <div
                    key={`${route.method}-${route.path}`}
                    className="rounded-2xl bg-white/[0.06] px-3 py-2 font-mono text-xs text-slate-200"
                  >
                    {route.method} {route.path}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/34 p-4">
              <p className="font-semibold text-white">gRPC Methods</p>
              <div className="mt-3 space-y-2">
                {snapshot.grpcMethods.map((method) => (
                  <div
                    key={`${method.service}-${method.rpc}`}
                    className="rounded-2xl bg-white/[0.06] px-3 py-2 text-sm text-slate-200"
                  >
                    <span className="font-semibold text-white">
                      {method.service}
                    </span>
                    <span className="mx-2 text-slate-500">/</span>
                    <span className="font-mono text-emerald-200">{method.rpc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <p className="section-eyebrow">
            {snapshot.diff ? "Diff against main" : "Release highlights"}
          </p>
          <h2 className="section-title">
            {snapshot.diff ? "相对 `main` 的改动" : "当前主线发布亮点"}
          </h2>

          {snapshot.diff ? (
            <>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  ["变更文件", snapshot.diff.filesChanged],
                  ["新增行", snapshot.diff.insertions],
                  ["删除行", snapshot.diff.deletions],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-3xl border border-white/10 bg-white/[0.06] p-4"
                  >
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-1 text-2xl font-black text-white">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-4">
                {snapshot.changedAreas.map((area) => (
                  <div
                    key={area.title}
                    className="rounded-[1.4rem] border border-white/10 bg-slate-950/34 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-white">{area.title}</p>
                      <span className="rounded-full bg-amber-300/12 px-2.5 py-1 text-xs text-amber-100">
                        {area.count}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {area.samples.map((sample) => (
                        <a
                          key={sample}
                          href={toBranchBlobUrl(snapshot, sample)}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 font-mono text-xs text-slate-200"
                        >
                          {sample}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[1.4rem] border border-emerald-300/20 bg-emerald-300/10 p-4">
                <p className="text-sm font-semibold text-emerald-100">
                  典型改动文件
                </p>
                <div className="mt-3 grid gap-2">
                  {snapshot.topChangedFiles.slice(0, 10).map((item) => (
                    <a
                      key={`${item.status}-${item.path}`}
                      href={toBranchBlobUrl(snapshot, item.path)}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl border border-white/10 bg-slate-950/30 px-3 py-2 text-sm text-slate-200"
                    >
                      <span className="mr-2 font-mono text-xs text-amber-200">
                        {item.status}
                      </span>
                      {item.path}
                    </a>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="mt-5 space-y-3">
              {snapshot.releaseHighlights.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.4rem] border border-white/10 bg-white/[0.05] px-4 py-3 text-sm leading-7 text-slate-300"
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mt-10 glass-card p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-eyebrow">Recommended reading</p>
            <h2 className="section-title">建议从这些文档开始</h2>
          </div>
          <Link
            href={`/docs/${snapshot.id}`}
            className="text-sm font-semibold text-amber-200 transition hover:text-amber-100"
          >
            打开完整文档树
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {snapshot.recommendedDocs.map((doc) => (
            <Link
              key={doc.href}
              href={doc.href}
              className="rounded-[1.4rem] border border-white/10 bg-white/[0.05] p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.08]"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                {doc.localeLabel}
              </p>
              <p className="mt-2 text-lg font-semibold text-white">{doc.title}</p>
              <p className="mt-2 text-sm text-slate-400">{doc.repoPath}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
