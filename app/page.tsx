import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDocGroups } from "@/lib/docs";

export default function Home() {
  const docGroups = getDocGroups();
  const features = [
    {
      title: "任务编排引擎",
      description:
        "围绕执行链路进行建模，支持 DAG、重试策略、补偿动作与状态回放。",
    },
    {
      title: "多入口触发",
      description:
        "支持 CLI、HTTP、Webhook、事件总线，适配不同业务接入方式。",
    },
    {
      title: "插件化扩展",
      description:
        "通过插件接入对象存储、消息队列、告警系统，避免核心框架膨胀。",
    },
    {
      title: "可观测优先",
      description: "默认输出结构化日志、指标和链路追踪，问题排查路径清晰。",
    },
    {
      title: "配置驱动",
      description:
        "支持多环境分层配置，兼顾本地调试效率与生产环境稳定性。",
    },
    {
      title: "生产可用",
      description: "从单机到集群均可部署，适合内部基础设施平台演进。",
    },
  ];

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden border-b border-sky-100 bg-gradient-to-b from-sky-50 via-cyan-50 to-transparent">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(93,201,216,0.28),transparent_52%)]" />
          <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8">
            <p className="inline-flex rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-xs font-semibold tracking-wide text-sky-700">
              EXECGO FRAMEWORK
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              为执行编排而生的 Go 基础设施框架
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-600">
              execgo
              提供任务建模、Pipeline 编排、状态治理和可观测能力，帮助团队快速构建可靠的执行平台。
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/docs"
                className="inline-flex items-center rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-600"
              >
                阅读文档
              </Link>
              <a
                href="https://github.com/iammm0/execgo.git"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-sky-500 hover:text-sky-700"
              >
                GitHub 仓库
              </a>
            </div>

            <div className="mt-8 max-w-2xl rounded-2xl border border-sky-200/60 bg-slate-950 p-4 text-sm text-slate-100 shadow-sm">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Quick Install
              </p>
              <code className="font-mono text-sm">
                go install github.com/iammm0/execgo/cmd/execgo@latest
              </code>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              核心能力
            </h2>
            <p className="mt-2 text-slate-600">
              设计上偏向框架基础设施场景，兼顾开发效率与生产治理。
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-sky-100 bg-sky-50/30">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  文档体系
                </h2>
                <p className="mt-2 text-slate-600">
                  按照框架学习路径组织，从入门到生产部署逐步深入。
                </p>
              </div>
              <Link
                href="/docs"
                className="text-sm font-semibold text-sky-700 hover:text-sky-800"
              >
                浏览全部文档 →
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {docGroups.map((group) => (
                <div
                  key={group.category}
                  className="rounded-2xl border border-sky-100 bg-sky-50/80 p-5"
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {group.category}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {group.pages.length} 篇文档
                  </p>
                  <ul className="mt-3 space-y-2">
                    {group.pages.slice(0, 3).map((page) => (
                      <li key={page.slug.join("/")}>
                        <Link
                          href={`/docs/${page.slug.join("/")}`}
                          className="text-sm text-slate-700 hover:text-sky-700"
                        >
                          {page.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
          <article className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              典型接入流程
            </h2>
            <ol className="mt-4 space-y-3 text-slate-600">
              <li>1. 初始化项目并创建基础配置。</li>
              <li>2. 编写 Pipeline 和任务模板。</li>
              <li>3. 通过 Router 对外暴露触发入口。</li>
              <li>4. 接入日志、指标、Trace 做上线验收。</li>
              <li>5. 在生产环境配置重试、限流和告警策略。</li>
            </ol>
          </article>

          <aside className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50 p-6">
            <p className="text-sm font-semibold tracking-wide text-sky-800">
              当前版本
            </p>
            <p className="mt-1 text-3xl font-bold text-sky-900">v0.1.x</p>
            <p className="mt-3 text-sm text-sky-900/80">
              官方文档已覆盖从入门、核心机制到部署排障，适合作为内部平台标准化基础。
            </p>
            <Link
              href="/docs/quickstart"
              className="mt-5 inline-flex rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-600"
            >
              立即上手
            </Link>
          </aside>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
