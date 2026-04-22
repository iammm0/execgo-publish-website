import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-white py-8">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 text-center text-sm text-[var(--muted)] sm:px-6">
        <span>© 2026 execgo</span>
        <span className="text-[var(--border)]">·</span>
        <Link
          href="/docs/playground"
          className="hover:text-[var(--accent-strong)]"
        >
          训练场
        </Link>
        <span className="text-[var(--border)]">·</span>
        <a
          href="https://github.com/iammm0/execgo-runtime"
          target="_blank"
          rel="noreferrer"
          className="hover:text-[var(--accent-strong)]"
        >
          execgo-runtime
        </a>
        <span className="text-[var(--border)]">·</span>
        <a
          href="https://github.com/iammm0/execgo"
          target="_blank"
          rel="noreferrer"
          className="hover:text-[var(--accent-strong)]"
        >
          execgo
        </a>
      </div>
    </footer>
  );
}
