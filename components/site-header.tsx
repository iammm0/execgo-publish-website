import Image from "next/image";
import Link from "next/link";

import { branchHasDocIndex } from "@/lib/execgo-data";
import { hasPlaygroundDocIndex } from "@/lib/playground-data";
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
    ...(hasPlaygroundDocIndex()
      ? [{ label: "训练场" as const, href: "/docs/playground" }]
      : []),
    { label: "分支" as const, href: "/branches" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]">
      <div className="relative mx-auto flex min-h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
        <Link
          href="/"
          className="text-base font-semibold text-[var(--foreground)] hover:text-[var(--accent-strong)]"
        >
          execgo
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
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
              <Image
                src={GITHUB_ICON_SRC}
                alt=""
                width={16}
                height={16}
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
              <Image
                src={GITHUB_ICON_SRC}
                alt=""
                width={16}
                height={16}
                className="h-4 w-4 opacity-80 dark:invert"
              />
              <span>runtime</span>
            </a>
          </div>
        </nav>

        <details className="group md:hidden">
          <summary className="cursor-pointer list-none border border-[var(--border)] bg-[var(--panel)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)]">
            菜单
          </summary>
          <div className="absolute right-4 top-12 z-50 w-[calc(100vw-2rem)] max-w-sm border border-[var(--border)] bg-[var(--panel)] p-4 shadow-sm">
            <nav className="grid gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-2 py-2 text-sm text-[var(--muted)] hover:bg-[var(--background-soft)] hover:text-[var(--accent-strong)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 border-t border-[var(--border)] pt-3">
              <a
                href="https://github.com/iammm0/execgo"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-2 py-2 text-sm text-[var(--muted)] hover:bg-[var(--background-soft)] hover:text-[var(--accent-strong)]"
                aria-label="打开 execgo GitHub 仓库"
              >
                <Image
                  src={GITHUB_ICON_SRC}
                  alt=""
                  width={16}
                  height={16}
                  className="h-4 w-4 opacity-80 dark:invert"
                />
                <span>execgo</span>
              </a>
              <a
                href="https://github.com/iammm0/execgo-runtime"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-2 py-2 text-sm text-[var(--muted)] hover:bg-[var(--background-soft)] hover:text-[var(--accent-strong)]"
                aria-label="打开 execgo-runtime GitHub 仓库"
              >
                <Image
                  src={GITHUB_ICON_SRC}
                  alt=""
                  width={16}
                  height={16}
                  className="h-4 w-4 opacity-80 dark:invert"
                />
                <span>runtime</span>
              </a>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
