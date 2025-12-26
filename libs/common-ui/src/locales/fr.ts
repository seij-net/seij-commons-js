import { Formats } from "../lib/i18n";
import { ModuleMessages } from "./interfaces";

const locale: { messages: ModuleMessages; formats: Formats } = {
  messages: {
    errorbox_unknown_error: "Erreur inconnue : {error}",
    errorbox_unknown_error_status: "numéro de status d'erreur non trouvé.",
    InputDurationMonths_unit: "mois",
    InputDurationYears_unit: "ans",
    InputSelect_select: "Sélectionnez",
    InputCombobox_noresult: "Aucun résultat",
    ListView_search: "Rechercher",
    ListView_no_result: "Aucun résultat",
  },
  formats: {
    localdate: {
      placeholder: "jj/mm/aaaa",
      inputmask: "dd/MM/yyyy",
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
