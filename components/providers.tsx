"use client";

import { RootProvider } from "fumadocs-ui/provider/next";

import { ThemeProvider } from "@/lib/theme-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <RootProvider search={{ enabled: false }}>{children}</RootProvider>
    </ThemeProvider>
  );
}
