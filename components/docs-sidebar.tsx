"use client";

import Link from "next/link";
import { BookOpen, GitBranch } from "lucide-react";
import { usePathname } from "next/navigation";

import type { BranchId, DocNavGroup, DocNavSection } from "@/lib/execgo-data";

type DocsSidebarProps = {
  branchId: BranchId;
  groups: DocNavGroup[];
};

const branchLinks: Array<{ id: BranchId; label: string }> = [
  { id: "release-agent-adapter-runtime", label: "release/agent-adapter-runtime" },
  { id: "preview-distributed-runtime", label: "preview/distributed-runtime" },
];

/** 仅一条链接且与分组标题同名时，不再重复显示分组小标题。 */
function isSoleSameTitleAsSection(section: DocNavSection): boolean {
  return (
    section.items.length === 1 && section.items[0].title === section.title
  );
}

function samePath(pathname: string, href: string): boolean {
  if (pathname === href) {
    return true;
  }

  try {
    return decodeURIComponent(pathname) === href;
  } catch {
    return false;
  }
}

export function DocsSidebar({ branchId, groups }: DocsSidebarProps) {
  const pathname = usePathname();
  const filteredGroups = groups.filter((group) => group.locale === "en");

  return (
    <>
      <div className="space-y-6 xl:hidden">
        <div className="border border-[var(--border)] bg-[var(--panel)] px-4 py-4">
          <p className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
            <GitBranch className="h-4 w-4 text-[var(--accent-strong)]" aria-hidden="true" />
            Branches
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            {branchLinks.map((branch) => (
              <Link
                key={branch.id}
                href={`/docs/execgo/${branch.id}`}
                className={
                  branchId === branch.id
                    ? "break-words font-medium text-[var(--accent-strong)]"
                    : "break-words text-[var(--muted)] hover:text-[var(--accent-strong)]"
                }
              >
                {branch.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredGroups.map((group) => (
            <details
              key={group.locale}
              className="border border-[var(--border)] bg-[var(--panel)]"
            >
              <summary className="flex cursor-pointer list-none items-center gap-2 border-b border-[var(--border)] px-4 py-3 text-sm font-medium text-[var(--foreground)]">
                <BookOpen className="h-4 w-4 shrink-0 text-[var(--accent-strong)]" aria-hidden="true" />
                <span className="min-w-0 break-words">{group.title}</span>
              </summary>
              <div className="p-4">
                <div className="space-y-5">
                  {group.sections.map((section) => {
                    const hideSectionCaption = isSoleSameTitleAsSection(section);
                    return (
                      <div key={`${group.locale}-${section.title}`}>
                        {hideSectionCaption ? null : (
                          <p className="mb-2 text-xs text-[var(--muted)]">{section.title}</p>
                        )}
                        <ul className="space-y-0.5">
                          {section.items.map((item) => {
                            const active = samePath(pathname, item.href);

                            return (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  className={`block py-1.5 pl-2 text-sm leading-snug ${
                                    active
                                      ? "break-words border-l-2 border-[var(--accent-strong)] font-medium text-[var(--foreground)]"
                                      : "break-words border-l-2 border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
                                  }`}
                                >
                                  {item.title}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>

      <aside className="hidden w-[17rem] shrink-0 xl:block">
        <div className="sticky top-16 max-h-[calc(100vh-5rem)] overflow-hidden border border-[var(--border)] bg-[var(--panel)]">
          <div className="border-b border-[var(--border)] px-4 py-3">
            <p className="flex items-center gap-2 text-xs text-[var(--muted)]">
              <GitBranch className="h-3.5 w-3.5 text-[var(--accent-strong)]" aria-hidden="true" />
              Branches
            </p>
            <div className="mt-2 flex flex-col gap-1 text-sm">
              {branchLinks.map((branch) => (
                <Link
                  key={branch.id}
                  href={`/docs/execgo/${branch.id}`}
                  className={
                    branchId === branch.id
                      ? "font-medium text-[var(--accent-strong)]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }
                >
                  {branch.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-4 py-3">
            {filteredGroups.map((group) => (
              <section key={group.locale} className="mb-8 last:mb-0">
                <h2 className="mb-3 flex items-center gap-2 text-xs text-[var(--muted)]">
                  <BookOpen className="h-3.5 w-3.5 text-[var(--accent-strong)]" aria-hidden="true" />
                  {group.title}
                </h2>
                <div className="space-y-5">
                  {group.sections.map((section) => {
                    const hideSectionCaption = isSoleSameTitleAsSection(section);
                    return (
                      <div key={`${group.locale}-${section.title}`}>
                        {hideSectionCaption ? null : (
                          <p className="mb-2 text-xs text-[var(--muted)]">{section.title}</p>
                        )}
                        <ul className="space-y-0.5">
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
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
