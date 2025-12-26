import React from "react";
import { InputNumber, InputNumberProps } from "../number/InputNumber";
import { isNil } from "lodash-es";

export interface InputPercentProps extends InputNumberProps {}

/**
 * Un input special annee.
 */
export const InputPercent: React.FC<InputPercentProps> = (props) => {
  const { min, max, onValueChange, value, defaultValue, ...other } = props;

  const handleValueChange = (value: number | null | undefined) => {
    if (value === null || value === undefined) {
      onValueChange?.(0);
    } else {
      onValueChange?.(Number((value / 100).toFixed(4)));
    }
  };

  return (
    <InputNumber
      {...other}
      decimalScale={2}
      allowNegative={false}
      inputMode="decimal"
      thousandSeparator={false}
      size={9}
      unit={"%"}
      min={min ? Number((min * 100).toFixed(2)) : undefined}
      max={max ? Number((max * 100).toFixed(2)) : undefined}
      value={isNil(value) ? value : Number((value * 100).toFixed(2))}
      defaultValue={isNil(defaultValue) ? defaultValue : Number((defaultValue * 100).toFixed(2))}
      onValueChange={handleValueChange}
    />
  );
};
