import Link from "next/link";

import { branchHasDocIndex } from "@/lib/execgo-data";
import { hasRuntimeDocIndex } from "@/lib/runtime-data";

const GITHUB_ICON_SRC = "/github.svg";

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
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/iammm0/execgo"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--accent-strong)]"
              aria-label="打开 execgo GitHub 仓库"
            >
              <img
                src={GITHUB_ICON_SRC}
                alt=""
                className="h-4 w-4 opacity-80 dark:invert"
              />
              <span>execgo</span>
            </a>
            <a
              href="https://github.com/iammm0/execgo-runtime"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--accent-strong)]"
              aria-label="打开 execgo-runtime GitHub 仓库"
            >
              <img
                src={GITHUB_ICON_SRC}
                alt=""
                className="h-4 w-4 opacity-80 dark:invert"
              />
              <span>runtime</span>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
