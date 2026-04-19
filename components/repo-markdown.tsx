import type { ReactNode } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  getBranchSnapshot,
  resolveMarkdownHref,
  slugifyHeading,
  toBranchBlobUrl,
  type BranchId,
} from "@/lib/execgo-data";

type RepoMarkdownProps = {
  branchId: BranchId;
  content: string;
  currentDocPath: string;
};

function extractText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join("");
  }

  if (node && typeof node === "object" && "props" in node) {
    const childNode = (node as { props?: { children?: ReactNode } }).props?.children;
    return extractText(childNode);
  }

  return "";
}

function headingTag(depth: 2 | 3) {
  const Tag = depth === 2 ? "h2" : "h3";

  return function Heading({
    children,
  }: {
    children?: ReactNode;
  }) {
    const title = extractText(children);
    const id = slugifyHeading(title);

    return (
      <Tag id={id} className="scroll-mt-28">
        {children}
      </Tag>
    );
  };
}

export function RepoMarkdown({
  branchId,
  content,
  currentDocPath,
}: RepoMarkdownProps) {
  const branch = getBranchSnapshot(branchId);

  return (
    <div className="repo-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: headingTag(2),
          h3: headingTag(3),
          a({ href, children }) {
            const resolvedHref = resolveMarkdownHref(branchId, currentDocPath, href);

            if (!resolvedHref) {
              return <span>{children}</span>;
            }

            if (resolvedHref.startsWith("/docs/")) {
              return <Link href={resolvedHref}>{children}</Link>;
            }

            if (
              resolvedHref.startsWith("http://") ||
              resolvedHref.startsWith("https://") ||
              resolvedHref.startsWith("mailto:") ||
              resolvedHref.startsWith("#")
            ) {
              return (
                <a
                  href={resolvedHref}
                  target={resolvedHref.startsWith("http") ? "_blank" : undefined}
                  rel={resolvedHref.startsWith("http") ? "noreferrer" : undefined}
                >
                  {children}
                </a>
              );
            }

            const repoHref = toBranchBlobUrl(branch, resolvedHref);
            return (
              <a href={repoHref} target="_blank" rel="noreferrer">
                {children}
              </a>
            );
          },
          pre({ children }) {
            return <pre>{children}</pre>;
          },
          code({ children, className, ...props }) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
