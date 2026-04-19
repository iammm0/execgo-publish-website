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

  return (
    <>
      <div className="space-y-4 xl:hidden">
        <div className="rounded-2xl border border-[#d8e6de] bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#009e5b]">
            文档导航
          </p>
          <p className="mt-2 text-sm leading-6 text-[#5f7b6f]">
            按分支、语言和章节快速切换。
          </p>
          <div className="mt-4 grid gap-2">
            {branchLinks.map((branch) => (
              <Link
                key={branch.id}
                href={`/docs/${branch.id}`}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  branchId === branch.id
                    ? "bg-[#009e5b] text-white"
                    : "bg-[#f4f9f6] text-[#335646] hover:bg-[#e8f7ef] hover:text-[#007b46]"
                }`}
              >
                {branch.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {groups.map((group, index) => (
            <details
              key={group.locale}
              open={index === 0}
              className="overflow-hidden rounded-2xl border border-[#d8e6de] bg-white shadow-sm"
            >
              <summary className="cursor-pointer list-none px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-[#123222]">{group.title}</span>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#789487]">
                    {group.sections.length} sections
                  </span>
                </div>
              </summary>
              <div className="border-t border-[#e3eee8] p-4">
                <div className="space-y-5">
                  {group.sections.map((section) => (
                    <div key={`${group.locale}-${section.title}`}>
                      <p className="mb-2 text-xs font-bold text-[#335646]">
                        {section.title}
                      </p>
                      <ul className="space-y-1">
                        {section.items.map((item) => {
                          const active = samePath(pathname, item.href);

                          return (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                className={`block rounded-lg px-3 py-2 text-sm leading-5 transition ${
                                  active
                                    ? "bg-[#e8f7ef] text-[#007b46]"
                                    : "text-[#5f7b6f] hover:bg-[#f4f9f6] hover:text-[#123222]"
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
              </div>
            </details>
          ))}
        </div>
      </div>

      <aside className="hidden w-[18.5rem] shrink-0 xl:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-hidden rounded-2xl border border-[#d8e6de] bg-white shadow-sm">
          <div className="border-b border-[#e3eee8] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#009e5b]">
              文档分支
            </p>
            <div className="mt-3 grid gap-2">
              {branchLinks.map((branch) => (
                <Link
                  key={branch.id}
                  href={`/docs/${branch.id}`}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    branchId === branch.id
                      ? "bg-[#009e5b] text-white"
                      : "bg-[#f4f9f6] text-[#335646] hover:bg-[#e8f7ef] hover:text-[#007b46]"
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
                <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#789487]">
                  {group.title}
                </h2>
                <div className="space-y-5">
                  {group.sections.map((section) => (
                    <div key={`${group.locale}-${section.title}`}>
                      <p className="mb-2 text-xs font-bold text-[#335646]">
                        {section.title}
                      </p>
                      <ul className="space-y-1">
                        {section.items.map((item) => {
                          const active = samePath(pathname, item.href);

                          return (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                className={`block rounded-lg px-3 py-2 text-sm leading-5 transition ${
                                  active
                                    ? "bg-[#e8f7ef] text-[#007b46]"
                                    : "text-[#5f7b6f] hover:bg-[#f4f9f6] hover:text-[#123222]"
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
    </>
  );
}
