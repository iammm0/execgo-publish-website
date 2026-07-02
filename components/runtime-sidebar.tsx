"use client";

import Link from "next/link";
import { Server } from "lucide-react";
import { usePathname } from "next/navigation";

import type { DocNavGroup } from "@/lib/execgo-data";

type RuntimeSidebarProps = {
  groups: DocNavGroup[];
};

function samePath(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  try {
    return decodeURIComponent(pathname) === href;
  } catch {
    return false;
  }
}

export function RuntimeSidebar({ groups }: RuntimeSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div className="xl:hidden">
        <details className="docs-panel">
          <summary className="flex cursor-pointer list-none items-center gap-2 border-b border-[var(--border)] px-4 py-3 text-sm font-semibold text-[var(--foreground)]">
            <Server className="h-4 w-4 shrink-0 text-[var(--accent-strong)]" aria-hidden="true" />
            <span className="min-w-0 break-words">Runtime docs</span>
          </summary>
          <div className="p-4">
            {groups.map((group) => (
              <div key={group.locale}>
                {group.sections.map((section) => (
                  <ul key={section.title} className="space-y-0.5">
                    {section.items.map((item) => {
                      const active = samePath(pathname, item.href);
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className={`docs-nav-link ${
                              active
                                ? "docs-nav-link-active"
                                : ""
                            }`}
                          >
                            {item.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ))}
              </div>
            ))}
          </div>
        </details>
      </div>

      <aside className="hidden w-[18rem] shrink-0 xl:block">
        <div className="docs-panel sticky top-20 max-h-[calc(100vh-6rem)] overflow-hidden">
          <p className="docs-eyebrow flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
            <Server className="h-3.5 w-3.5 text-[var(--accent-strong)]" aria-hidden="true" />
            execgo-runtime
          </p>
          <div className="docs-sidebar-scroll max-h-[calc(100vh-10rem)] overflow-y-auto px-3 py-3">
            {groups.map((group) => (
              <div key={group.locale}>
                {group.sections.map((section) => (
                  <ul key={section.title} className="space-y-0.5">
                    {section.items.map((item) => {
                      const active = samePath(pathname, item.href);
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className={`docs-nav-link ${
                              active
                                ? "docs-nav-link-active"
                                : ""
                            }`}
                          >
                            {item.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ))}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
