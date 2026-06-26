import { useState } from "react";
import {
  Button,
  Select,
  Tag,
  TagPicker,
  TagPickerControl,
  TagPickerGroup,
  TagPickerInput,
  TagPickerList,
  TagPickerOption,
  type TagPickerProps,
  Text,
} from "@fluentui/react-components";
import { DeleteRegular } from "@fluentui/react-icons";
import { useFilterRowStyles } from "../filter-row-styles";

export type DsQuerySelectFilterCondition =
  | "anyOf"
  | "allOf"
  | "noneOf"
  | "empty"
  | "notEmpty";

export type DsQuerySelectFilter = {
  id: string;
  type: "select";
  field: string;
  condition: DsQuerySelectFilterCondition;
  values: string[];
};

export type DsFilterableSelectField = {
  id: string;
  label: string;
  type: "select";
  options: { value: string; label: string }[];
  conditions?: DsQuerySelectFilterCondition[];
};

export const SELECT_CONDITIONS: {
  value: DsQuerySelectFilterCondition;
  label: string;
}[] = [
  { value: "anyOf", label: "est l'un de" },
  { value: "allOf", label: "est tous" },
  { value: "noneOf", label: "n'est aucun de" },
  { value: "empty", label: "est vide" },
  { value: "notEmpty", label: "n'est pas vide" },
];

export function conditionRequiresValues(condition: string): boolean {
  return condition !== "empty" && condition !== "notEmpty";
}

export function SelectFilterRow({
  filter,
  field,
  onUpdate,
  onRemove,
}: {
  filter: DsQuerySelectFilter;
  field: DsFilterableSelectField;
  onUpdate: (patch: Partial<DsQuerySelectFilter>) => void;
  onRemove: () => void;
}) {
  const styles = useFilterRowStyles();
  const [search, setSearch] = useState("");
  const needsValues = conditionRequiresValues(filter.condition);
  const conditions = SELECT_CONDITIONS.filter((condition) =>
    (field.conditions ?? SELECT_CONDITIONS.map((c) => c.value)).includes(
      condition.value,
    ),
  );

  const filteredOptions = field.options.filter(
    (opt) => !search || opt.label.toLowerCase().includes(search.toLowerCase()),
  );
  const selectedLabels = filter.values.map((v) => ({
    value: v,
    label: field.options.find((o) => o.value === v)?.label ?? v,
  }));

  const handleOptionSelect: TagPickerProps["onOptionSelect"] = (_, data) => {
    onUpdate({ values: data.selectedOptions });
    setSearch("");
  };

  return (
    <div className={styles.filterRow}>
      <Text className={styles.fieldLabel}>{field.label}</Text>
      <Select
        size="small"
        value={filter.condition}
        onChange={(_, data) =>
          onUpdate({
            condition: data.value as DsQuerySelectFilterCondition,
            values: [],
          })
        }
      >
        {conditions.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </Select>
      {needsValues && (
        <div className={styles.filterValue}>
          <TagPicker
            selectedOptions={filter.values}
            onOptionSelect={handleOptionSelect}
          >
            <TagPickerControl>
              <TagPickerGroup>
                {selectedLabels.map(({ value, label }) => (
                  <Tag key={value} value={value} shape="circular" size="small">
                    {label}
                  </Tag>
                ))}
              </TagPickerGroup>
              <TagPickerInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </TagPickerControl>
            <TagPickerList>
              {filteredOptions.length === 0 ? (
                <TagPickerOption value="__empty__">
                  Aucun résultat
                </TagPickerOption>
              ) : (
                filteredOptions.map((opt) => (
                  <TagPickerOption key={opt.value} value={opt.value}>
                    {opt.label}
                  </TagPickerOption>
                ))
              )}
            </TagPickerList>
          </TagPicker>
        </div>
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

export function isSelectFilter(f: { type: string }): f is DsQuerySelectFilter {
  return f.type === "select";
}

export function createDefaultSelectFilter(base: {
  id: string;
  field: string;
  conditions?: DsQuerySelectFilterCondition[];
}): DsQuerySelectFilter {
  return {
    id: base.id,
    field: base.field,
    type: "select",
    condition: base.conditions?.[0] ?? "anyOf",
    values: [],
  };
}

export function formatSelectFilterChip(
  filter: DsQuerySelectFilter,
  fieldLabel: string,
  options: { value: string; label: string }[],
): string {
  const getValueLabels = () => {
    if (filter.values.length === 0) return "…";
    return filter.values
      .map((v) => options.find((o) => o.value === v)?.label ?? v)
      .join(", ");
  };

  switch (filter.condition) {
    case "anyOf":
      return `${fieldLabel} = ${getValueLabels()}`;
    case "noneOf":
      return `${fieldLabel} ≠ ${getValueLabels()}`;
    case "allOf":
      return `${fieldLabel} = ${getValueLabels()}`;
    case "empty":
      return `${fieldLabel} vide`;
    case "notEmpty":
      return `${fieldLabel} non vide`;
  }
}
