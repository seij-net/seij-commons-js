import { FluentProvider, Theme, webLightTheme } from "@fluentui/react-components";

import { PropsWithChildren } from "react";
import { ErrorManager } from "../lib/error_notifier/ErrorNotifier";
import { I18nProvider } from "../lib/i18n/i18n.react";

// noinspection SpellCheckingInspection
const theme: Theme = {
  ...webLightTheme,
  fontFamilyBase:
    "'Noto Sans', 'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif",
  fontFamilyMonospace: "Fira Mono, Consolas, 'Courier New', Courier, monospace",
  fontFamilyNumeric:
    "Bahnschrift, 'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif",
};

interface SeijUIProviderProps extends PropsWithChildren {}

export function SeijUIProvider({ children }: SeijUIProviderProps) {
  return (
    <I18nProvider>
      <FluentProvider theme={theme}>
        {children}
        <ErrorManager />
      </FluentProvider>
    </I18nProvider>
  );
}
