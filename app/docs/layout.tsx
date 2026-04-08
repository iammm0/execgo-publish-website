import type { ReactNode } from "react";
import Link from "next/link";

import { DocsSidebar } from "@/components/docs-sidebar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDocGroups, getDocPath } from "@/lib/docs";

export default function DocsLayout({ children }: { children: ReactNode }) {
  const groups = getDocGroups();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <DocsSidebar groups={groups} />
        <main className="min-w-0 flex-1">
          <details className="mb-4 rounded-xl border border-sky-100 bg-white p-3 shadow-sm xl:hidden">
            <summary className="cursor-pointer text-sm font-semibold text-slate-800">
              浏览文档目录
            </summary>
            <div className="mt-3 space-y-4">
              {groups.map((group) => (
                <section key={group.category}>
                  <p className="mb-2 text-xs font-semibold tracking-wide text-slate-500">
                    {group.category}
                  </p>
                  <ul className="space-y-1">
                    {group.pages.map((page) => (
                      <li key={page.slug.join("/")}>
                        <Link
                          href={getDocPath(page.slug)}
                          className="text-sm text-slate-700 hover:text-sky-700"
                        >
                          {page.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </details>

          {children}
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
