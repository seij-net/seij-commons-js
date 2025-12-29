import { FluentProvider, Theme, webLightTheme } from "@fluentui/react-components";

import { PropsWithChildren } from "react";
import { ErrorManager } from "../lib/error_notifier/ErrorNotifier";
import { Formats, Messages } from "../lib/i18n";
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

interface SeijUIProviderProps extends PropsWithChildren {
  /** SSR hydrate */
  initialLocale?: string;
  /** SSR hydrate */
  initialMessages?: Messages;
  /** SSR hydrate */
  initialFormats?: Formats;
  /** for tests, storybook, preview */
  forcedLocale?: string;
}

export function SeijUIProvider({ children, initialLocale }: SeijUIProviderProps) {
  return (
    <I18nProvider initialLocale={initialLocale}>
      <FluentProvider theme={theme}>
        {children}
        <ErrorManager />
      </FluentProvider>
    </I18nProvider>
  );
}
