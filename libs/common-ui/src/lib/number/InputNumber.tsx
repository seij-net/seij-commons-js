import { Input, InputProps, makeStyles } from "@fluentui/react-components";
import React, { useEffect, useMemo } from "react";

type HTMLInputElementCurated = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange" | "type" | "min" | "max" | "children"
>;
export interface InputNumberProps extends HTMLInputElementCurated {
  id?: string;
  name?: string;
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  onValueChange?: (value: number) => void;

  unit?: InputProps["contentAfter"];
}

export const INPUT_AMOUNT_ALLOWED_DECIMAL_SEPARATORS = [",", "."];

interface InputNumberCompletProps extends InputNumberProps {
  decimalScale?: number;
  allowNegative?: boolean;
  thousandSeparator?: string | boolean;
}

const createRegexp = (allowNegative: boolean, decimalScale: number, thousandSeparator: string | boolean) => {
  return new RegExp(
    "^" +
      (allowNegative ? "-?" : "") +
      "\\d*" +
      (decimalScale > 0 ? "((\\.|,)\\d{0," + decimalScale + "})?" : "") +
      "$",
  );
};

const useStyles = makeStyles({
  root: {
    "> input": {
      textAlign: "right",
    },
  },
});

export const InputNumber: React.FC<InputNumberCompletProps> = ({
  value,
  defaultValue,
  onValueChange,
  decimalScale = 0,
  allowNegative = false,
  thousandSeparator = " ",
  min,
  max,
  size = 10,
  unit,
  ...rest
}: InputNumberCompletProps) => {
  const [internalValue, setInternalValue] = React.useState<string>(value?.toString() ?? "");
  const styles = useStyles();

  if (value === undefined && defaultValue === undefined) {
    console.warn("InputNumber must be provided a value or a defaultValue");
  }
  if (value !== undefined && defaultValue !== undefined) {
    console.warn(
      "InputNumber can not be used as a controlled and uncontrolled component at the same time. You muse provide a value or a defaultValue but not both at the same time.",
    );
  }

  // Toujours permettre d'écrire librement (même vide, -, . etc.)
  const rex = useMemo(
    () => createRegexp(allowNegative, decimalScale, thousandSeparator),
    [allowNegative, decimalScale, thousandSeparator],
  );

  useEffect(() => {
    // Synchroniser l'état interne si la prop change de l'extérieur
    setInternalValue(value?.toString() ?? "");
  }, [value]);

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = ev.target.value;

    if (rex.test(newValue) || newValue === "") {
      setInternalValue(newValue);

      if (newValue === "") {
        onValueChange?.(0);
        return;
      }

      const parsed = Number(newValue);
      if (!isNaN(parsed)) {
        let clamped = parsed;
        if (min !== undefined) clamped = Math.max(clamped, min);
        if (max !== undefined) clamped = Math.min(clamped, max);
        if (clamped !== value) {
          onValueChange?.(clamped);
        }
      }
    }
  };

  const handleBlur = () => {
    if (internalValue === "") {
      onValueChange?.(0);
      return;
    }

    const parsed = Number(internalValue);
    if (!isNaN(parsed)) {
      let clamped = parsed;
      if (min !== undefined) clamped = Math.max(clamped, min);
      if (max !== undefined) clamped = Math.min(clamped, max);
      // IMPORTANT: on recale l'affichage après blur
      setInternalValue(clamped.toString());
      onValueChange?.(clamped);
    } else {
      onValueChange?.(0);
    }
  };

  return (
    <Input
      {...rest}
      className={styles.root}
      type="number"
      value={internalValue}
      onChange={handleChange}
      onBlur={handleBlur}
      inputMode={decimalScale > 0 ? "decimal" : "numeric"}
      pattern={rex.source}
      onFocus={(e) => e.target.select()}
      contentAfter={unit}
    />
  );
};
