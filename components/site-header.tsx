import Link from "next/link";

import { LocaleToggle } from "@/components/locale-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { branchHasDocIndex } from "@/lib/execgo-data";
import { hasRuntimeDocIndex } from "@/lib/runtime-data";

export function SiteHeader() {
  const navItems = [
    ...(branchHasDocIndex("main")
      ? [{ label: "execgo 文档" as const, href: "/docs/execgo/main" }]
      : []),
    ...(hasRuntimeDocIndex()
      ? [{ label: "runtime 文档" as const, href: "/docs/runtime" }]
      : []),
    { label: "分支" as const, href: "/branches" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link
          href="/"
          className="text-base font-semibold text-[var(--foreground)] hover:text-[var(--accent-strong)]"
        >
          execgo
        </Link>

        <nav className="flex items-center gap-5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[var(--muted)] hover:text-[var(--accent-strong)]"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://github.com/iammm0/execgo"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-[var(--muted)] hover:text-[var(--accent-strong)]"
          >
            GitHub
          </a>
          <LocaleToggle />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
