import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Menu, Server } from "lucide-react";

import { DismissibleMenu } from "@/components/dismissible-menu";
import { ExecgoDocsMenu } from "@/components/execgo-docs-menu";
import { GitHubMenu } from "@/components/github-menu";
import { ThemeToggle } from "@/components/theme-toggle";

const DESKTOP_NAV_ITEM_CLASS =
  "inline-flex h-8 cursor-pointer list-none items-center gap-1.5 text-sm leading-none text-[var(--muted)] hover:text-[var(--accent-strong)]";

export function SiteHeader() {
  const navItems: Array<{ label: string; href: string; Icon: LucideIcon }> = [
    { label: "Runtime 文档", href: "/docs/runtime", Icon: Server },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]">
      <div className="relative flex min-h-14 w-full items-center justify-between gap-4 px-4 py-2 sm:px-6">
        <Link
          href="/"
          className="text-base font-semibold text-[var(--foreground)] hover:text-[var(--accent-strong)]"
        >
          execgo
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          <ExecgoDocsMenu
            triggerClassName={DESKTOP_NAV_ITEM_CLASS}
            panelClassName="absolute left-0 top-full z-20 mt-3 grid w-80 gap-2 border border-[var(--border)] bg-[var(--panel)] p-3 shadow-sm"
            itemClassName="block border border-[var(--border)] bg-[var(--background-soft)] px-3 py-2 hover:border-[var(--accent-strong)] hover:bg-[var(--accent-soft)]"
            titleClassName="block text-sm font-medium text-[var(--foreground)]"
            descriptionClassName="mt-1 block text-xs leading-relaxed text-[var(--muted)]"
          />
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={DESKTOP_NAV_ITEM_CLASS}
            >
              <item.Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
          <GitHubMenu
            triggerClassName={DESKTOP_NAV_ITEM_CLASS}
            panelClassName="absolute right-0 top-full z-20 mt-3 grid w-80 gap-2 border border-[var(--border)] bg-[var(--panel)] p-3 shadow-sm"
            itemClassName="block border border-[var(--border)] bg-[var(--background-soft)] px-3 py-2 hover:border-[var(--accent-strong)] hover:bg-[var(--accent-soft)]"
            titleClassName="block text-sm font-medium text-[var(--foreground)]"
            descriptionClassName="mt-1 block text-xs leading-relaxed text-[var(--muted)]"
          />
          <ThemeToggle />
        </nav>

        <DismissibleMenu
          wrapperClassName="group md:hidden"
          triggerClassName="inline-flex h-9 cursor-pointer items-center gap-2 border border-[var(--border)] bg-[var(--panel)] px-3 text-sm font-medium leading-none text-[var(--foreground)]"
          panelClassName="absolute right-4 top-12 z-50 w-[calc(100vw-2rem)] max-w-sm border border-[var(--border)] bg-[var(--panel)] p-4 shadow-sm"
          triggerContent={
            <>
              <Menu className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="leading-none">菜单</span>
            </>
          }
        >
          <nav className="grid gap-1">
            <ExecgoDocsMenu
              wrapperClassName="block"
              triggerClassName="flex cursor-pointer list-none items-center gap-2 px-2 py-2 text-sm text-[var(--muted)] hover:bg-[var(--background-soft)] hover:text-[var(--accent-strong)]"
              panelClassName="mt-1 grid gap-2 px-2 pb-2"
              itemClassName="block border border-[var(--border)] bg-[var(--background-soft)] px-3 py-2 hover:border-[var(--accent-strong)] hover:bg-[var(--accent-soft)]"
              titleClassName="block text-sm font-medium text-[var(--foreground)]"
              descriptionClassName="mt-1 block text-xs leading-relaxed text-[var(--muted)]"
            />
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-2 py-2 text-sm text-[var(--muted)] hover:bg-[var(--background-soft)] hover:text-[var(--accent-strong)]"
              >
                <item.Icon className="h-4 w-4" aria-hidden="true" />
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
            <div className="mt-2 flex items-center justify-between gap-3 px-2 py-2">
              <ThemeToggle />
            </div>
          </div>
        </DismissibleMenu>
      </div>
    </header>
  );
}
