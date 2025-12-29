import { format, formatISO, isDate, isValid, parse } from "date-fns";
import i18next from "i18next";
import ICU from "i18next-icu";

import fr from "../../locales/fr";
import en from "../../locales/en";
import { I18n } from "./i18n.types";
import { isString } from "lodash-es";

const i18NextInstance = i18next.createInstance();
const i18NextinstanceInitPromise = i18NextInstance.use(ICU).init({
  debug: true,
  resources: { fr: { translation: fr.messages }, en: { translation: en.messages } },
  interpolation: { escapeValue: false },
});

export class I18nService implements I18n {
  readyPromise = i18NextinstanceInitPromise;

  getLocale = (): string => {
    return i18NextInstance.language;
  };

  rich = (id: string, values?: Record<string, unknown | ((chunks: string) => React.ReactNode)>): React.ReactNode => {
    return i18NextInstance.t(id, values);
  };

  t = (id: string, values?: Record<string, unknown>): string => {
    return i18NextInstance.t(id, values);
  };

  formats = () => {
    return i18NextInstance.language === "fr" ? fr.formats : en.formats;
  };

  language = () => {
    return i18NextInstance.language;
  };

  dtf = (style?: string) => {
    return new Intl.DateTimeFormat(this.language(), (style && this.formats().date[style]) || undefined);
  };

  nf = (style?: string) => {
    return new Intl.NumberFormat(this.language(), (style && this.formats().number[style]) || undefined);
  }

  lf = (style?: string) => {
    return new Intl.ListFormat(
      this.language(),
      (style && this.formats().list[style]) || { type: "conjunction", style: "long" },
    );
  }

  rtf = () => {
    return new Intl.RelativeTimeFormat(this.language(), { numeric: "auto" });
  }

  formatDate = (d: Date | number, style?: string): string => {
    return this.dtf(style).format(d);
  }

  formatNumber =(n: number, style?: string): string => {
    return this.nf(style).format(n);
  }

  formatList = (items: string[], style?: string): string => {
    return this.lf(style).format(items);
  }

  formatRelative = (d: Date | number): string => {
    const diff = (Number(d) - Date.now()) / 1000;
    const abs = Math.abs(diff);
    const unit =
      abs < 60
        ? "second"
        : abs < 3600
          ? "minute"
          : abs < 86400
            ? "hour"
            : abs < 2592000
              ? "day"
              : abs < 31536000
                ? "month"
                : "year";
    const value =
      unit === "second"
        ? Math.round(diff)
        : unit === "minute"
          ? Math.round(diff / 60)
          : unit === "hour"
            ? Math.round(diff / 3600)
            : unit === "day"
              ? Math.round(diff / 86400)
              : unit === "month"
                ? Math.round(diff / 2592000)
                : Math.round(diff / 31536000);
    return this.rtf().format(value, unit as Intl.RelativeTimeFormatUnit);
  }

  localDatePlaceholder = (): string => {
    return this.formats().localdate.placeholder;
  }

  localDateInputMask = (): string => {
    return this.formats().localdate.inputmask;
  }

  localDateFormattedToISO = (str: string): string => {
    const inputMask = this.formats().localdate.inputmask;
    const parsed = parse(
      str,
      inputMask,
      new Date(),
      // { locale: fr }
    );
    if (!isDate(parsed) || !isValid(parsed)) return "";
    return formatISO(parsed, { representation: "date" });
  }

  localDateISOToFormattedInput = (str: string): string => {
    const inputMask = this.formats().localdate.inputmask;
    let result;
    if (isString(str)) {
      const date = new Date(str);
      if (isDate(date) && isValid(date)) {
        result = format(date, inputMask);
      } else {
        result = "";
      }
    } else {
      result = "";
    }
    return result;
  }

  monthList = () => {
    return getMonthNames(this.language());
  }
}

function getMonthNames(locale: string): { code: number; label: string }[] {
  const formatter = new Intl.DateTimeFormat(locale, { month: "long" });
  const months = Array.from({ length: 12 }, (_, i) => formatter.format(new Date(2000, i, 1)));
  return months.map((i, index) => ({ code: index + 1, label: i }));
}

export const I18nServiceInstance = new I18nService();
