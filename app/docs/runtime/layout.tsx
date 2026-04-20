import Link from "next/link";

import { getRuntimeDocGroups } from "@/lib/runtime-data";
import { RuntimeSidebar } from "@/components/runtime-sidebar";

type LayoutProps = {
  children: React.ReactNode;
};

export default function RuntimeDocsLayout({ children }: LayoutProps) {
  const groups = getRuntimeDocGroups();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <nav className="mb-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--accent-strong)]">
          首页
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">文档</span>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">execgo-runtime</span>
      </nav>

      <div className="grid gap-8 xl:grid-cols-[16rem_minmax(0,1fr)] xl:items-start">
        <RuntimeSidebar groups={groups} />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
