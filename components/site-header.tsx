import Link from "next/link";

const navItems = [
  { label: "文档", href: "/docs" },
  { label: "快速开始", href: "/docs/quickstart" },
  { label: "部署指南", href: "/docs/deployment" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-sky-100/90 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 text-sm font-bold text-white">
            EG
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">execgo</p>
            <p className="text-[11px] text-slate-500">Execution Orchestration</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-700 transition-colors hover:text-sky-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          href="https://github.com/iammm0/execgo.git"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-sky-500 hover:text-sky-700"
        >
          GitHub
        </a>
      </div>
    </header>
  );
}
