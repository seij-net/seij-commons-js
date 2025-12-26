import React, { useContext } from "react";
import { InputNumber, InputNumberProps } from "../number/InputNumber";

import { DeviseContext } from "../devise/DeviseContext";
import { createCurrency } from "@seij/common-types";
export interface InputMoneyIntProps extends InputNumberProps {
  /**
   * Devise à afficher.
   *
   * Si renseignée, elle est prise en compte sinon on prend la devise du contexte.
   * Pour ne pas afficher du tout la devise, il faut passer une chaîne vide.
   * Exemples : "EUR", "USD", "GBP" → pour afficher "123 €".
   * Si la devise est renseignée, elle est affichée à la fin du montant.
   */
  currency?: string;
  /**
   * Unité de référence pour le montant, indiquant à quoi il s'applique.
   * Exemples : "mois", "colis", "jh", "tranche" → pour afficher "123 € / mois".
   * Optionnelle – à laisser vide si la valeur n'est pas exprimée par unité.
   */
  per?: string;
}

/**
 * Un input special annee.
 */
export const InputMoneyInt: React.FC<InputMoneyIntProps> = (props) => {
  const { currency, per, ...other } = props;

  const deviseContext = useContext(DeviseContext);
  const currencyFinal = createCurrency(currency, per, deviseContext, "€");

  return (
    <InputNumber
      decimalScale={0}
      allowNegative={false}
      inputMode="numeric"
      thousandSeparator={false}
      size={9}
      unit={currencyFinal}
      {...other}
    />
  );
};
