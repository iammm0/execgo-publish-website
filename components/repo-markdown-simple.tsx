import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { slugifyHeading } from "@/lib/execgo-data";

type RepoMarkdownSimpleProps = {
  content: string;
};

export function RepoMarkdownSimple({ content }: RepoMarkdownSimpleProps) {
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
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
