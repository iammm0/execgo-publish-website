import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[linear-gradient(180deg,rgba(8,16,28,0.94)_0%,rgba(6,10,18,1)_100%)]">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.6fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold tracking-[0.28em] text-white/80">
            EXECGO RELEASE SITE
          </p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
            这个站点不是抽象宣传页，而是直接围绕 `execgo` 仓库、文档目录、
            Git 分支和关键模块生成的发布网站，重点把 `main` 与
            `feat-add-cluster` 两条线都讲清楚。
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">快速入口</p>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <div>
              <Link href="/" className="transition hover:text-white">
                发布概览
              </Link>
            </div>
            <div>
              <Link href="/branches" className="transition hover:text-white">
                双分支总览
              </Link>
            </div>
            <div>
              <Link href="/docs/main" className="transition hover:text-white">
                主线文档
              </Link>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">仓库链接</p>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <div>
              <a
                href="https://github.com/iammm0/execgo"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-white"
              >
                GitHub Repository
              </a>
            </div>
            <div>
              <a
                href="https://github.com/iammm0/execgo/tree/main"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-white"
              >
                `main` 分支
              </a>
            </div>
            <div>
              <a
                href="https://github.com/iammm0/execgo/tree/feat-add-cluster"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-white"
              >
                `feat-add-cluster` 分支
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
