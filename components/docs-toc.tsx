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
        <details className="border border-[var(--border)] bg-white">
          <summary className="cursor-pointer list-none border-b border-[var(--border)] px-4 py-3 text-sm font-medium text-[var(--foreground)]">
            本页目录
          </summary>
          <div className="p-3">
            <ul className="space-y-0.5">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    className={`block py-1.5 pl-2 text-sm ${
                      heading.depth === 3
                        ? "pl-6 text-[var(--muted)]"
                        : "text-[var(--muted)]"
                    } hover:text-[var(--foreground)]`}
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
        <div className="sticky top-16 border border-[var(--border)] bg-white px-4 py-3">
          <p className="mb-3 text-xs text-[var(--muted)]">本页目录</p>
          <ul className="space-y-0.5">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={`block py-1.5 pl-2 text-sm ${
                    heading.depth === 3
                      ? "pl-6 text-[var(--muted)]"
                      : "text-[var(--muted)]"
                  } hover:text-[var(--foreground)]`}
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
