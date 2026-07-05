import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { BookOpen, Boxes, GitBranch, Network } from "lucide-react";

import { DismissibleMenu } from "@/components/dismissible-menu";

const DOC_LINKS = [
  {
    href: "/docs",
    title: "Documentation overview",
    description: "Start from the MDX documentation hub and choose the product boundary you need.",
    Icon: BookOpen,
  },
  {
    href: "/docs/ecosystem",
    title: "Ecosystem model",
    description: "Understand how agents, ExecGo, and execgo-runtime fit together.",
    Icon: Boxes,
  },
  {
    href: "/docs/execgo",
    title: "ExecGo control plane",
    description: "Task DSL, mature-agent adapters, executor routing, and runtime integration.",
    Icon: GitBranch,
  },
  {
    href: "/docs/runtime",
    title: "execgo-runtime data plane",
    description: "Process execution, task artifacts, runtime API, and operations.",
    Icon: Network,
  },
];

const EXECGO_DOC_LINKS = DOC_LINKS satisfies Array<{
  href: string;
  title: string;
  description: string;
  Icon: LucideIcon;
}>;

type ExecgoDocsMenuProps = {
  wrapperClassName?: string;
  triggerClassName: string;
  panelClassName: string;
  itemClassName: string;
  titleClassName: string;
  descriptionClassName: string;
};

export function ExecgoDocsMenu({
  wrapperClassName = "relative",
  triggerClassName,
  panelClassName,
  itemClassName,
  titleClassName,
  descriptionClassName,
}: ExecgoDocsMenuProps) {
  return (
    <DismissibleMenu
      wrapperClassName={wrapperClassName}
      triggerClassName={triggerClassName}
      panelClassName={panelClassName}
      triggerContent={
        <>
          <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Docs</span>
        </>
      }
    >
      {EXECGO_DOC_LINKS.map((item) => (
        <Link key={item.href} href={item.href} className={itemClassName}>
          <span className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center border border-[var(--border)] bg-[var(--panel)] text-[var(--accent-strong)]">
              <item.Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className={titleClassName}>{item.title}</span>
              <span className={descriptionClassName}>{item.description}</span>
            </span>
          </span>
        </Link>
      ))}
    </DismissibleMenu>
  );
}
