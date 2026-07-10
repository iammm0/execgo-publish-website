"use client";

import {
  Children,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { Check, Clipboard, Code2 } from "lucide-react";
import { useState } from "react";

type RichCodeBlockProps = ComponentPropsWithoutRef<"pre">;

function extractText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }

  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join("");
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractText(node.props.children);
  }

  return "";
}

function getCodeClassName(node: ReactNode): string | undefined {
  for (const child of Children.toArray(node)) {
    if (!isValidElement<{ className?: string; children?: ReactNode }>(child)) {
      continue;
    }

    if (child.type === "code" && typeof child.props.className === "string") {
      return child.props.className;
    }

    const nestedClassName = getCodeClassName(child.props.children);
    if (nestedClassName) {
      return nestedClassName;
    }
  }

  return undefined;
}

function countRenderedLines(node: ReactNode): number {
  let total = 0;

  for (const child of Children.toArray(node)) {
    if (!isValidElement<{ className?: string; children?: ReactNode }>(child)) {
      continue;
    }

    const className = child.props.className;
    if (typeof className === "string" && className.split(/\s+/).includes("line")) {
      total += 1;
      continue;
    }

    total += countRenderedLines(child.props.children);
  }

  return total;
}

function getStringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

function getLanguageLabel(code: string, className?: string, dataLanguage?: string) {
  const classLanguage = className?.match(/(?:language|lang)-([a-z0-9_-]+)/i)?.[1];
  const explicit = dataLanguage ?? classLanguage;

  if (explicit) {
    return explicit.toUpperCase();
  }

  const trimmed = code.trimStart();

  if (/^[\[{]/.test(trimmed) && trimmed.includes('"')) {
    return "JSON";
  }

  if (
    /^(curl|cargo|go|npm|pnpm|yarn|docker|kubectl|execgo-runtime)\b/m.test(trimmed) ||
    trimmed.includes("#!/bin/") ||
    trimmed.includes(" <<")
  ) {
    return "SHELL";
  }

  if (/^(import|export|const|let|type|interface)\b/m.test(trimmed)) {
    return "TS";
  }

  return "TEXT";
}

function getLineCount(code: string) {
  if (!code) {
    return 0;
  }

  return code.replace(/\n$/, "").split(/\r\n|\r|\n/).length;
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export function RichCodeBlock({
  children,
  className = "",
  ...props
}: RichCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const rawProps = props as Record<string, unknown>;
  const code = extractText(children);
  const language = getLanguageLabel(
    code,
    getCodeClassName(children) ?? className,
    getStringValue(rawProps["data-language"]) ?? getStringValue(rawProps["data-lang"]),
  );
  const title =
    getStringValue(rawProps["data-title"]) ??
    getStringValue(rawProps["title"]) ??
    "代码片段";
  const renderedLineCount = countRenderedLines(children);
  const lineCount = renderedLineCount > 0 ? renderedLineCount : getLineCount(code);

  async function handleCopy() {
    if (!code) {
      return;
    }

    await copyToClipboard(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <figure className="execgo-code-block not-prose my-6">
      <figcaption className="execgo-code-block-header">
        <div className="execgo-code-block-heading">
          <span className="execgo-code-block-window" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="execgo-code-block-title">
            <Code2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {title}
          </span>
          <span className="execgo-code-block-language">{language}</span>
        </div>
        <div className="execgo-code-block-actions">
          {lineCount > 0 ? (
            <span className="execgo-code-block-lines">{lineCount} 行</span>
          ) : null}
          <button
            type="button"
            className="execgo-code-block-copy"
            onClick={handleCopy}
            disabled={!code}
            aria-label={copied ? "已复制代码" : "复制代码"}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Clipboard className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span>{copied ? "已复制" : "复制"}</span>
          </button>
        </div>
      </figcaption>
      <div className="execgo-code-block-scroll">
        <pre
          {...props}
          className={["execgo-code-block-pre", className].filter(Boolean).join(" ")}
        >
          {children}
        </pre>
      </div>
    </figure>
  );
}
