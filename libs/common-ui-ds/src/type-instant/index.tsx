import { Button, Input, Select, Text } from "@fluentui/react-components";
import { DeleteRegular } from "@fluentui/react-icons";
import { useFilterRowStyles } from "../filter-row-styles";

export type DsQueryInstantFilterCondition = "lt" | "gt" | "eq" | "between";
export type DsQueryInstantOptionalFilterCondition = "lt" | "gt" | "eq" | "between" | "empty" | "notEmpty";

export type DsQueryInstantFilter = {
  id: string;
  type: "instant";
  field: string;
  condition: DsQueryInstantFilterCondition;
  value?: string;
  valueTo?: string;
};

export type DsQueryInstantOptionalFilter = {
  id: string;
  type: "instantOptional";
  field: string;
  condition: DsQueryInstantOptionalFilterCondition;
  value?: string;
  valueTo?: string;
};

export type DsFilterableInstantField = {
  id: string;
  label: string;
  type: "instant";
  optional?: boolean;
};

const INSTANT_CONDITIONS: {
  value: DsQueryInstantFilterCondition;
  label: string;
}[] = [
  { value: "lt", label: "avant" },
  { value: "gt", label: "après" },
  { value: "eq", label: "est" },
  { value: "between", label: "entre" },
];

const INSTANT_OPTIONAL_CONDITIONS: {
  value: DsQueryInstantOptionalFilterCondition;
  label: string;
}[] = [
  { value: "lt", label: "avant" },
  { value: "gt", label: "après" },
  { value: "eq", label: "est" },
  { value: "between", label: "entre" },
  { value: "empty", label: "est vide" },
  { value: "notEmpty", label: "n'est pas vide" },
];

export function InstantFilterRow({
  filter,
  fieldLabel,
  onUpdate,
  onRemove,
}: {
  filter: DsQueryInstantFilter | DsQueryInstantOptionalFilter;
  fieldLabel: string;
  onUpdate: (patch: Partial<DsQueryInstantFilter> | Partial<DsQueryInstantOptionalFilter>) => void;
  onRemove: () => void;
}) {
  const styles = useFilterRowStyles();
  const conditions = filter.type === "instantOptional" ? INSTANT_OPTIONAL_CONDITIONS : INSTANT_CONDITIONS;
  const needsValue = filter.condition !== "empty" && filter.condition !== "notEmpty";
  return (
    <div className={styles.filterRow}>
      <Text className={styles.fieldLabel}>{fieldLabel}</Text>
      <Select
        size="small"
        value={filter.condition}
        onChange={(_, data) =>
          onUpdate({
            condition: data.value as DsQueryInstantFilterCondition | DsQueryInstantOptionalFilterCondition,
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
            type="datetime-local"
            size="small"
            className={styles.filterValue}
            value={filter.value ?? ""}
            onChange={(_, data) => onUpdate({ value: data.value })}
          />
          {filter.condition === "between" && (
            <Input
              type="datetime-local"
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

export function isInstantFilter(f: { type: string }): f is DsQueryInstantFilter | DsQueryInstantOptionalFilter {
  return f.type === "instant" || f.type === "instantOptional";
}

export function createDefaultInstantFilter(
  base: { id: string; field: string },
  optional: boolean,
): DsQueryInstantFilter | DsQueryInstantOptionalFilter {
  return optional
    ? { ...base, type: "instantOptional", condition: "lt", value: "" }
    : { ...base, type: "instant", condition: "lt", value: "" };
}

export function formatInstantFilterChip(
  filter: DsQueryInstantFilter | DsQueryInstantOptionalFilter,
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
