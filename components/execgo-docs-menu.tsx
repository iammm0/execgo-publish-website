import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { BookOpen, GitBranch, Network } from "lucide-react";

import { DismissibleMenu } from "@/components/dismissible-menu";
import { branchHasDocIndex } from "@/lib/execgo-data";

const EXECGO_DOC_BRANCHES = [
  {
    id: "main" as const,
    href: "/docs/execgo/main",
    title: "适配器与 Runtime 主线（main）",
    description: "main 分支已包含成熟 Agent 适配器、execgo-runtime 执行器与 execgocli。",
    Icon: GitBranch,
  },
  {
    id: "feat-add-cluster" as const,
    href: "/docs/execgo/feat-add-cluster",
    title: "集群预览（feat-add-cluster）",
    description: "包含集群、队列、远程 Worker 与分布式控制面预览能力。",
    Icon: Network,
  },
].filter((branch) => branchHasDocIndex(branch.id)) satisfies Array<{
  id: "main" | "feat-add-cluster";
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
  if (EXECGO_DOC_BRANCHES.length === 0) {
    return null;
  }

  return (
    <DismissibleMenu
      wrapperClassName={wrapperClassName}
      triggerClassName={triggerClassName}
      panelClassName={panelClassName}
      triggerContent={
        <>
          <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>execgo 文档</span>
        </>
      }
    >
      {EXECGO_DOC_BRANCHES.map((branch) => (
        <Link key={branch.href} href={branch.href} className={itemClassName}>
          <span className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center border border-[var(--border)] bg-[var(--panel)] text-[var(--accent-strong)]">
              <branch.Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className={titleClassName}>{branch.title}</span>
              <span className={descriptionClassName}>{branch.description}</span>
            </span>
          </span>
        </Link>
      ))}
    </DismissibleMenu>
  );
}
