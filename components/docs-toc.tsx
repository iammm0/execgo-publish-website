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
        <details className="border border-[var(--border)] bg-[var(--panel)]">
          <summary className="flex cursor-pointer list-none items-center gap-2 border-b border-[var(--border)] px-4 py-3 text-sm font-medium text-[var(--foreground)]">
            <ListTree className="h-4 w-4 shrink-0 text-[var(--accent-strong)]" aria-hidden="true" />
            <span className="min-w-0 break-words">本页目录</span>
          </summary>
          <div className="p-3">
            <ul className="space-y-0.5">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    className={`block break-words py-1.5 pl-2 text-sm ${
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
        <div className="sticky top-16 border border-[var(--border)] bg-[var(--panel)] px-4 py-3">
          <p className="mb-3 flex items-center gap-2 text-xs text-[var(--muted)]">
            <ListTree className="h-3.5 w-3.5 text-[var(--accent-strong)]" aria-hidden="true" />
            本页目录
          </p>
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
