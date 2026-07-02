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
      <div className="space-y-4 xl:hidden">
        <div className="docs-panel px-4 py-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
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
                    ? "docs-branch-link docs-branch-link-active"
                    : "docs-branch-link"
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
              className="docs-panel"
            >
              <summary className="flex cursor-pointer list-none items-center gap-2 border-b border-[var(--border)] px-4 py-3 text-sm font-semibold text-[var(--foreground)]">
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
                      </div>
                    );
                  })}
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>

      <aside className="hidden w-[18rem] shrink-0 xl:block">
        <div className="docs-panel sticky top-20 max-h-[calc(100vh-6rem)] overflow-hidden">
          <div className="border-b border-[var(--border)] px-4 py-3">
            <p className="docs-eyebrow flex items-center gap-2">
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
                      ? "docs-branch-link docs-branch-link-active"
                      : "docs-branch-link"
                  }
                >
                  {branch.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="docs-sidebar-scroll max-h-[calc(100vh-13rem)] overflow-y-auto px-3 py-3">
            {filteredGroups.map((group) => (
              <section key={group.locale} className="mb-8 last:mb-0">
                <h2 className="docs-eyebrow mb-3 flex items-center gap-2 px-1">
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
