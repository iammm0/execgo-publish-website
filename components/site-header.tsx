import Link from "next/link";

const navItems = [
  { label: "发布概览", href: "/" },
  { label: "双分支", href: "/branches" },
  { label: "主线文档", href: "/docs/main" },
  { label: "集群预览", href: "/branches/feat-add-cluster" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(5,10,18,0.78)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#ff7a18_0%,#ffb347_48%,#3ecf8e_100%)] text-sm font-black tracking-[0.25em] text-slate-950 shadow-[0_12px_30px_rgba(255,122,24,0.28)]">
            EG
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-[0.28em] text-white/85">
              EXECGO
            </p>
            <p className="truncate text-xs text-slate-300">
              Agent execution kernel, runtime, and branch-by-branch release site
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-200 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200 sm:block">
            main + feat-add-cluster
          </div>
          <a
            href="https://github.com/iammm0/execgo"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/24 hover:bg-white/12"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
