import Link from "next/link";

import { DismissibleMenu } from "@/components/dismissible-menu";
import { branchHasDocIndex } from "@/lib/execgo-data";

const EXECGO_DOC_BRANCHES = [
  {
    id: "main" as const,
    href: "/docs/execgo/main",
    title: "标准执行内核（main）",
    description: "稳定主线文档，适合默认接入与日常使用。",
  },
  {
    id: "feat-add-cluster" as const,
    href: "/docs/execgo/feat-add-cluster",
    title: "添加了分布式相关生产特性（feat-add-cluster）",
    description: "包含集群与分布式相关生产能力的分支文档。",
  },
].filter((branch) => branchHasDocIndex(branch.id));

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
      triggerContent="execgo 文档"
    >
      {EXECGO_DOC_BRANCHES.map((branch) => (
        <Link key={branch.href} href={branch.href} className={itemClassName}>
          <span className={titleClassName}>{branch.title}</span>
          <span className={descriptionClassName}>{branch.description}</span>
        </Link>
      ))}
    </DismissibleMenu>
  );
}
