import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DocsToc } from "@/components/docs-toc";
import {
  getDocBySlug,
  getDocPath,
  getPrevNextDoc,
  getStaticDocSlugs,
} from "@/lib/docs";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export function generateStaticParams() {
  return [{}, ...getStaticDocSlugs().map((slug) => ({ slug }))];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug(slug);

  if (!doc) {
    return {
      title: "文档未找到",
    };
  }

  return {
    title: `${doc.title} | 文档`,
    description: doc.description,
  };
}

export default async function DocsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  const { previous, next } = getPrevNextDoc(doc.slug);

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_220px]">
      <article className="docs-prose rounded-2xl border border-sky-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="border-b border-sky-100 pb-6">
          <p className="text-xs font-semibold tracking-wide text-sky-700">
            {doc.category}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {doc.title}
          </h1>
          <p className="mt-3 text-base text-slate-600">{doc.description}</p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
            <span>最近更新：{doc.updatedAt}</span>
            <span>阅读时长：{doc.readingTime}</span>
          </div>
        </div>

        {doc.sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-28">
            <h2>{section.title}</h2>

            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            {section.bullets && section.bullets.length > 0 ? (
              <ul>
                {section.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}

            {section.code ? (
              <pre className="p-4">
                <code>{section.code}</code>
              </pre>
            ) : null}

            {section.tip ? (
              <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-800">
                提示：{section.tip}
              </div>
            ) : null}
          </section>
        ))}

        <div className="mt-10 grid gap-3 border-t border-sky-100 pt-6 sm:grid-cols-2">
          <div className="rounded-xl border border-sky-100 p-4">
            <p className="text-xs text-slate-500">上一篇</p>
            {previous ? (
              <Link
                href={getDocPath(previous.slug)}
                className="mt-1 inline-block font-semibold text-slate-800 hover:text-sky-700"
              >
                {previous.title}
              </Link>
            ) : (
              <p className="mt-1 text-sm text-slate-400">已经是第一篇</p>
            )}
          </div>

          <div className="rounded-xl border border-sky-100 p-4 sm:text-right">
            <p className="text-xs text-slate-500">下一篇</p>
            {next ? (
              <Link
                href={getDocPath(next.slug)}
                className="mt-1 inline-block font-semibold text-slate-800 hover:text-sky-700"
              >
                {next.title}
              </Link>
            ) : (
              <p className="mt-1 text-sm text-slate-400">已经是最后一篇</p>
            )}
          </div>
        </div>
      </article>

      <DocsToc sections={doc.sections} />
    </div>
  );
}
