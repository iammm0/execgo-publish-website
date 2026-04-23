import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { BookOpen, GitBranch, Network } from "lucide-react";

import { DismissibleMenu } from "@/components/dismissible-menu";
import { branchHasDocIndex } from "@/lib/execgo-data";

const EXECGO_DOC_BRANCHES = [
  {
    id: "main" as const,
    href: "/docs/execgo/main",
    title: "标准执行内核（main）",
    description: "稳定主线文档，适合默认接入与日常使用。",
    Icon: GitBranch,
  },
  {
    id: "feat-add-cluster" as const,
    href: "/docs/execgo/feat-add-cluster",
    title: "添加了分布式相关生产特性（feat-add-cluster）",
    description: "包含集群与分布式相关生产能力的分支文档。",
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
          <BookOpen className="h-4 w-4" aria-hidden="true" />
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
