import type { ReactNode } from "react";
import Image from "next/image";

import { DismissibleMenu } from "@/components/dismissible-menu";

const GITHUB_ICON_SRC = "/github.svg";

const GITHUB_REPOS = [
  {
    label: "execgo",
    href: "https://github.com/iammm0/execgo",
    description: "控制面与任务执行内核",
  },
  {
    label: "execgo-runtime",
    href: "https://github.com/iammm0/execgo-runtime",
    description: "数据面运行时",
  },
  {
    label: "execgo-playground",
    href: "https://github.com/iammm0/execgo-playground",
    description: "AI 编排可靠性训练场",
  },
];

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
          <span className={titleClassName}>{repo.label}</span>
          <span className={descriptionClassName}>{repo.description}</span>
        </a>
      ))}
    </DismissibleMenu>
  );
}
