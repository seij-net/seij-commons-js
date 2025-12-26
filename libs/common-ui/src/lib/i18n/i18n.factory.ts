// adapter-i18next.ts (exemple d’implémentation)
import { format, formatISO, isDate, isValid, parse } from "date-fns";
import i18next from "i18next";
import ICU from "i18next-icu";
import { isString } from "lodash-es";
import { Formats, I18n, Messages } from "./i18n.types";

export const createI18nEngine = (locale: string, messages: Messages, formats: Formats): I18n => {
  const inst = i18next.createInstance();
  inst.use(ICU).init({
    debug: true,
    lng: locale,
    resources: { [locale]: { translation: messages } },
    interpolation: { escapeValue: false },
    initAsync: false,
  });

  const t = inst.getFixedT(locale);
  const dtf = (style?: string) => new Intl.DateTimeFormat(locale, (style && formats.date[style]) || undefined);
  const nf = (style?: string) => new Intl.NumberFormat(locale, (style && formats.number[style]) || undefined);
  const lf = (style?: string) =>
    new Intl.ListFormat(locale, (style && formats.list[style]) || { type: "conjunction", style: "long" });
  const rtf = () => new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  return {
    t(id, values) {
      console.log(inst);
      return t(id, values);
    },
    rich(id, values) {
      return t(id, values);
    },
    formatDate(d, style) {
      return dtf(style).format(d);
    },
    formatNumber(n, style) {
      return nf(style).format(n);
    },
    formatList(items, style) {
      return lf(style).format(items);
    },
    formatRelative(d) {
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
      return rtf().format(value, unit as Intl.RelativeTimeFormatUnit);
    },
    localDatePlaceholder: formats.localdate.placeholder,
    localDateInputMask: formats.localdate.inputmask,
    localDateFormattedToISO: (str: string) => localDateFormattedToISO(str, formats.localdate.inputmask),
    localDateISOToFormattedInput: (str: string) => localDateISOToFormattedInput(str, formats.localdate.inputmask),
    monthList: getMonthNames(locale),
    getLocale() {
      return locale;
    },
  };
};

function localDateFormattedToISO(str: string, inputMask: string): string {
  const parsed = parse(
    str,
    inputMask,
    new Date(),
    // { locale: fr }
  );
  if (!isDate(parsed) || !isValid(parsed)) return "";
  return formatISO(parsed, { representation: "date" });
}

const localDateISOToFormattedInput = (str: string, inputMask: string): string => {
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
};
function getMonthNames(locale: string): { code: number; label: string }[] {
  const formatter = new Intl.DateTimeFormat(locale, { month: "long" });
  const months = Array.from({ length: 12 }, (_, i) => formatter.format(new Date(2000, i, 1)));
  return months.map((i, index) => ({ code: index + 1, label: i }));
}
