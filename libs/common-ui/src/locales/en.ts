import { Formats } from "../lib/i18n";
import { ModuleMessages } from "./interfaces";

const locale: { messages: ModuleMessages; formats: Formats } = {
  messages: {
    errorbox_unknown_error: "Unknown error: {error}",
    errorbox_unknown_error_status: "could not find error status.",
    InputDurationMonths_unit: "months",
    InputDurationYears_unit: "years",
    InputSelect_select: "Select",
    InputCombobox_noresult: "No result",
    ListView_search: "Search",
    ListView_no_result: "No result",
  },
  formats: {
    localdate: {
      placeholder: "mm/dd/yyyy",
      inputmask: "MM/dd/yyyy",
    },
    date: {
      short: { dateStyle: "short" }, // 12/08/2025
      medium: { dateStyle: "medium" }, // 12 août 2025
      datetime: { dateStyle: "medium", timeStyle: "short" }, // 12 août 2025 à 14:05
    },
    number: {
      currency: { style: "currency", currency: "EUR", currencyDisplay: "symbol" },
      compact: { notation: "compact" }, // 1,2 M
    },
    list: {
      and: { style: "short", type: "conjunction" }, // pommes, poires et bananes
      or: { style: "short", type: "disjunction" }, // pommes, poires ou bananes
    },
  },
};
export default locale;
