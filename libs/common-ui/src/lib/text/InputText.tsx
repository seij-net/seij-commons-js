import { Input } from "@fluentui/react-components";
import { isNil } from "lodash-es";
import { ChangeEventHandler } from "react";
export interface InputTextProps {
  value: string;
  maxLength?: number;
  disabled?: boolean;
  placeholder?: string;
  onValueChange: (value: string) => void;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  autoComplete?: string | undefined | null;
}
export function InputText({
  value,
  maxLength,
  disabled,
  placeholder,
  onValueChange,
  onChange,
  autoComplete = "nope",
}: InputTextProps) {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const v = e.currentTarget.value;
    if (v !== value) onValueChange(v);
    if (v !== value && onChange) onChange(e);
  };
  const autoCompleteCompat = isNil(autoComplete) ? "nope" : autoComplete === "" ? "nope" : autoComplete;
  return (
    <Input
      autoComplete={autoCompleteCompat}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      onChange={handleChange}
      maxLength={maxLength}
    />
  );
}
