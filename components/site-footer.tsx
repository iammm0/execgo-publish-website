export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-white py-8">
      <div className="mx-auto max-w-4xl px-4 text-center text-sm text-[var(--muted)] sm:px-6">
        <span>© 2026 execgo</span>
        <span className="mx-2 text-[var(--border)]">·</span>
        <a
          href="https://github.com/iammm0/execgo-runtime"
          target="_blank"
          rel="noreferrer"
          className="hover:text-[var(--accent-strong)]"
        >
          execgo-runtime
        </a>
        <span className="mx-2 text-[var(--border)]">·</span>
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
