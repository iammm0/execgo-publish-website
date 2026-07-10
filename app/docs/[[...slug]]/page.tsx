import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";

import { getMDXComponents } from "@/mdx-components";
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
        nav={{ enabled: false }}
        sidebar={{ enabled: true }}
        searchToggle={{ enabled: false }}
        themeSwitch={{ enabled: false }}
        containerProps={{
          style: {
            "--fd-layout-width": "118rem",
            "--fd-docs-row-1": "3.5rem",
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
