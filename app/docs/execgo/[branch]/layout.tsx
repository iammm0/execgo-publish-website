import Link from "next/link";
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
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <nav className="mb-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--accent-strong)]">
          首页
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">文档</span>
        <span className="mx-2">/</span>
        <Link href="/docs/execgo/main" className="hover:text-[var(--accent-strong)]">
          execgo
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">{snapshot.branchName}</span>
      </nav>

      <div className="grid gap-8 xl:grid-cols-[18.5rem_minmax(0,1fr)] xl:items-start">
        <DocsSidebar branchId={branchId} groups={snapshot.docGroups} />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
