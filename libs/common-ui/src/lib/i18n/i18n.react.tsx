// i18n/I18nProvider.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { i18NextInstance, I18nService, I18nServiceInstance } from "./i18n.service";
import { I18n } from "./i18n.types";

type I18nCtxType = {
  i18nService: I18nService;
  lastChange: number;
};
const I18nCtx = createContext<I18nCtxType>({ i18nService: I18nServiceInstance, lastChange: 0 });

export interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  // Detects the locale: first used the forced one, then initial, then use autodetection

  const [instanceTs, setInstanceTs] = useState(0);
  const [ready, setReady] = useState<boolean>(false);
  const value: I18nCtxType = useMemo(
    () => ({
      i18nService: I18nServiceInstance,
      lastChange: instanceTs,
    }),
    [instanceTs],
  );

  useEffect(() => {
    I18nServiceInstance.readyPromise.then(() => {
      setReady(true);
    });
  }, []);

  if (!ready) return null;

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n(): I18n {
  const v = useContext(I18nCtx);
  if (!v) throw new Error("useI18n must be used within I18nProvider");
  return v.i18nService;
}
