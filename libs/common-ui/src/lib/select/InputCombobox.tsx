import { Combobox, type ComboboxProps, useComboboxFilter } from "@fluentui/react-components";
import { useState } from "react";
import { useI18n } from "../i18n";

export interface InputComboboxProps<T> {
  /**
   * The value of the text input.
   */
  searchQuery: string;
  /**
   * The placeholder text to display when the input is empty.
   */
  placeholder: string;
  /**
   * Indicates whether the input is disabled.
   */
  disabled: boolean;
  /**
   * The list of options to display in the dropdown.
   */
  options: T[];
  /**
   * The message to display when no option is found.
   */
  noOptionsMessage?: string;
  /**
   * The function to call when the input value changes.
   */
  onValueChangeQuery: (value: string) => void;
  /**
   * The function to call when the user selects an option from the dropdown.
   */
  onValueChange: (value: string) => void;
  /**
   * Called when the user presses Enter inside the combobox input.
   */
  onEnter?: () => void;
}
/**
 * A text input combobox with a dropdown list of options.
 * @returns A textbox component with a dropdown list of options.
 * @example
 * <InputCombobox
 *   searchQuery={searchQuery}
 *   placeholder="Select an option"
 *   disabled={false}
 *   options={[{ code: "1", label: "Option 1" }, { code: "2", label: "Option 2" }]}
 *   noOptionsMessage="No options found"
 *   onValueChangeQuery={(value) => setSearchQuery(value)}
 *   onValueChange={(value) => setSelectedOption(value)}
 *   onEnter={()=>{}}
 * />
 */
export function InputCombobox<T extends { code: string; label: string }>({
  searchQuery,
  placeholder,
  disabled,
  options,
  noOptionsMessage,
  onValueChangeQuery,
  onValueChange,
  onEnter,
}: InputComboboxProps<T>) {
  const { t } = useI18n();

  // Some keyboards used to compose characters in languages as Japaneses send and event
  // that tells that the user is composing a character. We must take that in account
  // when managing the Enter key
  const [isComposing, setIsComposing] = useState(false);

  const noresult = t("InputCombobox_noresult");

  const handleOptionSelect: ComboboxProps["onOptionSelect"] = (_, data) => {
    onValueChangeQuery(data.optionText ?? "");
    onValueChange(data.optionValue ?? "");
  };

  return (
    <Combobox
      style={{ width: "100%" }}
      value={searchQuery}
      onOptionSelect={handleOptionSelect}
      onChange={(ev) => onValueChangeQuery(ev.target.value)}
      onCompositionStart={() => setIsComposing(true)}
      onCompositionEnd={() => setIsComposing(false)}
      onKeyDown={(event) => {
        if (event.key === "Enter" && !isComposing) {
          onEnter?.();
        }
      }}
      clearable
      placeholder={placeholder}
      disabled={disabled}
      freeform={true}
    >
      {useComboboxFilter(
        searchQuery,
        options.map((o) => ({ children: o.label, value: o.code })),
        {
          optionToReactKey: (option) => option.value,
          optionToText: (option) => option.children,
          noOptionsMessage: noOptionsMessage ?? noresult,
        },
      )}
    </Combobox>
  );
}
