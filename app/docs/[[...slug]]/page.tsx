import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { Code2 } from "lucide-react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";

import { getMDXComponents } from "@/mdx-components";
import { ThemeToggle } from "@/components/theme-toggle";
import { docsSource } from "@/lib/docs-source";

type DocsRouteProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

export function generateStaticParams() {
  return docsSource.generateParams();
}

export async function generateMetadata({
  params,
}: DocsRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const page = docsSource.getPage(slug);

  if (!page) {
    return {
      title: "Document not found",
    };
  }

  return {
    title: page.data.title,
    description: page.data.description,
  };
}

export default async function DocsRoutePage({ params }: DocsRouteProps) {
  const { slug } = await params;
  const page = docsSource.getPage(slug);

  if (!page) {
    notFound();
  }

  const MDXContent = page.data.body;

  return (
    <div className="w-full">
      <DocsLayout
        tree={docsSource.getPageTree()}
        nav={{
          enabled: true,
          url: "/docs",
          title: (
            <span className="execgo-docs-brand">
              <span className="execgo-docs-brand-mark" aria-hidden="true">
                E
              </span>
              <span>ExecGo</span>
              <span className="execgo-docs-badge">Docs</span>
            </span>
          ),
        }}
        sidebar={{
          enabled: true,
          collapsible: true,
          footer: (
            <div
              key="execgo-docs-sidebar-footer"
              className="execgo-docs-sidebar-footer"
            >
              <a
                href="https://github.com/iammm0/execgo"
                target="_blank"
                rel="noreferrer"
                aria-label="打开 ExecGo GitHub 仓库"
              >
                <Code2 className="size-4" aria-hidden="true" />
                <span>GitHub</span>
              </a>
              <ThemeToggle />
            </div>
          ),
        }}
        searchToggle={{ enabled: true }}
        themeSwitch={{ enabled: false }}
        containerProps={{
          className: "execgo-docs-layout",
          style: {
            "--fd-layout-width": "100%",
            "--fd-docs-row-1": "3.75rem",
          } as CSSProperties,
        }}
      >
        <DocsPage
          className="execgo-docs-page"
          toc={page.data.toc}
          tableOfContent={{ enabled: true }}
          footer={{ enabled: false }}
        >
          <DocsTitle>{page.data.title}</DocsTitle>
          <DocsDescription>{page.data.description}</DocsDescription>
          <DocsBody>
            <MDXContent components={getMDXComponents()} />
          </DocsBody>
        </DocsPage>
      </DocsLayout>
    </div>
  );
}
