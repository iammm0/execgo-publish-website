export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-sky-100 bg-sky-50/60">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 text-sm text-slate-600 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="font-semibold text-slate-800">execgo</p>
          <p className="mt-1">
            面向执行编排场景的 Go 框架，强调可维护、可观测、可扩展。
          </p>
        </div>
        <div className="lg:text-right">
          <p>文档与官网持续迭代中，欢迎通过 GitHub Issues 提交建议。</p>
          <p className="mt-1 text-xs text-slate-500">
            Copyright © {new Date().getFullYear()} execgo contributors.
          </p>
        </div>
      </div>
    </footer>
  );
}
