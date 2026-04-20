import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  branchHasDocIndex,
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
    title: snapshot.branchName,
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
  const docIndexAvailable = branchHasDocIndex(branchId);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-sm text-[var(--muted)]">{snapshot.badge}</p>
      <h1 className="mt-2 text-3xl font-bold text-[var(--foreground)]">
        {snapshot.branchName}
      </h1>
      <p className="mt-4 text-[var(--muted)]">{snapshot.description}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">
        适用：{snapshot.audience}
      </p>

      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        {docIndexAvailable ? (
          <Link
            href={`/docs/execgo/${snapshot.id}`}
            className="text-[var(--accent-strong)] hover:underline"
          >
            文档目录
          </Link>
        ) : null}
        <a
          href={snapshot.githubBranchUrl}
          target="_blank"
          rel="noreferrer"
          className="text-[var(--muted)] hover:text-[var(--accent-strong)]"
        >
          GitHub 分支
        </a>
      </div>

      <div className="mt-10 space-y-4 border-t border-[var(--border)] pt-10">
        {snapshot.narrative.map((paragraph) => (
          <p key={paragraph} className="text-sm leading-relaxed text-[var(--muted)]">
            {paragraph}
          </p>
        ))}
      </div>

      <section className="mt-12 border-t border-[var(--border)] pt-10">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">最近提交</h2>
        <p className="mt-3 text-sm text-[var(--foreground)]">
          {snapshot.latestCommit.subject}
        </p>
        <p className="mt-2 text-xs text-[var(--muted)]">
          <span className="font-mono">{snapshot.latestCommit.shortHash}</span>
          <span className="mx-2">·</span>
          {snapshot.latestCommit.authoredDateLabel}
          <span className="mx-2">·</span>
          {snapshot.latestCommit.author}
        </p>
      </section>

      <section className="mt-12 border-t border-[var(--border)] pt-10">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">能力与相关文件</h2>
        <div className="mt-6 space-y-10">
          {snapshot.capabilities.map((capability) => (
            <div key={capability.title}>
              {capability.tags && capability.tags.length > 0 ? (
                <p className="text-xs text-[var(--muted)]">
                  {capability.tags.join(" · ")}
                </p>
              ) : null}
              <h3 className="mt-1 text-base font-semibold text-[var(--foreground)]">
                {capability.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {capability.description}
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
                {capability.evidence.map((filePath) => (
                  <li key={filePath}>
                    <a
                      href={toBranchBlobUrl(snapshot, filePath)}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-[var(--accent-strong)] hover:underline"
                    >
                      {filePath}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-[var(--border)] pt-10">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">模块</h2>
        <ul className="mt-6 space-y-8">
          {snapshot.moduleCards.map((module) => (
            <li key={module.path}>
              <p className="font-medium text-[var(--foreground)]">{module.title}</p>
              <a
                href={toBranchBlobUrl(snapshot, module.path)}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block font-mono text-xs text-[var(--accent-strong)] hover:underline"
              >
                {module.path}
              </a>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {module.description}
              </p>
              {module.note ? (
                <p className="mt-2 text-xs text-[var(--muted)]">{module.note}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 border-t border-[var(--border)] pt-10">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">README 摘录</h2>
        <div className="mt-4 space-y-3">
          {snapshot.readmeExcerpt.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-relaxed text-[var(--muted)]">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-[var(--border)] pt-10">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">HTTP 路由</h2>
        <ul className="mt-4 list-disc space-y-1 pl-5 font-mono text-sm text-[var(--muted)]">
          {snapshot.httpRoutes.map((route) => (
            <li key={`${route.method}-${route.path}`}>
              {route.method} {route.path}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 border-t border-[var(--border)] pt-10">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">gRPC 方法</h2>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
          {snapshot.grpcMethods.map((method) => (
            <li key={`${method.service}-${method.rpc}`}>
              <span className="text-[var(--foreground)]">{method.service}</span>
              <span className="mx-1">/</span>
              <span className="font-mono">{method.rpc}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 border-t border-[var(--border)] pt-10">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">
          {snapshot.diff ? "相对 main 的改动" : "发布说明"}
        </h2>
        {snapshot.diff ? (
          <div className="mt-4 space-y-6 text-sm text-[var(--muted)]">
            <p>
              变更文件 {snapshot.diff.filesChanged} 个，新增{" "}
              {snapshot.diff.insertions} 行，删除 {snapshot.diff.deletions} 行。
            </p>
            <div className="space-y-6">
              {snapshot.changedAreas.map((area) => (
                <div key={area.title}>
                  <p className="font-medium text-[var(--foreground)]">
                    {area.title}{" "}
                    <span className="font-normal text-[var(--muted)]">
                      （{area.count}）
                    </span>
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {area.samples.map((sample) => (
                      <li key={sample}>
                        <a
                          href={toBranchBlobUrl(snapshot, sample)}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-[var(--accent-strong)] hover:underline"
                        >
                          {sample}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div>
              <p className="font-medium text-[var(--foreground)]">典型改动文件</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {snapshot.topChangedFiles.slice(0, 10).map((item) => (
                  <li key={`${item.status}-${item.path}`}>
                    <a
                      href={toBranchBlobUrl(snapshot, item.path)}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      <span className="font-mono text-xs">{item.status}</span>{" "}
                      {item.path}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--muted)]">
            {snapshot.releaseHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </section>

      {docIndexAvailable ? (
        <section className="mt-12 border-t border-[var(--border)] pt-10">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">推荐阅读</h2>
          {snapshot.recommendedDocs.length > 0 ? (
            <ul className="mt-4 space-y-2 text-sm">
              {snapshot.recommendedDocs.map((doc) => (
                <li key={doc.href}>
                  <Link
                    href={doc.href}
                    className="text-[var(--accent-strong)] hover:underline"
                  >
                    {doc.title}
                  </Link>
                  <span className="ml-2 text-[var(--muted)]">({doc.localeLabel})</span>
                </li>
              ))}
            </ul>
          ) : null}
          <p className="mt-4">
            <Link
              href={`/docs/execgo/${snapshot.id}`}
              className="text-sm text-[var(--muted)] hover:text-[var(--accent-strong)]"
            >
              完整文档树 →
            </Link>
          </p>
        </section>
      ) : null}
    </div>
  );
}
