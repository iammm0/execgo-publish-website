import Link from "next/link";

const navItems = [
  { label: "首页", href: "/" },
  { label: "分支", href: "/branches" },
  { label: "文档", href: "/docs/main" },
  { label: "集群预览", href: "/branches/feat-add-cluster" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#d8e6de] bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#009e5b] text-sm font-black tracking-[0.18em] text-white shadow-sm">
            EG
          </span>
          <div>
            <p className="text-sm font-bold tracking-[0.18em] text-[#123222]">
              EXECGO
            </p>
            <p className="hidden text-xs text-[#6a8175] sm:block">
              Agent-first execution kernel
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-[#335646] transition hover:text-[#009e5b]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/docs/feat-add-cluster"
            className="hidden rounded-full border border-[#cfe4d8] bg-[#f4fbf7] px-3 py-1.5 text-xs font-semibold text-[#007b46] sm:inline-flex"
          >
            双分支文档
          </Link>
          <a
            href="https://github.com/iammm0/execgo"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#123222] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#009e5b]"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
