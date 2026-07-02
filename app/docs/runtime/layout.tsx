import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { getRuntimeDocGroups } from "@/lib/runtime-data";
import { RuntimeSidebar } from "@/components/runtime-sidebar";

type LayoutProps = {
  children: React.ReactNode;
};

export default function RuntimeDocsLayout({ children }: LayoutProps) {
  const groups = getRuntimeDocGroups();

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
            <span className="text-[var(--foreground)]">execgo-runtime</span>
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            <span className="docs-badge">Runtime</span>
            <span className="docs-badge">HTTP + CLI</span>
            <a
              href="https://github.com/iammm0/execgo-runtime"
              target="_blank"
              rel="noreferrer"
              className="docs-source-link"
            >
              <span>GitHub repo</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)] xl:items-start xl:gap-8">
          <RuntimeSidebar groups={groups} />
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
