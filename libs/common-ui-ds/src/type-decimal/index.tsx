import { Button, Input, Select, Text } from "@fluentui/react-components";
import { DeleteRegular } from "@fluentui/react-icons";
import { useFilterRowStyles } from "../filter-row-styles";

export type DsQueryDecimalFilterCondition = "gt" | "gte" | "lt" | "lte" | "eq" | "between";
export type DsQueryDecimalOptionalFilterCondition =
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "eq"
  | "between"
  | "empty"
  | "notEmpty";

export type DsQueryDecimalFilter = {
  id: string;
  type: "decimal";
  field: string;
  condition: DsQueryDecimalFilterCondition;
  value?: number;
  valueTo?: number;
};

export type DsQueryDecimalOptionalFilter = {
  id: string;
  type: "decimalOptional";
  field: string;
  condition: DsQueryDecimalOptionalFilterCondition;
  value?: number;
  valueTo?: number;
};

export type DsFilterableDecimalField = {
  id: string;
  label: string;
  type: "decimal";
  optional?: boolean;
};

const DECIMAL_CONDITIONS: {
  value: DsQueryDecimalFilterCondition;
  label: string;
}[] = [
  { value: "gt", label: ">" },
  { value: "gte", label: ">=" },
  { value: "lt", label: "<" },
  { value: "lte", label: "<=" },
  { value: "eq", label: "=" },
  { value: "between", label: "entre" },
];

const DECIMAL_OPTIONAL_CONDITIONS: {
  value: DsQueryDecimalOptionalFilterCondition;
  label: string;
}[] = [
  { value: "gt", label: ">" },
  { value: "gte", label: ">=" },
  { value: "lt", label: "<" },
  { value: "lte", label: "<=" },
  { value: "eq", label: "=" },
  { value: "between", label: "entre" },
  { value: "empty", label: "est vide" },
  { value: "notEmpty", label: "n'est pas vide" },
];

export function DecimalFilterRow({
  filter,
  fieldLabel,
  onUpdate,
  onRemove,
}: {
  filter: DsQueryDecimalFilter | DsQueryDecimalOptionalFilter;
  fieldLabel: string;
  onUpdate: (patch: Partial<DsQueryDecimalFilter> | Partial<DsQueryDecimalOptionalFilter>) => void;
  onRemove: () => void;
}) {
  const styles = useFilterRowStyles();
  const conditions = filter.type === "decimalOptional" ? DECIMAL_OPTIONAL_CONDITIONS : DECIMAL_CONDITIONS;
  const needsValue = filter.condition !== "empty" && filter.condition !== "notEmpty";
  return (
    <div className={styles.filterRow}>
      <Text className={styles.fieldLabel}>{fieldLabel}</Text>
      <Select
        size="small"
        value={filter.condition}
        onChange={(_, data) =>
          onUpdate({
            condition: data.value as DsQueryDecimalFilterCondition | DsQueryDecimalOptionalFilterCondition,
            value: undefined,
            valueTo: undefined,
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
            type="number"
            size="small"
            className={styles.filterValue}
            value={filter.value?.toString() ?? ""}
            onChange={(_, data) =>
              onUpdate({
                value: data.value === "" ? undefined : Number(data.value),
              })
            }
          />
          {filter.condition === "between" && (
            <Input
              type="number"
              size="small"
              className={styles.filterValue}
              value={filter.valueTo?.toString() ?? ""}
              onChange={(_, data) =>
                onUpdate({
                  valueTo: data.value === "" ? undefined : Number(data.value),
                })
              }
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

export function isDecimalFilter(f: { type: string }): f is DsQueryDecimalFilter | DsQueryDecimalOptionalFilter {
  return f.type === "decimal" || f.type === "decimalOptional";
}

export function createDefaultDecimalFilter(
  base: { id: string; field: string },
  optional: boolean,
): DsQueryDecimalFilter | DsQueryDecimalOptionalFilter {
  return optional
    ? { ...base, type: "decimalOptional", condition: "gt", value: undefined }
    : { ...base, type: "decimal", condition: "gt", value: undefined };
}

export function formatDecimalFilterChip(
  filter: DsQueryDecimalFilter | DsQueryDecimalOptionalFilter,
  fieldLabel: string,
): string {
  switch (filter.condition) {
    case "gt":
      return `${fieldLabel} > ${filter.value ?? "..."}`;
    case "gte":
      return `${fieldLabel} >= ${filter.value ?? "..."}`;
    case "lt":
      return `${fieldLabel} < ${filter.value ?? "..."}`;
    case "lte":
      return `${fieldLabel} <= ${filter.value ?? "..."}`;
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
