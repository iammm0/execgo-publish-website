"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { DocGroup } from "@/lib/docs";
import { getDocPath } from "@/lib/docs";

type DocsSidebarProps = {
  groups: DocGroup[];
};

export function DocsSidebar({ groups }: DocsSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 xl:block">
      <div className="sticky top-24 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm">
        {groups.map((group) => (
          <section key={group.category} className="mb-5 last:mb-0">
            <h2 className="mb-2 text-xs font-semibold tracking-wide text-slate-500">
              {group.category}
            </h2>
            <ul className="space-y-1">
              {group.pages.map((page) => {
                const href = getDocPath(page.slug);
                const isDefault = page.slug.join("/") === "introduction";
                const active =
                  pathname === href || (pathname === "/docs" && isDefault);

                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                        active
                          ? "bg-sky-50 text-sky-800"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      {page.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </aside>
  );
}
