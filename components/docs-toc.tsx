import type { MarkdownHeading } from "@/lib/execgo-data";
import { ListTree } from "lucide-react";

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
        <details className="docs-panel">
          <summary className="flex cursor-pointer list-none items-center gap-2 border-b border-[var(--border)] px-4 py-3 text-sm font-semibold text-[var(--foreground)]">
            <ListTree className="h-4 w-4 shrink-0 text-[var(--accent-strong)]" aria-hidden="true" />
            <span className="min-w-0 break-words">On this page</span>
          </summary>
          <div className="p-3">
            <ul className="space-y-0.5">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    className={`docs-toc-link ${
                      heading.depth === 3
                        ? "docs-toc-link-nested"
                        : ""
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
        <div className="docs-panel sticky top-20 px-3 py-3">
          <p className="docs-eyebrow mb-3 flex items-center gap-2 px-1">
            <ListTree className="h-3.5 w-3.5 text-[var(--accent-strong)]" aria-hidden="true" />
            On this page
          </p>
          <ul className="space-y-0.5">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={`docs-toc-link ${
                    heading.depth === 3
                      ? "docs-toc-link-nested"
                      : ""
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
