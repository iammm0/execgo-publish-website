"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

export type MermaidProps = {
  chart: string;
  title?: string;
  caption?: string;
  className?: string;
};

type RenderState =
  | { status: "loading" }
  | {
      status: "success";
      svg: string;
      bindFunctions?: (element: Element) => void;
    }
  | { status: "error"; message: string };

export function Mermaid({ chart, title, caption, className }: MermaidProps) {
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<RenderState>({ status: "loading" });
  const normalizedChart = chart.trim().replaceAll("\\n", "\n");

  useEffect(() => {
    let cancelled = false;

    async function renderChart() {
      try {
        const { default: mermaid } = await import("mermaid");

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          fontFamily: "inherit",
          theme: "base",
          themeVariables: {
            background: "transparent",
            primaryColor: "#ffffff",
            primaryTextColor: "#000000",
            primaryBorderColor: "#000000",
            secondaryColor: "#ffffff",
            secondaryTextColor: "#000000",
            secondaryBorderColor: "#000000",
            tertiaryColor: "#ffffff",
            tertiaryTextColor: "#000000",
            tertiaryBorderColor: "#000000",
            mainBkg: "#ffffff",
            secondBkg: "#ffffff",
            tertiaryBkg: "#ffffff",
            nodeBorder: "#000000",
            clusterBkg: "transparent",
            clusterBorder: "#000000",
            lineColor: "#000000",
            defaultLinkColor: "#000000",
            edgeLabelBackground: "#ffffff",
            textColor: "#000000",
            titleColor: "#000000",
          },
        });

        const result = await mermaid.render(
          `mermaid-${id.replace(/:/g, "")}`,
          normalizedChart,
        );

        if (cancelled) {
          return;
        }

        setState({
          status: "success",
          svg: result.svg,
          bindFunctions: result.bindFunctions,
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        setState({
          status: "error",
          message: error instanceof Error ? error.message : "Mermaid render failed",
        });
      }
    }

    void renderChart();

    return () => {
      cancelled = true;
    };
  }, [id, normalizedChart]);

  useEffect(() => {
    if (state.status !== "success" || !containerRef.current) {
      return;
    }
    state.bindFunctions?.(containerRef.current);
  }, [state]);

  return (
    <figure
      className={[
        "not-prose my-6 border border-[var(--border)] bg-transparent p-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {title ? (
        <figcaption className="mb-3 text-sm font-semibold text-[var(--foreground)]">
          {title}
        </figcaption>
      ) : null}
      {state.status === "loading" ? (
        <div className="flex min-h-28 items-center justify-center gap-2 text-sm text-[var(--muted)]">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Rendering diagram...
        </div>
      ) : null}
      {state.status === "error" ? (
        <div className="space-y-3">
          <div className="flex items-start gap-2 border border-[var(--border)] bg-[var(--background-soft)] px-3 py-2 text-sm text-[var(--foreground)]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-strong)]" />
            <div>
              <p className="font-medium">Diagram render failed</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{state.message}</p>
            </div>
          </div>
          <pre className="overflow-x-auto border border-[var(--border)] bg-[var(--code-bg)] p-3 text-xs text-[var(--foreground)]">
            <code>{normalizedChart}</code>
          </pre>
        </div>
      ) : null}
      {state.status === "success" ? (
        <div
          ref={containerRef}
          className="mermaid-monochrome flex min-h-28 items-center justify-center overflow-x-auto [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
          dangerouslySetInnerHTML={{ __html: state.svg }}
        />
      ) : null}
      {caption ? (
        <figcaption className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
