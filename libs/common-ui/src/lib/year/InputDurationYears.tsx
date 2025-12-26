import React from "react";
import { InputNumber, InputNumberProps } from "../number/InputNumber";
import { useI18n } from "../i18n/i18n.react";

export interface InputDurationYearProps extends InputNumberProps {}

/**
 * Un input special annee.
 */
export const InputDurationYears: React.FC<InputDurationYearProps> = (props) => {
  const { ...other } = props;
  const { t } = useI18n();
  const unit = t("InputDurationYears_unit");
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
