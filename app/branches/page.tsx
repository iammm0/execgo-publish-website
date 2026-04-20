import Link from "next/link";

import { branchHasDocIndex, getSiteData } from "@/lib/execgo-data";

export const metadata = {
  title: "分支",
};

export default function BranchesPage() {
  const site = getSiteData();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold text-[var(--foreground)]">分支</h1>
      <p className="mt-4 max-w-2xl text-[var(--muted)]">
        文档与说明按 execgo 仓库快照分为两条线：稳定主线与集群相关演进线。任选其一进入文档。
      </p>

      <ul className="mt-12 divide-y divide-[var(--border)] border-y border-[var(--border)]">
        {site.branches.map((branch) => (
          <li key={branch.id} className="py-8">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              {branch.branchName}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              {branch.summary}
            </p>
            <div className="mt-4 flex flex-wrap gap-6 text-sm">
              {branchHasDocIndex(branch.id) ? (
                <Link
                  href={`/docs/execgo/${branch.id}`}
                  className="text-[var(--accent-strong)] hover:underline"
                >
                  查看文档 →
                </Link>
              ) : null}
              <Link
                href={`/branches/${branch.id}`}
                className="text-[var(--muted)] hover:text-[var(--accent-strong)]"
              >
                分支说明
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
