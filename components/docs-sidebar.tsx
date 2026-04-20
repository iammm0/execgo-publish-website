"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { BranchId, DocNavGroup, DocNavSection } from "@/lib/execgo-data";
import { useLocale } from "@/lib/locale-context";

type DocsSidebarProps = {
  branchId: BranchId;
  groups: DocNavGroup[];
};

const branchLinks: Array<{ id: BranchId; label: string }> = [
  { id: "main", label: "main" },
  { id: "feat-add-cluster", label: "feat-add-cluster" },
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
  const { locale } = useLocale();
  const filteredGroups = groups.filter((g) => g.locale === locale);

  return (
    <>
      <div className="space-y-6 xl:hidden">
        <div className="border border-[var(--border)] bg-white px-4 py-4">
          <p className="text-sm font-medium text-[var(--foreground)]">分支</p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            {branchLinks.map((branch) => (
              <Link
                key={branch.id}
                href={`/docs/execgo/${branch.id}`}
                className={
                  branchId === branch.id
                    ? "font-medium text-[var(--accent-strong)]"
                    : "text-[var(--muted)] hover:text-[var(--accent-strong)]"
                }
              >
                {branch.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredGroups.map((group, index) => (
            <details
              key={group.locale}
              open={index === 0}
              className="border border-[var(--border)] bg-white"
            >
              <summary className="cursor-pointer list-none border-b border-[var(--border)] px-4 py-3 text-sm font-medium text-[var(--foreground)]">
                {group.title}
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
              </div>
            </details>
          ))}
        </div>
      </div>

      <aside className="hidden w-[18.5rem] shrink-0 xl:block">
        <div className="sticky top-16 max-h-[calc(100vh-5rem)] overflow-hidden border border-[var(--border)] bg-white">
          <div className="border-b border-[var(--border)] px-4 py-3">
            <p className="text-xs text-[var(--muted)]">分支</p>
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
                <h2 className="mb-3 text-xs text-[var(--muted)]">{group.title}</h2>
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
