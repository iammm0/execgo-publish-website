import { Code2, Server } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer border-t border-[var(--border)] bg-[var(--panel)] py-8">
      <div className="flex w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 text-center text-sm text-[var(--muted)] sm:px-6">
        <span>© 2026 execgo</span>
        <span className="text-[var(--border)]">·</span>
        <a
          href="https://github.com/iammm0/execgo-runtime"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 hover:text-[var(--accent-strong)]"
        >
          <Server className="h-3.5 w-3.5" aria-hidden="true" />
          execgo-runtime
        </a>
        <span className="text-[var(--border)]">·</span>
        <a
          href="https://github.com/iammm0/execgo"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 hover:text-[var(--accent-strong)]"
        >
          <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
          execgo
        </a>
      </div>
    </footer>
  );
}
