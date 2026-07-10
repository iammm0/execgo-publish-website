"use client";

import { Monitor, Moon, Sun } from "lucide-react";

import { useTheme } from "@/lib/theme-context";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { themeMode, cycleThemeMode } = useTheme();
  const Icon =
    themeMode === "system" ? Monitor : themeMode === "light" ? Sun : Moon;

  const title =
    themeMode === "system"
      ? "主题：跟随系统。点击切换。"
      : themeMode === "light"
        ? "主题：浅色。点击切换。"
        : "主题：深色。点击切换。";

  return (
    <button
      type="button"
      onClick={cycleThemeMode}
      className={[
        "inline-flex h-8 w-8 items-center justify-center text-[var(--muted)] hover:text-[var(--accent-strong)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      title={title}
      aria-label={title}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
    </button>
  );
}
