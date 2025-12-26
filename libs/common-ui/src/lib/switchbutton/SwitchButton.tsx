import { Switch } from "@fluentui/react-components";

export function SwitchButton({
  value,
  label,
  labelTrue,
  labelFalse,
  onValueChange,
  disabled,
}: {
  value: boolean;
  label?: string;
  labelTrue?: string;
  labelFalse?: string;
  disabled?: boolean;
  onValueChange: (next: boolean) => void;
}) {
  const handleChange = () => {
    onValueChange(!value);
  };
  const finalLabel = (value ? labelTrue : labelFalse) ?? label ?? "";
  return <Switch checked={value} onChange={handleChange} label={finalLabel} disabled={disabled} />;
}
