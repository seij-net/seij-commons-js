// i18n/I18nProvider.tsx
import { Problem, toProblem } from "@seij/common-types";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { detectClientLocale, normalize } from "./i18n.detect";
import { createI18nEngine } from "./i18n.factory";
import { Formats, I18n, Messages } from "./i18n.types";

type Loader = (locale: string) => Promise<{ messages: Messages; formats: Formats }>;

const I18nCtx = createContext<I18n | null>(null);

export interface I18nProviderProps {
  children: React.ReactNode;
  /** SSR hydrate */
  initialLocale?: string;
  /** for tests, storybook, preview */
  forcedLocale?: string;
  /** Lazy loading by locale of messages and formats (promise) */
  load: Loader;
}

export function I18nProvider({ children, initialLocale, forcedLocale, load }: I18nProviderProps) {
  // Detects the locale: first used the forced one, then initial, then use autodetection
  const locale = useMemo(
    () => normalize(forcedLocale || initialLocale || detectClientLocale()),
    [forcedLocale, initialLocale],
  );

  const [validInstance, setValidInstance] = useState<I18n | null>(null);
  const [error, setError] = useState<Problem | null>(null);

  useEffect(() => {
    load(locale)
      .then((resp) => {
        setValidInstance(createI18nEngine(locale, resp.messages, resp.formats));
        setError(null);
      })
      .catch((err) => {
        setError(toProblem(err));
      });
  }, [locale, load]);

  if (error) return "Could not load locale " + locale;
  if (!validInstance) return null;
  return <I18nCtx.Provider value={validInstance}>{children}</I18nCtx.Provider>;
}

export function useI18n(): I18n {
  const v = useContext(I18nCtx);
  if (!v) throw new Error("useI18n must be used within I18nProvider");
  return v;
}
