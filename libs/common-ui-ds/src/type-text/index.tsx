import { Button, Input, Select, Text } from "@fluentui/react-components";
import { DeleteRegular } from "@fluentui/react-icons";
import { useFilterRowStyles } from "../filter-row-styles";

export type DsQueryTextFilterCondition =
  | "contains"
  | "eq"
  | "empty"
  | "notEmpty";

export type DsQueryTextFilter = {
  id: string;
  type: "text";
  field: string;
  condition: DsQueryTextFilterCondition;
  value: string;
};

export type DsFilterableTextField = {
  id: string;
  label: string;
  type: "text";
};

const TEXT_CONDITIONS: { value: DsQueryTextFilterCondition; label: string }[] =
  [
    { value: "contains", label: "contient" },
    { value: "eq", label: "est" },
    { value: "empty", label: "est vide" },
    { value: "notEmpty", label: "n'est pas vide" },
  ];

export function TextFilterRow({
  filter,
  fieldLabel,
  onUpdate,
  onRemove,
}: {
  filter: DsQueryTextFilter;
  fieldLabel: string;
  onUpdate: (patch: Partial<DsQueryTextFilter>) => void;
  onRemove: () => void;
}) {
  const styles = useFilterRowStyles();
  const needsValue =
    filter.condition !== "empty" && filter.condition !== "notEmpty";
  return (
    <div className={styles.filterRow}>
      <Text className={styles.fieldLabel}>{fieldLabel}</Text>
      <Select
        size="small"
        value={filter.condition}
        onChange={(_, data) =>
          onUpdate({
            condition: data.value as DsQueryTextFilterCondition,
            value: "",
          })
        }
      >
        {TEXT_CONDITIONS.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </Select>
      {needsValue && (
        <Input
          size="small"
          className={styles.filterValue}
          value={filter.value}
          onChange={(_, data) => onUpdate({ value: data.value })}
        />
      )}
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

export function isTextFilter(f: { type: string }): f is DsQueryTextFilter {
  return f.type === "text";
}

export function createDefaultTextFilter(base: {
  id: string;
  field: string;
}): DsQueryTextFilter {
  return { ...base, type: "text", condition: "contains", value: "" };
}

export function formatTextFilterChip(
  filter: DsQueryTextFilter,
  fieldLabel: string,
): string {
  switch (filter.condition) {
    case "contains":
      return `${fieldLabel} ~ "${filter.value}"`;
    case "eq":
      return `${fieldLabel} = "${filter.value}"`;
    case "empty":
      return `${fieldLabel} vide`;
    case "notEmpty":
      return `${fieldLabel} non vide`;
  }
}
