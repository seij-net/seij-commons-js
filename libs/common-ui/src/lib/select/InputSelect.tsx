import { Caption1, Select } from "@fluentui/react-components";

export interface InputSelectOption {
  code: string;
  label: string;
  description?: string | null | undefined;
}
export interface InputSelectProps<T extends InputSelectOption> {
  id?: string;
  /** Le code de la valeur sélectionnée. */
  value: string;
  /** Indique si le champ est désactivé */
  disabled?: boolean;
  /** La liste des options à afficher dans la liste déroulante. */
  options: T[];
  /** La fonction à appeler lorsque la valeur sélectionnée change. */
  onValueChange: (value: string) => void;
}
/**
 * Une combobox de sélection d'entrée avec une liste déroulante d'options.
 * @returns Un composant de combobox de sélection (sans saisie de texte possible).
 */
export function InputSelect<T extends InputSelectOption>({
  id,
  value,
  disabled = false,
  options,
  onValueChange,
}: InputSelectProps<T>) {
  const description = options.find((it) => it.code === value)?.description;
  return (
    <div>
      <Select
        id={id}
        value={value}
        onChange={(ev, data) => {
          onValueChange(data.value ?? "");
        }}
        disabled={disabled}
      >
        {options.map((o) => (
          <option key={o.code} value={o.code}>
            {o.label}
          </option>
        ))}
      </Select>
      {description && (
        <div>
          <Caption1>{description}</Caption1>
        </div>
      )}
    </div>
  );
}
