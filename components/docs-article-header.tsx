import { ExternalLink, FileText } from "lucide-react";

type DocsArticleHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  badges: string[];
  sourceHref?: string;
  sourceLabel?: string;
};

export function DocsArticleHeader({
  eyebrow,
  title,
  description,
  badges,
  sourceHref,
  sourceLabel = "Source",
}: DocsArticleHeaderProps) {
  return (
    <header className="docs-article-header">
      <div className="flex flex-wrap items-center gap-2">
        <span className="docs-eyebrow inline-flex items-center gap-2">
          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
          {eyebrow}
        </span>
        {badges.map((badge) => (
          <span key={badge} className="docs-badge">
            {badge}
          </span>
        ))}
      </div>
      <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className="break-words text-3xl font-semibold leading-tight text-[var(--foreground)] sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {sourceHref ? (
          <a
            href={sourceHref}
            target="_blank"
            rel="noreferrer"
            className="docs-source-link"
          >
            <span>{sourceLabel}</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </header>
  );
}
