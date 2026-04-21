import Link from "next/link";
import Image from "next/image";

import { branchHasDocIndex } from "@/lib/execgo-data";
import { hasRuntimeDocIndex } from "@/lib/runtime-data";

const FEATURES: { title: string; body: string }[] = [
  {
    title: "Task DSL",
    body: "任务契约包含 id、type、params、依赖、重试与超时等字段，便于上层以结构化方式描述工作。",
  },
  {
    title: "DAG 编排",
    body: "按依赖图调度任务，并对环进行检测，保证执行顺序与数据流一致。",
  },
  {
    title: "并发执行",
    body: "基于 goroutine 与 channel 的并发模型，可通过信号量等方式限制最大并发。",
  },
  {
    title: "可插拔执行器",
    body: "执行器可按类型扩展；控制面可组合多种工具与运行方式，与具体业务解耦。",
  },
  {
    title: "超时与重试",
    body: "支持基于 context 的超时控制，以及带退避策略的重试，减少瞬时故障影响。",
  },
  {
    title: "状态持久化",
    body: "执行状态可落盘或接入可选存储后端，便于进程重启后恢复与审计。",
  },
  {
    title: "可观测性",
    body: "结构化日志、请求追踪与指标端点，便于在生产环境中排查问题。",
  },
  {
    title: "优雅关闭",
    body: "在收到退出信号时依次停止接入、排空队列并持久化状态，避免任务丢失。",
  },
  {
    title: "HTTP API 与 CLI",
    body: "数据面运行时对外提供 HTTP 与命令行接口，便于本地调试与自动化集成。",
  },
];

const LAYERS: { title: string; body: string }[] = [
  {
    title: "编排层（Orchestration）",
    body: "连接 LLM，负责规划与决策循环（LangGraph / CrewAI / LangChain 等）。",
  },
  {
    title: "执行层（Execution / Kernel）",
    body: "`execgo` 负责把决策翻译为任务契约与 TaskGraph，提供调度与治理能力。",
  },
  {
    title: "运行时层（Runtime）",
    body: "`execgo-runtime` 负责真实执行：进程与资源隔离、持久化、队列与可观测。",
  },
];

export default function Home() {
  const showExecgoDocs = branchHasDocIndex("main");
  const showRuntimeDocs = hasRuntimeDocIndex();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <section>
        <div className="flex flex-wrap items-center gap-4">
          <Image
            src="/brand/execgo-logo-192.png"
            alt="execgo logo"
            width={72}
            height={72}
            priority
            className="h-14 w-14 sm:h-[72px] sm:w-[72px]"
          />
          <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
            execgo
          </h1>
        </div>
        <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
          面向 AI Agent 的任务执行内核与运行时。
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          {showExecgoDocs ? (
            <Link
              href="/docs/execgo/main"
              className="inline-flex items-center justify-center border border-[var(--accent-strong)] bg-[var(--accent-strong)] px-5 py-2 text-sm font-medium text-white hover:bg-[var(--accent)]"
            >
              execgo 文档
            </Link>
          ) : null}
          {showRuntimeDocs ? (
            <Link
              href="/docs/runtime"
              className="inline-flex items-center justify-center border border-[var(--border)] bg-[var(--panel)] px-5 py-2 text-sm font-medium text-[var(--foreground)] hover:border-[var(--muted)]"
            >
              runtime 文档
            </Link>
          ) : null}
          <a
            href="https://github.com/iammm0/execgo"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center border border-[var(--border)] bg-[var(--panel)] px-5 py-2 text-sm font-medium text-[var(--foreground)] hover:border-[var(--muted)]"
          >
            GitHub
          </a>
        </div>
      </section>

      <section className="mt-16 border-t border-[var(--border)] pt-12">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">
          什么是 execgo？
        </h2>
        <div className="mt-6 space-y-4 text-[var(--muted)]">
          <p>
            <a
              href="https://github.com/iammm0/execgo"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[var(--accent-strong)] underline decoration-[rgba(47,128,237,0.35)] underline-offset-2 hover:text-[var(--accent)]"
            >
              execgo
            </a>
            是控制面：负责任务编排、执行策略与对外 API，把上层决策映射为可执行步骤。
          </p>
          <p>
            <a
              href="https://github.com/iammm0/execgo-runtime"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[var(--accent-strong)] underline decoration-[rgba(47,128,237,0.35)] underline-offset-2 hover:text-[var(--accent)]"
            >
              execgo-runtime
            </a>
            是数据面运行时：在单进程内提供 HTTP 与 CLI，负责任务的提交、调度、执行与持久化。
          </p>
        </div>
      </section>

      <section className="mt-16 border-t border-[var(--border)] pt-12">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">
          面向的技术场景
        </h2>
        <p className="mt-4 max-w-2xl text-[var(--muted)]">
          ExecGo 系列用于打通“上层 Agent 编排”与“底层真实执行”的工程化断层：上层专注决策与工作流，底层交给内核与运行时稳定落地。
        </p>
        <ul className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-3">
          {LAYERS.map((item) => (
            <li key={item.title}>
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 border-t border-[var(--border)] pt-12">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">能力概览</h2>
        <ul className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-3">
          {FEATURES.map((item) => (
            <li key={item.title}>
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
