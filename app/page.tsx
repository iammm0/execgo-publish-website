import Link from "next/link";
import Image from "next/image";
import {
  Bot,
  CheckCircle2,
  ExternalLink,
  Rocket,
  Server,
} from "lucide-react";

import { GitHubMenu } from "@/components/github-menu";

const AGENT_EXPERIENCES: {
  name: string;
  iconSrc: string;
  iconAlt: string;
  signal: string;
  body: string;
  bullets: string[];
}[] = [
  {
    name: "Codex",
    iconSrc: "/codex-color.svg",
    iconAlt: "Codex 图标",
    signal: "把一次性动作变成可审计任务",
    body: "Codex 继续负责阅读代码、规划步骤和选择工具；ExecGo 捕获真实动作，让每次运行都有 task id、依赖关系、状态和取消语义。",
    bullets: ["基于 manifest 的工具发现", "schema 校验拦截错误参数", "长任务支持 cancel / wait"],
  },
  {
    name: "Claude Code",
    iconSrc: "/claude-color.svg",
    iconAlt: "Claude Code 图标",
    signal: "给团队代码库加一层安全动作面",
    body: "Claude Code 继续负责代码理解与交互；危险或长时间运行的动作进入 ExecGo，不再只依赖 shell history 和临时日志作为证据。",
    bullets: ["结构化 shell / file 动作", "取消与删除保持分离", "事件和 artifact 可回放"],
  },
  {
    name: "Hermes Agent",
    iconSrc: "/agent-icons/hermes-agent.png",
    iconAlt: "Hermes Agent 图标",
    signal: "面向消息驱动 Agent 的动作内核",
    body: "Hermes Agent 这类事件流 Agent 只需要提交动作意图；ExecGo 处理异步执行、失败收敛，并把稳定结果交回推理循环。",
    bullets: ["事件触发的任务图", "runtime 分发与持久化", "结果回流到推理过程"],
  },
  {
    name: "OpenClaw",
    iconSrc: "/agent-icons/openclaw.svg",
    iconAlt: "OpenClaw 图标",
    signal: "开放工具生态里的能力发现入口",
    body: "OpenClaw 可以把 ExecGo 当成可发现、可调用、可治理的工具入口：先读取 schema，再发出稳定的 action 调用。",
    bullets: ["/adapters/tools 暴露能力", "清晰的 runtime 状态链", "适配开放工具市场"],
  },
];

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8">
      <section className="mx-auto max-w-4xl text-center">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Image
            src="/brand/execgo-logo-192.png"
            alt="execgo logo"
            width={72}
            height={72}
            priority
            className="h-12 w-12 sm:h-[72px] sm:w-[72px]"
          />
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
            execgo
          </h1>
        </div>
        <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--muted)] sm:text-lg">
          面向 AI Agent 的任务执行内核与运行时生态。
        </p>
        <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-4">
          <Link
            href="/docs/execgo/quickstart"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-[var(--button-primary)] bg-[var(--button-primary)] px-5 py-2 text-sm font-medium text-white hover:border-[var(--button-primary-hover)] hover:bg-[var(--button-primary-hover)] sm:w-auto"
          >
            <Rocket className="h-4 w-4" aria-hidden="true" />
            快速开始
          </Link>
          <Link
            href="/docs/agent"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-[var(--border)] bg-[var(--panel)] px-5 py-2 text-sm font-medium text-[var(--foreground)] hover:border-[var(--muted)] sm:w-auto"
          >
            <Bot className="h-4 w-4 text-[var(--accent-strong)]" aria-hidden="true" />
            Agent 接入
          </Link>
          <Link
            href="/docs/runtime"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-[var(--border)] bg-[var(--panel)] px-5 py-2 text-sm font-medium text-[var(--foreground)] hover:border-[var(--muted)] sm:w-auto"
          >
            <Server className="h-4 w-4 text-[var(--accent-strong)]" aria-hidden="true" />
            Runtime 文档
          </Link>
          <GitHubMenu
            triggerClassName="inline-flex min-h-11 w-full cursor-pointer list-none items-center justify-center gap-2 border border-[var(--border)] bg-[var(--panel)] px-5 py-2 text-sm font-medium text-[var(--foreground)] hover:border-[var(--muted)] sm:w-auto"
            panelClassName="mt-2 grid gap-2 border border-[var(--border)] bg-[var(--panel)] p-3 shadow-sm sm:absolute sm:left-0 sm:top-full sm:z-20 sm:w-72"
            itemClassName="block border border-[var(--border)] bg-[var(--background-soft)] px-3 py-2 text-sm hover:border-[var(--accent-strong)] hover:bg-[var(--accent-soft)]"
            titleClassName="block font-medium text-[var(--foreground)]"
            descriptionClassName="mt-0.5 block text-xs text-[var(--muted)]"
          />
        </div>
        <div className="mt-8 border-t-2 border-[var(--accent-strong)] bg-[var(--background-soft)] px-4 py-4 sm:px-5">
          <p className="text-sm font-semibold text-[var(--foreground)]">
            推荐接入：execgo-skills
          </p>
          <p className="mx-auto mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
            将 skill 连接到 Codex、Claude Code、Hermes Agent 或 OpenClaw，
            让 Agent 接入 ExecGo 与 execgo-runtime 时从 execgo-agent-bridge 开始。
          </p>
          <a
            href="https://github.com/iammm0/execgo-skills/tree/main/skills/execgo-agent-bridge"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex min-w-0 items-center gap-2 text-sm font-medium text-[var(--accent-strong)] underline decoration-[rgba(47,128,237,0.35)] underline-offset-2 hover:text-[var(--accent)]"
          >
            查看 execgo-agent-bridge skill
            <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-4xl border-t border-[var(--border)] pt-10 text-center sm:mt-16 sm:pt-12">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">
          execgo 是什么？
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
            {" "}
            是控制面：负责任务编排、执行策略和外部 API，把上层决策映射为可运行步骤。
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
            {" "}
            是数据面运行时：在单进程内提供 HTTP 与 CLI，用于提交、调度、执行和持久化任务。
          </p>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-6xl border-t border-[var(--border)] pt-10 sm:mt-16 sm:pt-12">
        <p className="section-eyebrow text-center">可靠执行层</p>
        <h2 className="mt-2 text-center text-2xl font-bold text-[var(--foreground)]">
          为通用 Agent 接住真实世界的执行动作
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-[var(--muted)]">
          Claude Code、Codex、Hermes Agent、OpenClaw 这类通用 Agent 已经擅长上下文理解、
          规划和工具选择。ExecGo 补上它们最需要的工程执行层：把真实 shell、file、
          runtime 和工具调用变成可验证、可取消、可审计、可恢复的任务执行。
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {AGENT_EXPERIENCES.map((item) => (
            <li key={item.name} className="min-w-0 border border-[var(--border)] bg-[var(--panel)] p-4 sm:p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[var(--border)] bg-white p-2">
                  <Image
                    src={item.iconSrc}
                    alt={item.iconAlt}
                    width={32}
                    height={32}
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-[var(--foreground)]">
                    {item.name}
                  </h3>
                  <p className="mt-1 break-words text-sm font-medium text-[var(--accent-strong)]">
                    {item.signal}
                  </p>
                </div>
              </div>
              <p className="mt-4 break-words text-sm leading-relaxed text-[var(--muted)]">
                {item.body}
              </p>
              <ul className="mt-4 space-y-2">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="flex min-w-0 gap-2 text-sm text-[var(--muted)]">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-strong)]"
                      aria-hidden="true"
                    />
                    <span className="min-w-0 break-words">{bullet}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

    </div>
  );
}
