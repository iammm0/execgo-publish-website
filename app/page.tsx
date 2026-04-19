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
      <section className="mx-auto w-full max-w-7xl px-4 pb-14 pt-14 sm:px-6 lg:px-8 lg:pb-18">
        <div className="grid gap-8 lg:grid-cols-[1.18fr_0.82fr] lg:items-start">
          <div className="rounded-[2rem] border border-[#d8e6de] bg-white px-6 py-8 shadow-sm sm:px-8 sm:py-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#cfe4d8] bg-[#f4fbf7] px-3 py-1 text-xs font-semibold text-[#007b46]">
              <span>ExecGo Release Site</span>
              <span className="h-1 w-1 rounded-full bg-[#009e5b]" />
              <span>{site.releaseVersion}</span>
              <span className="h-1 w-1 rounded-full bg-[#009e5b]" />
              <span>{site.releaseDate || "release line"}</span>
            </div>

            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-[#113222] sm:text-6xl">
              为 execgo 的两个分支
              <span className="block text-[#009e5b]">
                搭一套真正可发布的网站
              </span>
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#4f6d60]">
              参考 Gin 中文官网的思路，这里把重点放在文档优先、信息清晰、上手直接、
              导航明确上。`main` 和 `feat-add-cluster` 两条线都会被拆开讲清楚，
              同时文档内容来自项目内静态快照，而不是手写摘要。
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/docs/main"
                className="rounded-full bg-[#009e5b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#007b46]"
              >
                阅读主线文档
              </Link>
              <Link
                href="/branches"
                className="rounded-full border border-[#bfd9ca] bg-white px-5 py-3 text-sm font-semibold text-[#123222] transition hover:border-[#009e5b] hover:text-[#007b46]"
              >
                查看双分支对比
              </Link>
              <Link
                href="/docs/feat-add-cluster"
                className="rounded-full border border-[#cfe4d8] bg-[#f4fbf7] px-5 py-3 text-sm font-semibold text-[#007b46] transition hover:bg-[#e8f7ef]"
              >
                进入集群预览文档
              </Link>
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-[#d8e6de] bg-[#10221a] shadow-sm">
              <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                <span className="ml-2 text-xs font-medium text-[#b9dcca]">
                  quick-start
                </span>
              </div>
              <pre className="overflow-x-auto p-5 text-sm leading-7 text-[#ebfff3]">
                <code>{`git clone https://github.com/iammm0/execgo.git
cd execgo
go build -o execgo ./cmd/execgo
./execgo -addr :8080 -max-concurrency 10`}</code>
              </pre>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="glass-card p-5">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#009e5b]">
                当前快照
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  ["发布版本", site.releaseVersion],
                  ["分支数量", "2"],
                  ["文档文件", compactNumber(totalDocs)],
                  ["测试文件", compactNumber(totalTests)],
                  ["HTTP 路由", String(mainBranch.stats.httpRoutes)],
                  ["gRPC 方法", String(clusterBranch.stats.grpcMethods)],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-[#e1ebe5] bg-[#fbfefd] p-4">
                    <p className="text-xs text-[#7a9186]">{label}</p>
                    <p className="mt-1 text-2xl font-black text-[#123222]">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-5">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#009e5b]">
                风格目标
              </p>
              <div className="mt-4 space-y-3">
                {[
                  "像 Gin 官网一样，把“先看懂、再上手、再进文档”作为主流程。",
                  "首页保留产品概览，但避免厚重营销叙事，优先展示入口、分支差异和文档导航。",
                  "文档页采用左侧目录、右侧 TOC、中间正文的结构，让站点更像官方文档站而不是演示页。",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[#e1ebe5] bg-[#f4fbf7] px-4 py-3 text-sm leading-7 text-[#335646]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-eyebrow">Branches</p>
            <h2 className="section-title">两个分支，各自成页</h2>
          </div>
          <Link
            href="/branches"
            className="text-sm font-semibold text-[#007b46] transition hover:text-[#009e5b]"
          >
            打开双分支总览
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {site.branches.map((branch) => (
            <article key={branch.id} className="glass-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7a9186]">
                    {branch.badge}
                  </p>
                  <h3 className="mt-2 text-3xl font-black text-[#113222]">
                    {branch.branchName}
                  </h3>
                </div>
                <span className="rounded-full bg-[#f4fbf7] px-3 py-1 text-xs font-semibold text-[#007b46]">
                  {branch.rollout}
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-[#4f6d60]">
                {branch.summary}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  ["Go 文件", branch.stats.goFiles],
                  ["文档总数", branch.stats.zhDocs + branch.stats.enDocs],
                  [
                    "测试总数",
                    branch.stats.unitTests +
                      branch.stats.moduleTests +
                      branch.stats.integrationTests,
                  ],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-[#e1ebe5] bg-[#fbfefd] p-4">
                    <p className="text-xs text-[#7a9186]">{label}</p>
                    <p className="mt-1 text-2xl font-black text-[#123222]">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {branch.focusAreas.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#d8e6de] bg-[#f7faf8] px-3 py-1 text-xs text-[#335646]"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                {branch.capabilities.slice(0, 3).map((capability) => (
                  <div
                    key={capability.title}
                    className="rounded-2xl border border-[#e1ebe5] bg-[#fbfefd] p-4"
                  >
                    <p className="font-semibold text-[#123222]">{capability.title}</p>
                    <p className="mt-1 text-sm leading-6 text-[#5f7b6f]">
                      {capability.description}
                    </p>
                  </div>
                ))}
              </div>

              {branch.diff ? (
                <div className="mt-5 rounded-2xl border border-[#d8eadf] bg-[#f4fbf7] p-4 text-sm font-semibold text-[#007b46]">
                  相对 `main` 变更 {branch.diff.filesChanged} 个文件，+
                  {branch.diff.insertions} / -{branch.diff.deletions}
                </div>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/branches/${branch.id}`}
                  className="rounded-full bg-[#123222] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#009e5b]"
                >
                  分支详情
                </Link>
                <Link
                  href={`/docs/${branch.id}`}
                  className="rounded-full border border-[#bfd9ca] px-4 py-2 text-sm font-semibold text-[#123222] transition hover:border-[#009e5b] hover:text-[#007b46]"
                >
                  文档目录
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="glass-card overflow-hidden">
          <div className="border-b border-[#e1ebe5] p-6">
            <p className="section-eyebrow">Compare</p>
            <h2 className="section-title">稳定线和集群线的核心差异</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-[#f4f9f6] text-xs uppercase tracking-[0.2em] text-[#7a9186]">
                <tr>
                  <th className="px-6 py-4 font-semibold">维度</th>
                  <th className="px-6 py-4 font-semibold">main</th>
                  <th className="px-6 py-4 font-semibold">feat-add-cluster</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e1ebe5]">
                {site.comparisonRows.map((row) => (
                  <tr key={row.aspect} className="align-top">
                    <td className="px-6 py-5 font-semibold text-[#123222]">
                      {row.aspect}
                    </td>
                    <td className="px-6 py-5 leading-7 text-[#4f6d60]">
                      {row.main}
                    </td>
                    <td className="px-6 py-5 leading-7 text-[#4f6d60]">
                      {row.cluster}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <div className="glass-card p-6">
          <p className="section-eyebrow">Execution Surface</p>
          <h2 className="section-title">接口、执行器、部署资产都展开</h2>
          <p className="mt-4 text-sm leading-7 text-[#4f6d60]">
            这里不只说“支持执行编排”，而是把实际接口、执行器类别、OS 工具、
            gRPC 方法和测试层级都直接展示出来。
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              [
                "HTTP Routes",
                mainBranch.httpRoutes
                  .map((route) => `${route.method} ${route.path}`)
                  .join(" · "),
              ],
              [
                "Executor Categories",
                mainBranch.executorSurface.categories.join(" · "),
              ],
              ["OS Tools", mainBranch.executorSurface.tools.join(" · ")],
              [
                "WorkerControl",
                clusterBranch.grpcMethods
                  .filter((method) => method.service === "WorkerControl")
                  .map((method) => method.rpc)
                  .join(" · "),
              ],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-[#e1ebe5] bg-[#fbfefd] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a9186]">
                  {label}
                </p>
                <p className="mt-2 text-sm leading-7 text-[#335646]">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[mainBranch, clusterBranch].map((branch) => (
            <div key={branch.id} className="glass-card p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7a9186]">
                {branch.branchName}
              </p>
              <h3 className="mt-2 text-xl font-black text-[#123222]">模块地图</h3>
              <div className="mt-4 space-y-3">
                {branch.moduleCards.slice(0, 5).map((module) => (
                  <div
                    key={module.path}
                    className="rounded-2xl border border-[#e1ebe5] bg-[#fbfefd] p-4"
                  >
                    <p className="font-semibold text-[#123222]">{module.title}</p>
                    <p className="mt-1 font-mono text-xs text-[#007b46]">
                      {module.path}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#5f7b6f]">
                      {module.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.82fr] lg:px-8">
        <div className="glass-card p-6">
          <p className="section-eyebrow">Docs</p>
          <h2 className="section-title">两个分支的文档快照已内置进项目</h2>
          <p className="mt-4 text-sm leading-7 text-[#4f6d60]">
            文档页现在读取的是发布网站项目内的静态快照目录，不再依赖运行时直接去
            `execgo` 仓库抓取 Markdown。这样部署更稳定，也更接近官方文档站的结构。
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {site.branches.map((branch) => (
              <div key={branch.id} className="rounded-2xl border border-[#e1ebe5] bg-[#fbfefd] p-4">
                <p className="font-semibold text-[#123222]">{branch.branchName}</p>
                <div className="mt-3 space-y-2">
                  {branch.recommendedDocs.slice(0, 5).map((doc) => (
                    <Link
                      key={doc.href}
                      href={doc.href}
                      className="block rounded-lg px-3 py-2 text-sm text-[#4f6d60] transition hover:bg-[#f4fbf7] hover:text-[#007b46]"
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
          <h2 className="section-title">最近提交时间线</h2>
          <div className="mt-5 space-y-3">
            {site.timeline.slice(0, 7).map((commit) => (
              <div
                key={`${commit.shortHash}-${commit.subject}`}
                className="rounded-2xl border border-[#e1ebe5] bg-[#fbfefd] p-4"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#789487]">
                  <span className="font-mono text-[#007b46]">{commit.shortHash}</span>
                  <span>{commit.date}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#335646]">
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
