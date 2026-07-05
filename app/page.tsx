import Link from "next/link";
import Image from "next/image";
import {
  ExternalLink,
  CheckCircle2,
  Server,
} from "lucide-react";

import { ExecgoDocsMenu } from "@/components/execgo-docs-menu";
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
    iconAlt: "Codex icon",
    signal: "Turn one-off actions into auditable tasks",
    body: "Codex keeps reading code, planning steps, and choosing tools; ExecGo catches real actions so every run gets a task id, dependencies, status, and cancellation semantics.",
    bullets: ["manifest-driven tool discovery", "schema validation blocks bad params", "long tasks support cancel / wait"],
  },
  {
    name: "Claude Code",
    iconSrc: "/claude-color.svg",
    iconAlt: "Claude Code icon",
    signal: "Add a safe action layer in team codebases",
    body: "Claude Code keeps code understanding and interaction; dangerous or long-running actions go through ExecGo instead of shell history and ad-hoc logs as the only evidence.",
    bullets: ["structured shell / file actions", "cancel and delete are separate", "events and artifacts are replayable"],
  },
  {
    name: "Hermes Agent",
    iconSrc: "/agent-icons/hermes-agent.png",
    iconAlt: "Hermes Agent icon",
    signal: "An action kernel for message-driven agents",
    body: "Event-stream agents like Hermes Agent can submit action intent only; ExecGo handles async execution, failure convergence, and stable result handoff back to the loop.",
    bullets: ["event-triggered task graphs", "runtime dispatch and persistence", "results feed back into reasoning"],
  },
  {
    name: "OpenClaw",
    iconSrc: "/agent-icons/openclaw.svg",
    iconAlt: "OpenClaw icon",
    signal: "Capability discovery for open tool ecosystems",
    body: "OpenClaw can treat ExecGo as a discoverable, callable, governable tool entry: read schemas first, then emit stable action calls.",
    bullets: ["/adapters/tools exposes capabilities", "clear runtime state chain", "fits open tool marketplaces"],
  },
];

export default function Home() {
  return (
    <div className="w-full px-4 py-8 sm:px-6 sm:py-16">
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
          Task execution kernel and runtime for AI agents.
        </p>
        <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap sm:gap-4">
          <ExecgoDocsMenu
            triggerClassName="inline-flex min-h-11 w-full cursor-pointer list-none items-center justify-center gap-2 border border-[var(--button-primary)] bg-[var(--button-primary)] px-5 py-2 text-sm font-medium text-white hover:border-[var(--button-primary-hover)] hover:bg-[var(--button-primary-hover)] sm:w-auto"
            panelClassName="mt-2 grid gap-2 border border-[var(--border)] bg-[var(--panel)] p-3 shadow-sm sm:absolute sm:left-0 sm:top-full sm:z-20 sm:w-80"
            itemClassName="block border border-[var(--border)] bg-[var(--background-soft)] px-3 py-2 hover:border-[var(--accent-strong)] hover:bg-[var(--accent-soft)]"
            titleClassName="block text-sm font-medium text-[var(--foreground)]"
            descriptionClassName="mt-1 block text-xs leading-relaxed text-[var(--muted)]"
          />
          <Link
            href="/docs/runtime"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-[var(--border)] bg-[var(--panel)] px-5 py-2 text-sm font-medium text-[var(--foreground)] hover:border-[var(--muted)] sm:w-auto"
          >
            <Server className="h-4 w-4 text-[var(--accent-strong)]" aria-hidden="true" />
            Runtime docs
          </Link>
          <GitHubMenu
            triggerClassName="inline-flex min-h-11 w-full cursor-pointer list-none items-center justify-center gap-2 border border-[var(--border)] bg-[var(--panel)] px-5 py-2 text-sm font-medium text-[var(--foreground)] hover:border-[var(--muted)] sm:w-auto"
            panelClassName="mt-2 grid gap-2 border border-[var(--border)] bg-[var(--panel)] p-3 shadow-sm sm:absolute sm:left-0 sm:top-full sm:z-20 sm:w-72"
            itemClassName="block border border-[var(--border)] bg-[var(--background-soft)] px-3 py-2 text-sm hover:border-[var(--accent-strong)] hover:bg-[var(--accent-soft)]"
            titleClassName="block font-medium text-[var(--foreground)]"
            descriptionClassName="mt-0.5 block text-xs text-[var(--muted)]"
          />
        </div>
        <div className="mt-8 border-l-2 border-[var(--accent-strong)] bg-[var(--background-soft)] px-4 py-4 sm:px-5">
          <p className="text-sm font-semibold text-[var(--foreground)]">
            Recommended integration: execgo-skills
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
            Link the skill to Codex, Claude Code, Hermes Agent, or OpenClaw so agents
            start from execgo-agent-bridge when connecting to ExecGo and execgo-runtime.
          </p>
          <a
            href="https://github.com/iammm0/execgo-skills/tree/main/skills/execgo-agent-bridge"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex min-w-0 items-center gap-2 break-all font-mono text-xs font-medium text-[var(--accent-strong)] underline decoration-[rgba(47,128,237,0.35)] underline-offset-2 hover:text-[var(--accent)] sm:text-sm"
          >
            https://github.com/iammm0/execgo-skills/tree/main/skills/execgo-agent-bridge
            <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="mt-12 border-t border-[var(--border)] pt-10 sm:mt-16 sm:pt-12">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">
          What is execgo?
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
            is the control plane: task orchestration, execution policy, and external APIs that map upstream decisions to runnable steps.
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
            is the data-plane runtime: HTTP and CLI in a single process for task submit, schedule, execute, and persist.
          </p>
        </div>
      </section>

      <section className="mt-12 border-t border-[var(--border)] pt-10 sm:mt-16 sm:pt-12">
        <p className="section-eyebrow">Reliable execution layer</p>
        <h2 className="mt-2 text-2xl font-bold text-[var(--foreground)]">
          Catch real-world execution for general-purpose agents
        </h2>
        <p className="mt-4 max-w-2xl text-[var(--muted)]">
          General-purpose agents such as Claude Code, Codex, Hermes Agent, and OpenClaw already excel at context,
          planning, and tool choice. ExecGo fills the engineering substrate they need most: turn real shell, file,
          runtime, and tool calls into verifiable, cancellable, auditable, recoverable task execution.
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
