import Link from "next/link";

import { PlaygroundSidebar } from "@/components/playground-sidebar";
import { getPlaygroundDocGroups } from "@/lib/playground-data";

type LayoutProps = {
  children: React.ReactNode;
};

export default function PlaygroundDocsLayout({ children }: LayoutProps) {
  const groups = getPlaygroundDocGroups();

  return (
    <div className="mx-auto w-full max-w-[96rem] px-3 py-6 sm:px-6 sm:py-10">
      <nav className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--muted)] sm:mb-8">
        <Link href="/" className="hover:text-[var(--accent-strong)]">
          首页
        </Link>
        <span>/</span>
        <span className="text-[var(--foreground)]">文档</span>
        <span>/</span>
        <span className="text-[var(--foreground)]">训练场</span>
      </nav>

      <div className="grid gap-8 xl:grid-cols-[15rem_minmax(0,1fr)] xl:items-start xl:gap-10">
        <PlaygroundSidebar groups={groups} />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
