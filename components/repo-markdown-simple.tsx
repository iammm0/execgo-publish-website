import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { slugifyHeading } from "@/lib/execgo-data";

type RepoMarkdownSimpleProps = {
  content: string;
  resolveHref?: (href?: string) => string | null;
};

export function RepoMarkdownSimple({ content, resolveHref }: RepoMarkdownSimpleProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ children }) => {
          const text = String(children);
          const id = slugifyHeading(text);
          return <h2 id={id}>{children}</h2>;
        },
        h3: ({ children }) => {
          const text = String(children);
          const id = slugifyHeading(text);
          return <h3 id={id}>{children}</h3>;
        },
        a({ href, children }) {
          const resolvedHref = resolveHref ? resolveHref(href) : href;

          if (!resolvedHref) {
            return <span>{children}</span>;
          }

          if (resolvedHref.startsWith("/")) {
            return <Link href={resolvedHref}>{children}</Link>;
          }

          return (
            <a
              href={resolvedHref}
              target={resolvedHref.startsWith("http") ? "_blank" : undefined}
              rel={resolvedHref.startsWith("http") ? "noreferrer" : undefined}
            >
              {children}
            </a>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
