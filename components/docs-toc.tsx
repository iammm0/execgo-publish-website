import type { MarkdownHeading } from "@/lib/execgo-data";

type DocsTocProps = {
  headings: MarkdownHeading[];
};

export function DocsToc({ headings }: DocsTocProps) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <>
      <div className="xl:hidden">
        <details className="overflow-hidden rounded-2xl border border-[#d8e6de] bg-white shadow-sm">
          <summary className="cursor-pointer list-none px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-bold text-[#123222]">本页内容</span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#789487]">
                {headings.length} headings
              </span>
            </div>
          </summary>
          <div className="border-t border-[#e3eee8] p-3">
            <ul className="space-y-1">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    className={`block rounded-lg px-3 py-2 text-sm transition hover:bg-[#f4f9f6] hover:text-[#007b46] ${
                      heading.depth === 3
                        ? "pl-6 text-[#6f887d]"
                        : "text-[#335646]"
                    }`}
                  >
                    {heading.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </details>
      </div>

      <aside className="hidden xl:block">
        <div className="sticky top-24 rounded-2xl border border-[#d8e6de] bg-white p-4 shadow-sm">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#789487]">
            本页目录
          </p>
          <ul className="space-y-1">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={`block rounded-lg px-3 py-2 text-sm transition hover:bg-[#f4f9f6] hover:text-[#007b46] ${
                    heading.depth === 3
                      ? "pl-6 text-[#6f887d]"
                      : "text-[#335646]"
                  }`}
                >
                  {heading.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
