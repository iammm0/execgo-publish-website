"use client";

import { Monitor, Moon, Sun } from "lucide-react";

import { useTheme } from "@/lib/theme-context";

export function ThemeToggle() {
  const { themeMode, cycleThemeMode } = useTheme();
  const Icon =
    themeMode === "system" ? Monitor : themeMode === "light" ? Sun : Moon;

  const label =
    themeMode === "system" ? "系统" : themeMode === "light" ? "浅色" : "深色";
  const title =
    themeMode === "system"
      ? "主题：跟随系统。点击切换。"
      : `主题：${label}。点击切换。`;

  return (
    <button
      type="button"
      onClick={cycleThemeMode}
      className="inline-flex h-8 items-center gap-1.5 text-sm leading-none text-[var(--muted)] hover:text-[var(--accent-strong)]"
      title={title}
    >
      <span className="sr-only">主题</span>
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="font-medium leading-none text-[var(--foreground)]">{label}</span>
    </button>
  );
}
