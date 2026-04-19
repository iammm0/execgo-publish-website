"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { BranchId, DocNavGroup } from "@/lib/execgo-data";

type DocsSidebarProps = {
  branchId: BranchId;
  groups: DocNavGroup[];
};

const branchLinks: Array<{ id: BranchId; label: string }> = [
  { id: "main", label: "main 稳定线" },
  { id: "feat-add-cluster", label: "feat-add-cluster 集群线" },
];

export function DocsSidebar({ branchId, groups }: DocsSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-80 shrink-0 xl:block">
      <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div className="border-b border-white/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200">
            文档分支
          </p>
          <div className="mt-3 grid gap-2">
            {branchLinks.map((branch) => (
              <Link
                key={branch.id}
                href={`/docs/${branch.id}`}
                className={`rounded-2xl px-3 py-2 text-sm transition ${
                  branchId === branch.id
                    ? "bg-amber-300 text-slate-950"
                    : "bg-white/[0.06] text-slate-200 hover:bg-white/[0.1]"
                }`}
              >
                {branch.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="max-h-[calc(100vh-17rem)] overflow-y-auto p-4">
          {groups.map((group) => (
            <section key={group.locale} className="mb-7 last:mb-0">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                {group.title}
              </h2>
              <div className="space-y-5">
                {group.sections.map((section) => (
                  <div key={`${group.locale}-${section.title}`}>
                    <p className="mb-2 text-xs font-semibold text-slate-300">
                      {section.title}
                    </p>
                    <ul className="space-y-1">
                      {section.items.map((item) => {
                        const active = pathname === item.href;

                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className={`block rounded-xl px-3 py-2 text-sm leading-5 transition ${
                                active
                                  ? "bg-emerald-300/18 text-emerald-100 ring-1 ring-emerald-300/30"
                                  : "text-slate-300 hover:bg-white/[0.07] hover:text-white"
                              }`}
                            >
                              {item.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </aside>
  );
}
