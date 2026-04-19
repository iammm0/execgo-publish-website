import Link from "next/link";

import { getSiteData } from "@/lib/execgo-data";

function compactNumber(value: number): string {
  return new Intl.NumberFormat("zh-CN").format(value);
}

export default function Home() {
  const site = getSiteData();
  const [mainBranch, clusterBranch] = site.branches;
  const totalDocs =
    mainBranch.stats.zhDocs +
    mainBranch.stats.enDocs +
    clusterBranch.stats.zhDocs +
    clusterBranch.stats.enDocs;
  const totalTests =
    mainBranch.stats.unitTests +
    mainBranch.stats.moduleTests +
    mainBranch.stats.integrationTests +
    clusterBranch.stats.unitTests +
    clusterBranch.stats.moduleTests +
    clusterBranch.stats.integrationTests;

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(255,122,24,0.22),transparent_30%),radial-gradient(circle_at_76%_12%,rgba(62,207,142,0.16),transparent_34%),radial-gradient(circle_at_70%_78%,rgba(70,172,255,0.15),transparent_36%)]" />
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:pb-24 lg:pt-24">
          <div className="relative">
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/12 bg-white/[0.07] px-3 py-1 text-xs font-semibold text-amber-100 backdrop-blur">
              <span>ExecGo 发布站</span>
              <span className="h-1 w-1 rounded-full bg-amber-300" />
              <span>{site.releaseVersion}</span>
              <span className="h-1 w-1 rounded-full bg-amber-300" />
              <span>{site.releaseDate || "release line"}</span>
            </div>

            <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
              把 execgo 的两条分支都发布成
              <span className="block bg-[linear-gradient(90deg,#ffb347,#3ecf8e,#58a6ff)] bg-clip-text text-transparent">
                可阅读、可追溯、可落地的网站
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              本站直接围绕 `execgo` 目录下的 Go 代码、文档、测试、部署文件和
              Git 分支差异生成。`main` 作为稳定发布线，`feat-add-cluster`
              作为集群预览线，都会在页面里完整展开。
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/branches"
                className="rounded-full bg-amber-300 px-5 py-3 text-sm font-black text-slate-950 shadow-[0_16px_40px_rgba(255,179,71,0.28)] transition hover:-translate-y-0.5 hover:bg-amber-200"
              >
                查看双分支全景
              </Link>
              <Link
                href="/docs/main"
                className="rounded-full border border-white/14 bg-white/[0.07] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.12]"
              >
                阅读主线文档
              </Link>
              <Link
                href="/branches/feat-add-cluster"
                className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:-translate-y-0.5 hover:bg-emerald-300/16"
              >
                进入集群预览线
              </Link>
            </div>

            <div className="mt-10 overflow-hidden rounded-[1.6rem] border border-white/10 bg-slate-950/80 shadow-2xl shadow-black/30">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                <span className="ml-2 text-xs font-medium text-slate-500">
                  quick-start.sh
                </span>
              </div>
              <pre className="overflow-x-auto p-5 text-sm leading-7 text-slate-200">
                <code>{`git clone https://github.com/iammm0/execgo.git
cd execgo
go build -o execgo ./cmd/execgo
./execgo -addr :8080 -max-concurrency 10`}</code>
              </pre>
            </div>
          </div>

          <div className="relative grid content-start gap-4 lg:pt-8">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-5 shadow-2xl shadow-black/25 backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">
                当前代码证据
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  ["发布版本", site.releaseVersion],
                  ["分支数量", "2"],
                  ["文档文件", compactNumber(totalDocs)],
                  ["测试文件", compactNumber(totalTests)],
                  ["HTTP 路由", String(mainBranch.stats.httpRoutes)],
                  ["gRPC 方法", String(clusterBranch.stats.grpcMethods)],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-3xl border border-white/10 bg-slate-950/42 p-4"
                  >
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="mt-1 text-2xl font-black text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-5 backdrop-blur-xl">
              <p className="text-sm font-semibold text-emerald-100">
                两条分支的定位
              </p>
              <div className="mt-4 space-y-3">
                {site.branches.map((branch) => (
                  <Link
                    key={branch.id}
                    href={`/branches/${branch.id}`}
                    className="block rounded-3xl border border-white/10 bg-slate-950/35 p-4 transition hover:-translate-y-0.5 hover:bg-slate-950/55"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-white">{branch.branchName}</p>
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-slate-200">
                        {branch.channel}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {branch.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-eyebrow">Branch-by-branch</p>
            <h2 className="section-title">两个分支都完整展示</h2>
          </div>
          <Link
            href="/branches"
            className="text-sm font-semibold text-amber-200 transition hover:text-amber-100"
          >
            打开分支总览
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {site.branches.map((branch) => (
            <article key={branch.id} className="glass-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
                    {branch.badge}
                  </p>
                  <h3 className="mt-2 text-3xl font-black text-white">
                    {branch.branchName}
                  </h3>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 text-xs font-semibold text-slate-200">
                  {branch.rollout}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                {branch.description}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  ["Go 文件", branch.stats.goFiles],
                  ["中文文档", branch.stats.zhDocs],
                  ["测试", branch.stats.unitTests + branch.stats.moduleTests + branch.stats.integrationTests],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-3xl bg-white/[0.06] p-4">
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="mt-1 text-2xl font-black text-white">
                      {compactNumber(Number(value))}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {branch.focusAreas.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-slate-200"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                {branch.capabilities.slice(0, 3).map((capability) => (
                  <div
                    key={capability.title}
                    className="rounded-3xl border border-white/10 bg-slate-950/35 p-4"
                  >
                    <p className="font-semibold text-white">{capability.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">
                      {capability.description}
                    </p>
                  </div>
                ))}
              </div>

              {branch.diff ? (
                <div className="mt-5 rounded-3xl border border-amber-300/18 bg-amber-300/10 p-4">
                  <p className="text-sm font-semibold text-amber-100">
                    相对 `main` 的变化：{branch.diff.filesChanged} 个文件，
                    +{branch.diff.insertions} / -{branch.diff.deletions}
                  </p>
                </div>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/branches/${branch.id}`}
                  className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-amber-200"
                >
                  分支详情
                </Link>
                <Link
                  href={`/docs/${branch.id}`}
                  className="rounded-full border border-white/12 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                >
                  文档目录
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="glass-card overflow-hidden">
          <div className="border-b border-white/10 p-6">
            <p className="section-eyebrow">Compare</p>
            <h2 className="section-title">稳定线与集群线的核心差异</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.25em] text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-semibold">维度</th>
                  <th className="px-6 py-4 font-semibold">main</th>
                  <th className="px-6 py-4 font-semibold">feat-add-cluster</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {site.comparisonRows.map((row) => (
                  <tr key={row.aspect} className="align-top">
                    <td className="px-6 py-5 font-semibold text-white">
                      {row.aspect}
                    </td>
                    <td className="px-6 py-5 leading-7 text-slate-300">
                      {row.main}
                    </td>
                    <td className="px-6 py-5 leading-7 text-slate-300">
                      {row.cluster}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="glass-card p-6">
          <p className="section-eyebrow">Execution Surface</p>
          <h2 className="section-title">接口、执行器、部署面都展开</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            发布网站里不只说“支持执行编排”，还会把实际接口、执行器类别、OS
            工具、gRPC 方法、测试层级和部署资产都展示出来。
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              ["HTTP Routes", mainBranch.httpRoutes.map((route) => `${route.method} ${route.path}`).join(" · ")],
              ["Executor Categories", mainBranch.executorSurface.categories.join(" · ")],
              ["OS Tools", mainBranch.executorSurface.tools.join(" · ")],
              ["WorkerControl", clusterBranch.grpcMethods.filter((method) => method.service === "WorkerControl").map((method) => method.rpc).join(" · ")],
            ].map(([label, value]) => (
              <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {label}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-200">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[mainBranch, clusterBranch].map((branch) => (
            <div key={branch.id} className="glass-card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                {branch.branchName}
              </p>
              <h3 className="mt-2 text-xl font-black text-white">代码模块</h3>
              <div className="mt-4 space-y-3">
                {branch.moduleCards.slice(0, 5).map((module) => (
                  <div
                    key={module.path}
                    className="rounded-2xl border border-white/10 bg-slate-950/34 p-3"
                  >
                    <p className="font-semibold text-white">{module.title}</p>
                    <p className="mt-1 font-mono text-xs text-emerald-200">
                      {module.path}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {module.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
        <div className="glass-card p-6">
          <p className="section-eyebrow">Docs Atlas</p>
          <h2 className="section-title">仓库文档会原样进入站点</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            文档页不是手写摘要，而是直接读取 `execgo/docs` 下的 Markdown。
            左侧目录按分支、语言和目录分组，右侧会渲染正文和本页目录。
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {site.branches.map((branch) => (
              <div key={branch.id} className="rounded-3xl bg-white/[0.06] p-4">
                <p className="font-semibold text-white">{branch.branchName}</p>
                <div className="mt-3 space-y-2">
                  {branch.recommendedDocs.slice(0, 5).map((doc) => (
                    <Link
                      key={doc.href}
                      href={doc.href}
                      className="block rounded-2xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                    >
                      {doc.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <p className="section-eyebrow">Timeline</p>
          <h2 className="section-title">提交时间线</h2>
          <div className="mt-5 space-y-3">
            {site.timeline.slice(0, 7).map((commit) => (
              <div
                key={`${commit.shortHash}-${commit.subject}`}
                className="rounded-3xl border border-white/10 bg-slate-950/32 p-4"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono text-emerald-200">
                    {commit.shortHash}
                  </span>
                  <span>{commit.date}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  {commit.subject}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
