import Link from "next/link";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Boxes,
  Ban,
  Database,
  Layers,
  Plug,
  Power,
  Route,
  Server,
  Terminal,
  Timer,
  Workflow,
} from "lucide-react";

import { ExecgoDocsMenu } from "@/components/execgo-docs-menu";
import { GitHubMenu } from "@/components/github-menu";
import { hasRuntimeDocIndex } from "@/lib/runtime-data";

const FEATURES: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Task DSL",
    body: "任务契约包含 id、type、params、依赖、重试与超时等字段，便于上层以结构化方式描述工作。",
    Icon: Terminal,
  },
  {
    title: "DAG 编排",
    body: "按依赖图调度任务，并对环进行检测，保证执行顺序与数据流一致。",
    Icon: Route,
  },
  {
    title: "并发执行",
    body: "基于 goroutine 与 channel 的并发模型，可通过信号量等方式限制最大并发。",
    Icon: Workflow,
  },
  {
    title: "可插拔执行器",
    body: "执行器可按类型扩展；控制面可组合多种工具与运行方式，与具体业务解耦。",
    Icon: Plug,
  },
  {
    title: "超时与重试",
    body: "支持基于 context 的超时控制，以及带退避策略的重试，减少瞬时故障影响。",
    Icon: Timer,
  },
  {
    title: "可取消执行",
    body: "`POST /tasks/{id}/cancel` 会让任务进入 cancelling，再由本地 context 或 runtime handle 收敛到 cancelled。",
    Icon: Ban,
  },
  {
    title: "状态持久化",
    body: "执行状态可落盘或接入可选存储后端，便于进程重启后恢复与审计。",
    Icon: Database,
  },
  {
    title: "可观测性",
    body: "结构化日志、请求追踪与指标端点，便于在生产环境中排查问题。",
    Icon: Activity,
  },
  {
    title: "优雅关闭",
    body: "在收到退出信号时依次停止接入、排空队列并持久化状态，避免任务丢失。",
    Icon: Power,
  },
  {
    title: "HTTP API 与 CLI",
    body: "数据面运行时对外提供 HTTP 与命令行接口，便于本地调试与自动化集成。",
    Icon: Server,
  },
];

const LAYERS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "编排层（Orchestration）",
    body: "连接 LLM，负责规划与决策循环（LangGraph / CrewAI / LangChain 等）。",
    Icon: Layers,
  },
  {
    title: "执行层（Execution / Kernel）",
    body: "`execgo` 负责把决策翻译为任务契约与 TaskGraph，提供调度与治理能力。",
    Icon: Boxes,
  },
  {
    title: "运行时层（Runtime）",
    body: "`execgo-runtime` 负责真实执行：进程与资源隔离、持久化、队列与可观测。",
    Icon: Server,
  },
];

const AGENT_EXPERIENCES: { name: string; signal: string; body: string; Icon: LucideIcon }[] = [
  {
    name: "Codex",
    signal: "最适合把临时操作变成可审计任务",
    body: "Codex 读取工具 manifest 后提交结构化 action；本地 schema validation 先挡坏参数，长任务可用 execgocli cancel --wait 收敛到 cancelled。",
    Icon: Terminal,
  },
  {
    name: "Claude Code",
    signal: "适合作为团队代码库里的安全动作层",
    body: "把 shell、文件操作和 runtime 调用交给 ExecGo 后，任务 id、依赖、状态和错误语义能稳定保留；cancel 与 delete 分离，避免误删审计记录。",
    Icon: Workflow,
  },
  {
    name: "Hermes Agent",
    signal: "更像消息驱动 agent 的动作内核",
    body: "上层只表达动作意图，ExecGo 负责调度、超时、重试、取消和 runtime 分发；artifact 与事件可以继续作为后续推理或回放证据。",
    Icon: Route,
  },
  {
    name: "OpenClaw",
    signal: "适合开放工具生态的能力发现",
    body: "`/adapters/tools` 暴露 machine-readable schema，agent 可以先发现能力再生成调用；运行中任务可经历 running、cancelling、cancelled 的清晰状态链。",
    Icon: Plug,
  },
];

export default function Home() {
  const showRuntimeDocs = hasRuntimeDocIndex();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
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
        <p className="mt-4 max-w-2xl text-base text-[var(--muted)] sm:text-lg">
          面向 AI Agent 的任务执行内核与运行时。
        </p>
        <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap sm:gap-4">
          <ExecgoDocsMenu
            triggerClassName="inline-flex cursor-pointer list-none items-center justify-center gap-2 border border-[var(--button-primary)] bg-[var(--button-primary)] px-5 py-2 text-sm font-medium text-white hover:border-[var(--button-primary-hover)] hover:bg-[var(--button-primary-hover)]"
            panelClassName="mt-2 grid gap-2 border border-[var(--border)] bg-[var(--panel)] p-3 shadow-sm sm:absolute sm:left-0 sm:top-full sm:z-20 sm:w-80"
            itemClassName="block border border-[var(--border)] bg-[var(--background-soft)] px-3 py-2 hover:border-[var(--accent-strong)] hover:bg-[var(--accent-soft)]"
            titleClassName="block text-sm font-medium text-[var(--foreground)]"
            descriptionClassName="mt-1 block text-xs leading-relaxed text-[var(--muted)]"
          />
          {showRuntimeDocs ? (
            <Link
              href="/docs/runtime"
              className="inline-flex items-center justify-center gap-2 border border-[var(--border)] bg-[var(--panel)] px-5 py-2 text-sm font-medium text-[var(--foreground)] hover:border-[var(--muted)]"
            >
              <Server className="h-4 w-4 text-[var(--accent-strong)]" aria-hidden="true" />
              runtime 文档
            </Link>
          ) : null}
          <GitHubMenu
            triggerClassName="inline-flex cursor-pointer list-none items-center justify-center gap-2 border border-[var(--border)] bg-[var(--panel)] px-5 py-2 text-sm font-medium text-[var(--foreground)] hover:border-[var(--muted)]"
            panelClassName="mt-2 grid gap-2 border border-[var(--border)] bg-[var(--panel)] p-3 shadow-sm sm:absolute sm:left-0 sm:top-full sm:z-20 sm:w-72"
            itemClassName="block border border-[var(--border)] bg-[var(--background-soft)] px-3 py-2 text-sm hover:border-[var(--accent-strong)] hover:bg-[var(--accent-soft)]"
            titleClassName="block font-medium text-[var(--foreground)]"
            descriptionClassName="mt-0.5 block text-xs text-[var(--muted)]"
          />
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
        <p className="section-eyebrow">Agent 接入体验</p>
        <h2 className="mt-2 text-2xl font-bold text-[var(--foreground)]">
          把真实执行交给 ExecGo
        </h2>
        <p className="mt-4 max-w-2xl text-[var(--muted)]">
          ExecGo 更像动作执行内核，而不是完整 agent 框架。Codex、Claude Code、Hermes Agent、OpenClaw
          这类上层 agent 可以保留自己的规划循环，把真实工具调用交给 ExecGo 做结构化落地。
        </p>
        <ul className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2">
          {AGENT_EXPERIENCES.map((item) => (
            <li key={item.name}>
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center border border-[var(--border)] bg-[var(--panel)] text-[var(--accent-strong)]">
                <item.Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                {item.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-[var(--accent-strong)]">
                {item.signal}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-10 grid gap-4 border border-[var(--border)] bg-[var(--panel)] p-5 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">running</p>
            <p className="mt-1 text-sm text-[var(--muted)]">任务正在本地 executor 或 execgo-runtime 中执行。</p>
          </div>
          <span className="hidden text-[var(--muted)] sm:block">→</span>
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">cancelling</p>
            <p className="mt-1 text-sm text-[var(--muted)]">控制面已接收 cancel，正在触发 context 或 runtime handle。</p>
          </div>
          <span className="hidden text-[var(--muted)] sm:block">→</span>
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">cancelled</p>
            <p className="mt-1 text-sm text-[var(--muted)]">终态保留结果、错误码与事件，便于 agent 后续决策。</p>
          </div>
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
              <h3 className="flex items-center gap-2 text-base font-semibold text-[var(--foreground)]">
                <item.Icon className="h-4 w-4 text-[var(--accent-strong)]" aria-hidden="true" />
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
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center border border-[var(--border)] bg-[var(--panel)] text-[var(--accent-strong)]">
                <item.Icon className="h-4 w-4" aria-hidden="true" />
              </div>
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
