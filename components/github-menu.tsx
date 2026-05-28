import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Code2, Server } from "lucide-react";
import Image from "next/image";

import { DismissibleMenu } from "@/components/dismissible-menu";

const GITHUB_ICON_SRC = "/github.svg";

const GITHUB_REPOS = [
  {
    label: "execgo",
    href: "https://github.com/iammm0/execgo",
    description: "控制面与任务执行内核",
    Icon: Code2,
  },
  {
    label: "execgo-runtime",
    href: "https://github.com/iammm0/execgo-runtime",
    description: "数据面运行时",
    Icon: Server,
  },
] satisfies Array<{
  label: string;
  href: string;
  description: string;
  Icon: LucideIcon;
}>;

type GitHubMenuProps = {
  wrapperClassName?: string;
  triggerClassName: string;
  panelClassName: string;
  itemClassName: string;
  titleClassName: string;
  descriptionClassName: string;
  triggerContent?: ReactNode;
};

export function GitHubMenu({
  wrapperClassName = "relative",
  triggerClassName,
  panelClassName,
  itemClassName,
  titleClassName,
  descriptionClassName,
  triggerContent,
}: GitHubMenuProps) {
  return (
    <DismissibleMenu
      wrapperClassName={wrapperClassName}
      triggerClassName={triggerClassName}
      panelClassName={panelClassName}
      triggerContent={
        triggerContent ?? (
          <>
            <Image
              src={GITHUB_ICON_SRC}
              alt=""
              width={16}
              height={16}
              className="h-4 w-4 opacity-80 dark:invert"
            />
            <span>GitHub</span>
          </>
        )
      }
    >
      {GITHUB_REPOS.map((repo) => (
        <a
          key={repo.href}
          href={repo.href}
          target="_blank"
          rel="noreferrer"
          className={itemClassName}
        >
          <span className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center border border-[var(--border)] bg-[var(--panel)] text-[var(--accent-strong)]">
              <repo.Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className={titleClassName}>{repo.label}</span>
              <span className={descriptionClassName}>{repo.description}</span>
            </span>
          </span>
        </a>
      ))}
    </DismissibleMenu>
  );
}
