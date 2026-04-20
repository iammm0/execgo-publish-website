"use client";

import { createContext, useContext } from "react";

export type Locale = "zh" | "en";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: "zh",
  setLocale: () => {},
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  return <LocaleContext.Provider value={{ locale: "zh", setLocale: () => {} }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}
