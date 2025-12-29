import { Input, makeStyles } from "@fluentui/react-components";
import { LocalDate } from "@seij/common-types";
import { forwardRef, InputHTMLAttributes, useCallback, useEffect, useState } from "react";
import { Rifm } from "rifm";
import { useI18n } from "../i18n/i18n.react";

const useStyles = makeStyles({
  root: {
    width: "8em",
    "> input": {
      textAlign: "right",
    },
  },
});

const parseDigits = (string: string): string => (string.match(/\d+/g) || []).join("");
const formatDate = (string: string): string => {
  const digits = parseDigits(string);
  const chars = digits.split("");
  return chars.reduce((r, v, index) => (index === 2 || index === 4 ? `${r}/${v}` : `${r}${v}`), "").substr(0, 10);
};

const formatDateWithAppend = (string: string): string => {
  const res = formatDate(string);

  if (string.endsWith("/")) {
    if (res.length === 2) {
      return `${res}/`;
    }

    if (res.length === 5) {
      return `${res}/`;
    }
  }
  return res;
};
const appendHyphen = (v: string): string => (v.length === 2 || v.length === 5 ? `${v}/` : v);

/**
 * Input field for local dates with automatic adding of /
 * Values are in ISO8601 date part only
 *
 * Controlled component only
 *
 * @param props same props as an input
 * @return {JSX.Element}
 */
export interface InputLocalDateProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value?: string;
  onValueChange?: (value: LocalDate) => void;
}

export const InputLocalDate = forwardRef<HTMLInputElement, InputLocalDateProps>((props, ref) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onValueChange, value = "", children, size, defaultValue, type, ...delegatedProps } = props;
  const classNames = useStyles();
  const { localDatePlaceholder, localDateFormattedToISO, localDateISOToFormattedInput } = useI18n();
  const [formattedA, setFormattedA] = useState(localDateISOToFormattedInput(value));
  const [normalizedValue, setNormalizedValue] = useState(value);

  useEffect(() => {
    if (value !== normalizedValue) {
      setNormalizedValue(value);
      setFormattedA(localDateISOToFormattedInput(value));
    }
  });

  const handleChange = useCallback(
    (inputValue: string) => {
      setFormattedA(inputValue);
      const parsed = localDateFormattedToISO(inputValue);
      if (parsed !== normalizedValue) {
        setNormalizedValue(parsed);
        if (onValueChange) onValueChange(parsed);
      }
    },
    [setFormattedA, normalizedValue, setNormalizedValue, onValueChange, localDateFormattedToISO],
  );
  return (
    <Rifm
      accept={/\d+/g}
      mask={10 <= formattedA.length}
      format={formatDateWithAppend}
      append={appendHyphen}
      value={formattedA}
      onChange={handleChange}
    >
      {({ value, onChange }) => (
        <Input
          placeholder={localDatePlaceholder()}
          className={classNames.root}
          value={value}
          onChange={onChange}
          ref={ref}
          {...delegatedProps}
        />
      )}
    </Rifm>
  );
});
