"use client";

import { Monitor, Moon, Sun } from "lucide-react";

import { useTheme } from "@/lib/theme-context";

export function ThemeToggle() {
  const { themeMode, cycleThemeMode } = useTheme();
  const Icon =
    themeMode === "system" ? Monitor : themeMode === "light" ? Sun : Moon;

  const label =
    themeMode === "system" ? "System" : themeMode === "light" ? "Light" : "Dark";
  const title =
    themeMode === "system"
      ? "Theme: follow system. Click to cycle."
      : `Theme: ${label}. Click to cycle.`;

  return (
    <button
      type="button"
      onClick={cycleThemeMode}
      className="inline-flex h-8 items-center gap-1.5 text-sm leading-none text-[var(--muted)] hover:text-[var(--accent-strong)]"
      title={title}
    >
      <span className="sr-only">Theme</span>
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="font-medium leading-none text-[var(--foreground)]">{label}</span>
    </button>
  );
}
