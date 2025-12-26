import { InputHTMLAttributes } from "react";
import { useI18n } from "../i18n/i18n.react";

export interface LabelLocalDateProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value?: string;
}

export const LabelLocalDate = (props: LabelLocalDateProps) => {
  const { value = "" } = props;
  const { localDateISOToFormattedInput } = useI18n();
  return localDateISOToFormattedInput(value);
};
