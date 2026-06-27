import { Button, Input, Select, Text } from "@fluentui/react-components";
import { DeleteRegular } from "@fluentui/react-icons";
import { useFilterRowStyles } from "../filter-row-styles";

export type DsQueryLocalDateFilterCondition = "lt" | "gt" | "eq" | "between";
export type DsQueryLocalDateOptionalFilterCondition = "lt" | "gt" | "eq" | "between" | "empty" | "notEmpty";

export type DsQueryLocalDateFilter = {
  id: string;
  type: "localdate";
  field: string;
  condition: DsQueryLocalDateFilterCondition;
  value?: string;
  valueTo?: string;
};

export type DsQueryLocalDateOptionalFilter = {
  id: string;
  type: "localdateOptional";
  field: string;
  condition: DsQueryLocalDateOptionalFilterCondition;
  value?: string;
  valueTo?: string;
};

export type DsFilterableLocalDateField = {
  id: string;
  label: string;
  type: "localdate";
  optional?: boolean;
};

const LOCALDATE_CONDITIONS: {
  value: DsQueryLocalDateFilterCondition;
  label: string;
}[] = [
  { value: "lt", label: "avant" },
  { value: "gt", label: "après" },
  { value: "eq", label: "est" },
  { value: "between", label: "entre" },
];

const LOCALDATE_OPTIONAL_CONDITIONS: {
  value: DsQueryLocalDateOptionalFilterCondition;
  label: string;
}[] = [
  { value: "lt", label: "avant" },
  { value: "gt", label: "après" },
  { value: "eq", label: "est" },
  { value: "between", label: "entre" },
  { value: "empty", label: "est vide" },
  { value: "notEmpty", label: "n'est pas vide" },
];

export function LocalDateFilterRow({
  filter,
  fieldLabel,
  onUpdate,
  onRemove,
}: {
  filter: DsQueryLocalDateFilter | DsQueryLocalDateOptionalFilter;
  fieldLabel: string;
  onUpdate: (patch: Partial<DsQueryLocalDateFilter> | Partial<DsQueryLocalDateOptionalFilter>) => void;
  onRemove: () => void;
}) {
  const styles = useFilterRowStyles();
  const conditions = filter.type === "localdateOptional" ? LOCALDATE_OPTIONAL_CONDITIONS : LOCALDATE_CONDITIONS;
  const needsValue = filter.condition !== "empty" && filter.condition !== "notEmpty";

  return (
    <div className={styles.filterRow}>
      <Text className={styles.fieldLabel}>{fieldLabel}</Text>
      <Select
        size="small"
        value={filter.condition}
        onChange={(_, data) =>
          onUpdate({
            condition: data.value as DsQueryLocalDateFilterCondition | DsQueryLocalDateOptionalFilterCondition,
            value: "",
            valueTo: "",
          })
        }
      >
        {conditions.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </Select>
      {needsValue && (
        <>
          <Input
            type="date"
            size="small"
            className={styles.filterValue}
            value={filter.value ?? ""}
            onChange={(_, data) => onUpdate({ value: data.value })}
          />
          {filter.condition === "between" && (
            <Input
              type="date"
              size="small"
              className={styles.filterValue}
              value={filter.valueTo ?? ""}
              onChange={(_, data) => onUpdate({ valueTo: data.value })}
            />
          )}
        </>
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

export function isLocalDateFilter(f: { type: string }): f is DsQueryLocalDateFilter | DsQueryLocalDateOptionalFilter {
  return f.type === "localdate" || f.type === "localdateOptional";
}

export function createDefaultLocalDateFilter(
  base: { id: string; field: string },
  optional: boolean,
): DsQueryLocalDateFilter | DsQueryLocalDateOptionalFilter {
  return optional
    ? { ...base, type: "localdateOptional", condition: "lt", value: "" }
    : { ...base, type: "localdate", condition: "lt", value: "" };
}

export function formatLocalDateFilterChip(
  filter: DsQueryLocalDateFilter | DsQueryLocalDateOptionalFilter,
  fieldLabel: string,
): string {
  switch (filter.condition) {
    case "lt":
      return `${fieldLabel} < ${filter.value ?? "..."}`;
    case "gt":
      return `${fieldLabel} > ${filter.value ?? "..."}`;
    case "eq":
      return `${fieldLabel} = ${filter.value ?? "..."}`;
    case "between":
      return `${fieldLabel} entre ${filter.value ?? "..."} et ${filter.valueTo ?? "..."}`;
    case "empty":
      return `${fieldLabel} vide`;
    case "notEmpty":
      return `${fieldLabel} non vide`;
  }
}
