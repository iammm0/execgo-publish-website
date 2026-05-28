import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Server,
} from "lucide-react";

import { ExecgoDocsMenu } from "@/components/execgo-docs-menu";
import { GitHubMenu } from "@/components/github-menu";
import { hasRuntimeDocIndex } from "@/lib/runtime-data";

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
    iconAlt: "Codex icon",
    signal: "把一次性操作变成可审计任务",
    body: "Codex 继续负责读代码、拆步骤和选择工具；ExecGo 接住真实动作，让每次运行都有 task id、依赖、状态与取消语义。",
    bullets: ["manifest 驱动工具发现", "schema validation 先挡坏参数", "长任务可 cancel / wait"],
  },
  {
    name: "Claude Code",
    iconSrc: "/claude-color.svg",
    iconAlt: "Claude Code icon",
    signal: "在团队代码库里接入安全动作层",
    body: "Claude Code 保留代码理解和交互体验，危险或耗时动作交给 ExecGo 执行，避免 shell 历史和临时日志成为唯一证据。",
    bullets: ["shell / file action 结构化", "cancel 与 delete 分离", "事件与 artifact 可回放"],
  },
  {
    name: "Hermes Agent",
    iconSrc: "/agent-icons/hermes-agent.png",
    iconAlt: "Hermes Agent icon",
    signal: "为消息驱动 agent 提供动作内核",
    body: "Hermes Agent 这类事件流 agent 可以只提交动作意图，ExecGo 负责把异步执行、失败收敛和结果产物稳定交还给上层循环。",
    bullets: ["事件触发任务图", "runtime 分发和状态持久化", "结果回流后续推理"],
  },
  {
    name: "OpenClaw",
    iconSrc: "/agent-icons/openclaw.svg",
    iconAlt: "OpenClaw icon",
    signal: "面向开放工具生态的能力发现",
    body: "OpenClaw 可以把 ExecGo 当作可发现、可调用、可治理的工具入口，先读 schema，再生成稳定的 action 调用。",
    bullets: ["/adapters/tools 暴露能力", "运行态状态链清晰", "适配开放工具市场"],
  },
];

export default function Home() {
  const showRuntimeDocs = hasRuntimeDocIndex();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-16">
      <section>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
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
        <p className="mt-4 max-w-2xl text-base text-[var(--muted)] sm:text-lg">
          面向 AI Agent 的任务执行内核与运行时。
        </p>
        <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap sm:gap-4">
          <ExecgoDocsMenu
            triggerClassName="inline-flex min-h-11 w-full cursor-pointer list-none items-center justify-center gap-2 border border-[var(--button-primary)] bg-[var(--button-primary)] px-5 py-2 text-sm font-medium text-white hover:border-[var(--button-primary-hover)] hover:bg-[var(--button-primary-hover)] sm:w-auto"
            panelClassName="mt-2 grid gap-2 border border-[var(--border)] bg-[var(--panel)] p-3 shadow-sm sm:absolute sm:left-0 sm:top-full sm:z-20 sm:w-80"
            itemClassName="block border border-[var(--border)] bg-[var(--background-soft)] px-3 py-2 hover:border-[var(--accent-strong)] hover:bg-[var(--accent-soft)]"
            titleClassName="block text-sm font-medium text-[var(--foreground)]"
            descriptionClassName="mt-1 block text-xs leading-relaxed text-[var(--muted)]"
          />
          {showRuntimeDocs ? (
            <Link
              href="/docs/runtime"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-[var(--border)] bg-[var(--panel)] px-5 py-2 text-sm font-medium text-[var(--foreground)] hover:border-[var(--muted)] sm:w-auto"
            >
              <Server className="h-4 w-4 text-[var(--accent-strong)]" aria-hidden="true" />
              runtime 文档
            </Link>
          ) : null}
          <GitHubMenu
            triggerClassName="inline-flex min-h-11 w-full cursor-pointer list-none items-center justify-center gap-2 border border-[var(--border)] bg-[var(--panel)] px-5 py-2 text-sm font-medium text-[var(--foreground)] hover:border-[var(--muted)] sm:w-auto"
            panelClassName="mt-2 grid gap-2 border border-[var(--border)] bg-[var(--panel)] p-3 shadow-sm sm:absolute sm:left-0 sm:top-full sm:z-20 sm:w-72"
            itemClassName="block border border-[var(--border)] bg-[var(--background-soft)] px-3 py-2 text-sm hover:border-[var(--accent-strong)] hover:bg-[var(--accent-soft)]"
            titleClassName="block font-medium text-[var(--foreground)]"
            descriptionClassName="mt-0.5 block text-xs text-[var(--muted)]"
          />
        </div>
      </section>

      <section className="mt-12 border-t border-[var(--border)] pt-10 sm:mt-16 sm:pt-12">
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

      <section className="mt-12 border-t border-[var(--border)] pt-10 sm:mt-16 sm:pt-12">
        <p className="section-eyebrow">可靠执行层解决方案</p>
        <h2 className="mt-2 text-2xl font-bold text-[var(--foreground)]">
          为通用 Agent 接住真实世界的执行
        </h2>
        <p className="mt-4 max-w-2xl text-[var(--muted)]">
          Claude Code、Codex、Hermes Agent、OpenClaw 这类通用或成熟 Agent 已经擅长理解上下文、
          拆解任务和选择工具。ExecGo 专注补上它们最需要的工程底座：把真实 shell、文件、运行时和工具调用，
          变成可验证、可取消、可审计、可恢复的任务执行。
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
