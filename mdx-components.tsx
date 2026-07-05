import defaultMdxComponents from "fumadocs-ui/mdx";
import type { ReactNode } from "react";
import type { MDXComponents } from "mdx/types";

import { Mermaid } from "@/components/mermaid";

type DocsGridProps = {
  children: ReactNode;
};

type DocsCardProps = {
  href: string;
  title: string;
  description: string;
  eyebrow?: string;
};

function DocsGrid({ children }: DocsGridProps) {
  return (
    <div className="not-prose my-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {children}
    </div>
  );
}

function DocsCard({ href, title, description, eyebrow }: DocsCardProps) {
  return (
    <a
      href={href}
      className="group flex min-h-36 flex-col border border-[var(--border)] bg-[var(--panel)] p-4 transition-colors hover:border-[var(--accent)] hover:bg-[var(--background-soft)]"
    >
      {eyebrow ? (
        <span className="text-xs font-semibold text-[var(--muted)]">
          {eyebrow}
        </span>
      ) : null}
      <span className="mt-2 text-base font-semibold text-[var(--foreground)]">
        {title}
      </span>
      <span className="mt-2 text-sm leading-6 text-[var(--muted)]">
        {description}
      </span>
      <span className="mt-auto pt-4 text-sm font-semibold text-[var(--accent-strong)]">
        Open
      </span>
    </a>
  );
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    DocsGrid,
    DocsCard,
    Mermaid,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;
