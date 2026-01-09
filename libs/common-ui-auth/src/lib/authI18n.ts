import { I18nServiceInstance, useI18n } from "@seij/common-ui";
import { Messages } from "../locales/Messages";
import { messages as fr } from "../locales/fr";
import { messages as en } from "../locales/en";

const namespace = "common-ui-auth";
I18nServiceInstance.registerNamespace(namespace, { fr: fr, en: en });

export function useAuthI18n() {
  const i18n = useI18n();
  return {
    t: (key: keyof Messages, values?: Record<string, unknown>) => i18n.t(namespace + ":" + key, values),
  };
}
