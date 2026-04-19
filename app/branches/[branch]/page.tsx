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
      <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="glass-card p-7">
          <p className="section-eyebrow">{snapshot.badge}</p>
          <h1 className="section-title mt-2 text-4xl sm:text-5xl">
            {snapshot.branchName}
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#4f6d60]">
            {snapshot.description}
          </p>
          <p className="mt-4 text-sm leading-7 text-[#5f7b6f]">
            目标用户：{snapshot.audience}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/docs/${snapshot.id}`}
              className="rounded-full bg-[#009e5b] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#007b46]"
            >
              浏览该分支文档
            </Link>
            <a
              href={snapshot.githubBranchUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[#bfd9ca] px-4 py-2 text-sm font-semibold text-[#123222] transition hover:border-[#009e5b] hover:text-[#007b46]"
            >
              打开 GitHub 分支
            </a>
          </div>

          <div className="mt-8 space-y-4">
            {snapshot.narrative.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-7 text-[#4f6d60]">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="glass-card p-5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#009e5b]">
              Latest commit
            </p>
            <p className="mt-3 text-sm font-semibold text-[#123222]">
              {snapshot.latestCommit.subject}
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-[#789487]">
              <span className="font-mono text-[#007b46]">
                {snapshot.latestCommit.shortHash}
              </span>
              <span>{snapshot.latestCommit.authoredDateLabel}</span>
              <span>{snapshot.latestCommit.author}</span>
            </div>
          </div>

          <div className="glass-card p-5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#009e5b]">
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
                <div key={label} className="rounded-2xl border border-[#e1ebe5] bg-[#fbfefd] p-4">
                  <p className="text-xs text-[#7a9186]">{label}</p>
                  <p className="mt-1 text-2xl font-black text-[#123222]">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[0.96fr_1.04fr]">
        <div className="glass-card p-6">
          <p className="section-eyebrow">Capabilities</p>
          <h2 className="section-title">关键能力与证据文件</h2>
          <div className="mt-6 space-y-4">
            {snapshot.capabilities.map((capability) => (
              <div
                key={capability.title}
                className="rounded-2xl border border-[#e1ebe5] bg-[#fbfefd] p-5"
              >
                <div className="flex flex-wrap gap-2">
                  {capability.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#f4fbf7] px-2.5 py-1 text-xs font-semibold text-[#007b46]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="mt-3 text-xl font-bold text-[#123222]">
                  {capability.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-[#5f7b6f]">
                  {capability.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {capability.evidence.map((filePath) => (
                    <a
                      key={filePath}
                      href={toBranchBlobUrl(snapshot, filePath)}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-[#d8e6de] bg-white px-3 py-1 text-xs font-mono text-[#007b46] transition hover:border-[#009e5b] hover:bg-[#f4fbf7]"
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
            <p className="section-eyebrow">Module map</p>
            <h2 className="section-title">模块分布</h2>
            <div className="mt-5 space-y-3">
              {snapshot.moduleCards.map((module) => (
                <div
                  key={module.path}
                  className="rounded-2xl border border-[#e1ebe5] bg-[#fbfefd] p-4"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-semibold text-[#123222]">{module.title}</p>
                    <a
                      href={toBranchBlobUrl(snapshot, module.path)}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-xs text-[#007b46]"
                    >
                      {module.path}
                    </a>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-[#5f7b6f]">
                    {module.description}
                  </p>
                  {module.note ? (
                    <p className="mt-2 text-xs leading-6 text-[#789487]">
                      {module.note}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <p className="section-eyebrow">Readme signal</p>
            <h2 className="section-title">README 关键信息</h2>
            <div className="mt-5 space-y-3">
              {snapshot.readmeExcerpt.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-7 text-[#4f6d60]">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[0.96fr_1.04fr]">
        <div className="glass-card p-6">
          <p className="section-eyebrow">API surface</p>
          <h2 className="section-title">接口面</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[#e1ebe5] bg-[#fbfefd] p-4">
              <p className="font-semibold text-[#123222]">HTTP Routes</p>
              <div className="mt-3 space-y-2">
                {snapshot.httpRoutes.map((route) => (
                  <div
                    key={`${route.method}-${route.path}`}
                    className="rounded-xl bg-[#f4f9f6] px-3 py-2 font-mono text-xs text-[#335646]"
                  >
                    {route.method} {route.path}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#e1ebe5] bg-[#fbfefd] p-4">
              <p className="font-semibold text-[#123222]">gRPC Methods</p>
              <div className="mt-3 space-y-2">
                {snapshot.grpcMethods.map((method) => (
                  <div
                    key={`${method.service}-${method.rpc}`}
                    className="rounded-xl bg-[#f4f9f6] px-3 py-2 text-sm text-[#335646]"
                  >
                    <span className="font-semibold text-[#123222]">
                      {method.service}
                    </span>
                    <span className="mx-2 text-[#97a89f]">/</span>
                    <span className="font-mono text-[#007b46]">{method.rpc}</span>
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
            {snapshot.diff ? "相对 main 的改动" : "当前主线发布亮点"}
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
                    className="rounded-2xl border border-[#e1ebe5] bg-[#fbfefd] p-4"
                  >
                    <p className="text-xs text-[#7a9186]">{label}</p>
                    <p className="mt-1 text-2xl font-black text-[#123222]">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-4">
                {snapshot.changedAreas.map((area) => (
                  <div
                    key={area.title}
                    className="rounded-2xl border border-[#e1ebe5] bg-[#fbfefd] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-[#123222]">{area.title}</p>
                      <span className="rounded-full bg-[#f4fbf7] px-2.5 py-1 text-xs font-semibold text-[#007b46]">
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
                          className="rounded-full border border-[#d8e6de] bg-white px-3 py-1 font-mono text-xs text-[#335646]"
                        >
                          {sample}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-[#d8eadf] bg-[#f4fbf7] p-4">
                <p className="text-sm font-semibold text-[#007b46]">
                  典型改动文件
                </p>
                <div className="mt-3 grid gap-2">
                  {snapshot.topChangedFiles.slice(0, 10).map((item) => (
                    <a
                      key={`${item.status}-${item.path}`}
                      href={toBranchBlobUrl(snapshot, item.path)}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border border-[#d8e6de] bg-white px-3 py-2 text-sm text-[#335646]"
                    >
                      <span className="mr-2 font-mono text-xs text-[#007b46]">
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
                  className="rounded-2xl border border-[#e1ebe5] bg-[#fbfefd] px-4 py-3 text-sm leading-7 text-[#4f6d60]"
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
            className="text-sm font-semibold text-[#007b46] transition hover:text-[#009e5b]"
          >
            打开完整文档树
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {snapshot.recommendedDocs.map((doc) => (
            <Link
              key={doc.href}
              href={doc.href}
              className="rounded-2xl border border-[#e1ebe5] bg-[#fbfefd] p-4 transition hover:-translate-y-0.5 hover:border-[#bfd9ca] hover:bg-[#f4fbf7]"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-[#7a9186]">
                {doc.localeLabel}
              </p>
              <p className="mt-2 text-lg font-semibold text-[#123222]">{doc.title}</p>
              <p className="mt-2 text-sm text-[#789487]">{doc.repoPath}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
