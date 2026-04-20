"use client";

import { useLocale } from "@/lib/locale-context";

export function LocaleToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <button
      type="button"
      onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
      className="text-sm text-[var(--muted)] hover:text-[var(--accent-strong)]"
      title="切换语言"
    >
      {locale === "zh" ? "En" : "中"}
    </button>
  );
}
