import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { BookOpen, GitBranch, Network } from "lucide-react";

import { DismissibleMenu } from "@/components/dismissible-menu";
import { branchHasDocIndex } from "@/lib/execgo-data";

const EXECGO_DOC_BRANCHES = [
  {
    id: "release-agent-adapter-runtime" as const,
    href: "/docs/execgo/release-agent-adapter-runtime",
    title: "Adapter & runtime release line (release/agent-adapter-runtime)",
    description: "Stable line with mature agent adapters, execgo-runtime executor, and execgocli.",
    Icon: GitBranch,
  },
  {
    id: "preview-distributed-runtime" as const,
    href: "/docs/execgo/preview-distributed-runtime",
    title: "Distributed runtime preview (preview/distributed-runtime)",
    description: "Preview line with lease recovery, cancel, dead-letter ops, and capability-aware dispatch.",
    Icon: Network,
  },
].filter((branch) => branchHasDocIndex(branch.id)) satisfies Array<{
  id: "release-agent-adapter-runtime" | "preview-distributed-runtime";
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
          <span>ExecGo docs</span>
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
