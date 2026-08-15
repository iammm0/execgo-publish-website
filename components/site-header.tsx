import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="site-header sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]">
      <div className="relative flex min-h-14 w-full items-center justify-between gap-4 px-4 py-2 sm:px-6">
        <Link
          href="/"
          className="text-base font-semibold text-[var(--foreground)] hover:text-[var(--accent-strong)]"
        >
          execgo
        </Link>

        <ThemeToggle />
      </div>
    </header>
  );
}
