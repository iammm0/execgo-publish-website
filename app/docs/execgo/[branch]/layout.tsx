import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";

import { DocsSidebar } from "@/components/docs-sidebar";
import { getBranchIdOrNull, getBranchSnapshot } from "@/lib/execgo-data";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ branch: string }>;
};

export default async function ExecgoDocsLayout({ children, params }: LayoutProps) {
  const { branch } = await params;
  const branchId = getBranchIdOrNull(branch);

  if (!branchId) {
    notFound();
  }

  const snapshot = getBranchSnapshot(branchId);

  return (
    <div className="docs-shell">
      <div className="mx-auto w-full max-w-[104rem] px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
        <div className="docs-routebar mb-6">
          <nav className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--muted)]">
            <Link href="/" className="hover:text-[var(--accent-strong)]">
              Home
            </Link>
            <span className="text-[var(--border)]">/</span>
            <span className="text-[var(--foreground)]">Docs</span>
            <span className="text-[var(--border)]">/</span>
            <Link
              href="/docs/execgo/release-agent-adapter-runtime"
              className="hover:text-[var(--accent-strong)]"
            >
              execgo
            </Link>
            <span className="text-[var(--border)]">/</span>
            <span className="min-w-0 break-words text-[var(--foreground)]">
              {snapshot.branchName}
            </span>
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            <span className="docs-badge">{snapshot.badge}</span>
            <span className="docs-badge">{snapshot.releaseVersion}</span>
            <a
              href={snapshot.githubBranchUrl}
              target="_blank"
              rel="noreferrer"
              className="docs-source-link"
            >
              <span>GitHub branch</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)] xl:items-start xl:gap-8">
          <DocsSidebar branchId={branchId} groups={snapshot.docGroups} />
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
