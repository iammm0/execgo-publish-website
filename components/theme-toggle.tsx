"use client";

import { useTheme } from "@/lib/theme-context";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="text-sm text-[var(--muted)] hover:text-[var(--accent-strong)]"
      title={theme === "dark" ? "切换为浅色" : "切换为深色"}
    >
      {theme === "dark" ? "浅色" : "深色"}
    </button>
  );
}
