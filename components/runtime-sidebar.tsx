"use client";

import Link from "next/link";
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
        <details className="border border-[var(--border)] bg-[var(--panel)]" open>
          <summary className="cursor-pointer list-none border-b border-[var(--border)] px-4 py-3 text-sm font-medium text-[var(--foreground)]">
            Runtime 文档目录
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
                            className={`block py-1.5 pl-2 text-sm leading-snug ${
                              active
                                ? "border-l-2 border-[var(--accent-strong)] font-medium text-[var(--foreground)]"
                                : "border-l-2 border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
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

      <aside className="hidden w-[16rem] shrink-0 xl:block">
        <div className="sticky top-16 border border-[var(--border)] bg-[var(--panel)] px-4 py-3">
          <p className="mb-3 text-xs text-[var(--muted)]">execgo-runtime</p>
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
                          className={`block py-1.5 pl-2 text-sm leading-snug ${
                            active
                              ? "border-l-2 border-[var(--accent-strong)] font-medium text-[var(--foreground)]"
                              : "border-l-2 border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
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
      </aside>
    </>
  );
}
