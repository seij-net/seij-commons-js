import React from "react";
import { InputNumber, InputNumberProps } from "../number/InputNumber";

export interface InputYearProps extends InputNumberProps {}

/**
 * Permet de saisir une année.
 */
export const InputYear: React.FC<InputYearProps> = (props) => {
  const { ...other } = props;

  return (
    <InputNumber
      decimalScale={0}
      allowNegative={false}
      inputMode="numeric"
      thousandSeparator={false}
      size={4}
      unit={"année"}
      {...other}
    />
  );
};
