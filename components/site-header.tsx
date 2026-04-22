import Link from "next/link";

import { DismissibleMenu } from "@/components/dismissible-menu";
import { ExecgoDocsMenu } from "@/components/execgo-docs-menu";
import { GitHubMenu } from "@/components/github-menu";
import { hasPlaygroundDocIndex } from "@/lib/playground-data";
import { hasRuntimeDocIndex } from "@/lib/runtime-data";

export function SiteHeader() {
  const navItems = [
    ...(hasRuntimeDocIndex()
      ? [{ label: "runtime 文档" as const, href: "/docs/runtime" }]
      : []),
    ...(hasPlaygroundDocIndex()
      ? [{ label: "训练场" as const, href: "/docs/playground" }]
      : []),
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
          <ExecgoDocsMenu
            triggerClassName="inline-flex cursor-pointer list-none items-center text-sm text-[var(--muted)] hover:text-[var(--accent-strong)]"
            panelClassName="absolute left-0 top-full z-20 mt-3 grid w-80 gap-2 border border-[var(--border)] bg-[var(--panel)] p-3 shadow-sm"
            itemClassName="block border border-[var(--border)] bg-[var(--background-soft)] px-3 py-2 hover:border-[var(--accent-strong)] hover:bg-[var(--accent-soft)]"
            titleClassName="block text-sm font-medium text-[var(--foreground)]"
            descriptionClassName="mt-1 block text-xs leading-relaxed text-[var(--muted)]"
          />
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[var(--muted)] hover:text-[var(--accent-strong)]"
            >
              {item.label}
            </Link>
          ))}
          <GitHubMenu
            triggerClassName="inline-flex cursor-pointer list-none items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--accent-strong)]"
            panelClassName="absolute right-0 top-full z-20 mt-3 grid w-80 gap-2 border border-[var(--border)] bg-[var(--panel)] p-3 shadow-sm"
            itemClassName="block border border-[var(--border)] bg-[var(--background-soft)] px-3 py-2 hover:border-[var(--accent-strong)] hover:bg-[var(--accent-soft)]"
            titleClassName="block text-sm font-medium text-[var(--foreground)]"
            descriptionClassName="mt-1 block text-xs leading-relaxed text-[var(--muted)]"
          />
        </nav>

        <DismissibleMenu
          wrapperClassName="group md:hidden"
          triggerClassName="cursor-pointer border border-[var(--border)] bg-[var(--panel)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)]"
          panelClassName="absolute right-4 top-12 z-50 w-[calc(100vw-2rem)] max-w-sm border border-[var(--border)] bg-[var(--panel)] p-4 shadow-sm"
          triggerContent="菜单"
        >
          <nav className="grid gap-1">
            <ExecgoDocsMenu
              wrapperClassName="block"
              triggerClassName="block cursor-pointer list-none px-2 py-2 text-sm text-[var(--muted)] hover:bg-[var(--background-soft)] hover:text-[var(--accent-strong)]"
              panelClassName="mt-1 grid gap-2 px-2 pb-2"
              itemClassName="block border border-[var(--border)] bg-[var(--background-soft)] px-3 py-2 hover:border-[var(--accent-strong)] hover:bg-[var(--accent-soft)]"
              titleClassName="block text-sm font-medium text-[var(--foreground)]"
              descriptionClassName="mt-1 block text-xs leading-relaxed text-[var(--muted)]"
            />
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
            <GitHubMenu
              wrapperClassName="block"
              triggerClassName="flex cursor-pointer list-none items-center gap-2 px-2 py-2 text-sm text-[var(--muted)] hover:bg-[var(--background-soft)] hover:text-[var(--accent-strong)]"
              panelClassName="mt-1 grid gap-2 px-2 pb-2"
              itemClassName="block border border-[var(--border)] bg-[var(--background-soft)] px-3 py-2 hover:border-[var(--accent-strong)] hover:bg-[var(--accent-soft)]"
              titleClassName="block text-sm font-medium text-[var(--foreground)]"
              descriptionClassName="mt-1 block text-xs leading-relaxed text-[var(--muted)]"
            />
          </div>
        </DismissibleMenu>
      </div>
    </header>
  );
}
