import { Button, Select, Text } from "@fluentui/react-components";
import { DeleteRegular } from "@fluentui/react-icons";
import { useFilterRowStyles } from "../filter-row-styles";

export type DsQueryBooleanFilterCondition = "eq";

export type DsQueryBooleanFilter = {
  id: string;
  type: "boolean";
  field: string;
  condition: DsQueryBooleanFilterCondition;
  value: boolean;
};

export type DsFilterableBooleanField = {
  id: string;
  label: string;
  type: "boolean";
  trueLabel?: string;
  falseLabel?: string;
};

const BOOLEAN_CONDITIONS: {
  value: string;
  label: string;
}[] = [
  { value: "true", label: "Oui" },
  { value: "false", label: "Non" },
];

export function BooleanFilterRow({
  filter,
  field,
  onUpdate,
  onRemove,
}: {
  filter: DsQueryBooleanFilter;
  field: DsFilterableBooleanField;
  onUpdate: (patch: Partial<DsQueryBooleanFilter>) => void;
  onRemove: () => void;
}) {
  const styles = useFilterRowStyles();
  const conditions =
    field.trueLabel || field.falseLabel
      ? [
          { value: "true", label: field.trueLabel ?? "Oui" },
          { value: "false", label: field.falseLabel ?? "Non" },
        ]
      : BOOLEAN_CONDITIONS;
  return (
    <div className={styles.filterRow}>
      <Text className={styles.fieldLabel}>{field.label}</Text>
      <Select
        size="small"
        value={filter.value ? "true" : "false"}
        onChange={(_, data) =>
          onUpdate({ condition: "eq", value: data.value === "true" })
        }
      >
        {conditions.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </Select>
      <Button
        appearance="subtle"
        size="small"
        icon={<DeleteRegular />}
        title="Supprimer ce filtre"
        onClick={onRemove}
      />
    </div>
  );
}

export function isBooleanFilter(f: {
  type: string;
}): f is DsQueryBooleanFilter {
  return f.type === "boolean";
}

export function createDefaultBooleanFilter(base: {
  id: string;
  field: string;
}): DsQueryBooleanFilter {
  return { ...base, type: "boolean", condition: "eq", value: true };
}

export function formatBooleanFilterChip(
  filter: DsQueryBooleanFilter,
  fieldLabel: string,
  field?: DsFilterableBooleanField,
): string {
  const trueLabel = field?.trueLabel ?? "Oui";
  const falseLabel = field?.falseLabel ?? "Non";
  return `${fieldLabel} = ${filter.value ? trueLabel : falseLabel}`;
}
