import { createCurrency, format, NumberFormatDecimal } from "@seij/common-types";

import { isNil } from "lodash-es";
import { useContext } from "react";
import { toCurrencySymbolSafe } from "../commons/currencysymbol";
import { DeviseContext } from "../devise/DeviseContext";

/**
 * Affiche un montant sous la forme d'un nombre décimal
 */
export const LabelMoneyDec = ({
  value,
  sign,
  zeroblank = false,
  currency,
  per,
}: {
  /**
   * Valeur à afficher
   */
  value: number;
  /**
   * Affiche le signe + ou -
   *
   * pas obligatoire, par défaut "auto". Si "auto" affiche un signe uniquement si négatif,
   * sinon affiche toujours le signe + ou -
   */
  sign?: "auto" | "always";
  /**
   * Affiche ou pas les zero
   *
   * pas oblgatoire, par défaut "false". Si "true" et que la valeur est zero, alors n'affiche rien
   */
  zeroblank?: boolean;
  /**
   * Devise à afficher
   */
  currency?: string;
  /**
   * Unité de référence pour le montant, indiquant à quoi il s'applique.
   * Exemples : "mois", "colis", "jh", "tranche" → pour afficher "123 € / mois".
   * Optionnelle – à laisser vide si la valeur n'est pas exprimée par unité.
   */
  per?: string;
}) => {
  const deviseContext = useContext(DeviseContext);
  if (zeroblank && value === 0) return null;

  const currencySymbol = toCurrencySymbolSafe(currency);
  const currencyFinal = createCurrency(currencySymbol, per, deviseContext, "€");
  return <>{isNil(value) ? "" : format(value, NumberFormatDecimal, currencyFinal, sign)}</>;
};
