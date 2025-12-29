// i18n/I18nProvider.tsx
import i18next from "i18next";
import React, { createContext, useContext, useMemo, useState } from "react";
import { detectClientLocale, normalize } from "./i18n.detect";
import { I18nService, I18nServiceInstance } from "./i18n.service";
import { I18n } from "./i18n.types";

type I18nCtxType = {
  i18nService: I18nService;
  lastChange: number;
};
const I18nCtx = createContext<I18nCtxType>({ i18nService: I18nServiceInstance, lastChange: 0 });

export interface I18nProviderProps {
  children: React.ReactNode;
  /** SSR hydrate */
  initialLocale?: string;
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  // Detects the locale: first used the forced one, then initial, then use autodetection

  const [instanceTs, setInstanceTs] = useState(0);
  useMemo(() => {
    const language = normalize(initialLocale || detectClientLocale());
    if (language !== i18next.language) {
      I18nServiceInstance.readyPromise.then(() => {
        i18next.changeLanguage(language, () => {
          setInstanceTs(new Date().getTime());
        });
      });
    }
  }, [initialLocale]);

  const value: I18nCtxType = useMemo(
    () => ({
      i18nService: I18nServiceInstance,
      lastChange: instanceTs,
    }),
    [instanceTs],
  );

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n(): I18n {
  const v = useContext(I18nCtx);
  if (!v) throw new Error("useI18n must be used within I18nProvider");
  return v.i18nService;
}
