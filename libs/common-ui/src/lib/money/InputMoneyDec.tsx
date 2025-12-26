import React, { useContext } from "react";
import { InputNumber, InputNumberProps } from "../number/InputNumber";
import { DeviseContext } from "../devise/DeviseContext";
import { createCurrency } from "@seij/common-types";

export interface InputMoneyDecProps extends InputNumberProps {
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
  allowNegative?: boolean;
}

/**
 * Un input special annee.
 */
export const InputMoneyDec: React.FC<InputMoneyDecProps> = (props) => {
  const { currency, per, allowNegative, ...other } = props;
  const deviseContext = useContext(DeviseContext);
  const currencyFinal = createCurrency(currency, per, deviseContext, "€");
  return (
    <InputNumber
      decimalScale={2}
      allowNegative={allowNegative ?? false}
      inputMode="decimal"
      thousandSeparator={false}
      size={9}
      unit={currencyFinal}
      {...other}
    />
  );
};
