import { Month } from "@seij/common-types";
import React, { useMemo } from "react";
import { useI18n } from "../i18n";
import { InputSelect } from "../select/InputSelect";

type HTMLInputElementCurated = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "value" | "defaultValue" | "onChange" | "children"
>;

export interface InputMonthProps extends HTMLInputElementCurated {
  value: Month;
  onValueChange: (value: Month) => unknown;
}

/**
 * Permet de saisir un mois.
 */
export const InputMonth: React.FC<InputMonthProps> = (props) => {
  const { value, onValueChange, required, ...other } = props;
  const { monthList, t } = useI18n();
  const options = useMemo(() => {
    const months = monthList().map((it) => ({ code: "" + it.code, label: it.label }));
    const emptyValueSelect = t("InputSelect_select");
    return [{ code: "", label: "-- " + emptyValueSelect + " --" }, ...months];
  }, [monthList, t]);

  return (
    <InputSelect options={options} value={"" + value} onValueChange={(v) => onValueChange(parseInt(v))} {...other} />
  );
};
