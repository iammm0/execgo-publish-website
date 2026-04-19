import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#d8e6de] bg-white">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.6fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-sm font-bold tracking-[0.18em] text-[#123222]">
            EXECGO RELEASE SITE
          </p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[#5f7b6f]">
            这个站点直接围绕 execgo 仓库、双分支快照和静态文档内容构建，既展示
            `main` 的稳定发布能力，也展示 `feat-add-cluster` 的演进方向。
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-[#123222]">快速入口</p>
          <div className="mt-3 space-y-2 text-sm text-[#5f7b6f]">
            <div>
              <Link href="/" className="transition hover:text-[#009e5b]">
                发布首页
              </Link>
            </div>
            <div>
              <Link href="/branches" className="transition hover:text-[#009e5b]">
                双分支总览
              </Link>
            </div>
            <div>
              <Link href="/docs/main" className="transition hover:text-[#009e5b]">
                主线文档
              </Link>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-[#123222]">仓库链接</p>
          <div className="mt-3 space-y-2 text-sm text-[#5f7b6f]">
            <div>
              <a
                href="https://github.com/iammm0/execgo"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-[#009e5b]"
              >
                GitHub Repository
              </a>
            </div>
            <div>
              <a
                href="https://github.com/iammm0/execgo/tree/main"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-[#009e5b]"
              >
                main
              </a>
            </div>
            <div>
              <a
                href="https://github.com/iammm0/execgo/tree/feat-add-cluster"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-[#009e5b]"
              >
                feat-add-cluster
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
