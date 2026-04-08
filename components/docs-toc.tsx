import type { DocSection } from "@/lib/docs";

type DocsTocProps = {
  sections: DocSection[];
};

export function DocsToc({ sections }: DocsTocProps) {
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm">
        <p className="mb-2 text-xs font-semibold tracking-wide text-slate-500">
          本页目录
        </p>
        <ul className="space-y-1">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="block rounded-md px-2 py-1.5 text-sm text-slate-600 transition-colors hover:bg-sky-50 hover:text-sky-900"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
