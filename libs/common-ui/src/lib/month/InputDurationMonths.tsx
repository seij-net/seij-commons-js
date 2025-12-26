import React from "react";
import { InputNumber, InputNumberProps } from "../number/InputNumber";
import { useI18n } from "../i18n/i18n.react";

export interface InputDurationMonthsProps extends InputNumberProps {}

/**
 * Permet de saisir une duree en mois.
 */
export const InputDurationMonths: React.FC<InputDurationMonthsProps> = (props) => {
  const { ...other } = props;
  const { t } = useI18n();
  const unit = t("InputDurationMonths_unit");
  return (
    <InputNumber
      decimalScale={0}
      allowNegative={false}
      inputMode="numeric"
      thousandSeparator={false}
      size={4}
      unit={unit}
      {...other}
    />
  );
};
