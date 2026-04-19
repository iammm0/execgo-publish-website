import type { MarkdownHeading } from "@/lib/execgo-data";

type DocsTocProps = {
  headings: MarkdownHeading[];
};

export function DocsToc({ headings }: DocsTocProps) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 rounded-[1.6rem] border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          本页目录
        </p>
        <ul className="space-y-1">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`block rounded-xl px-3 py-2 text-sm transition hover:bg-white/[0.08] hover:text-white ${
                  heading.depth === 3
                    ? "pl-6 text-slate-400"
                    : "text-slate-200"
                }`}
              >
                {heading.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
