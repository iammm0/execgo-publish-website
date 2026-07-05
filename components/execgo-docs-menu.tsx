import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { BookOpen, Boxes, GitBranch, Network } from "lucide-react";

import { DismissibleMenu } from "@/components/dismissible-menu";

const DOC_LINKS = [
  {
    href: "/docs",
    title: "文档总览",
    description: "从 MDX 文档中心进入，按产品边界选择需要的内容。",
    Icon: BookOpen,
  },
  {
    href: "/docs/ecosystem",
    title: "生态模型",
    description: "理解 Agent、ExecGo 与 execgo-runtime 如何组合。",
    Icon: Boxes,
  },
  {
    href: "/docs/execgo",
    title: "ExecGo 控制面",
    description: "任务 DSL、成熟 Agent 适配器、执行器路由与 runtime 接入。",
    Icon: GitBranch,
  },
  {
    href: "/docs/runtime",
    title: "execgo-runtime 数据面",
    description: "进程执行、任务产物、runtime API 与运维资料。",
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
          <span>文档</span>
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
