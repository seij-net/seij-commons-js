import type {
  DsFilterableField,
  DsFilterableRefField,
  DsQueryFilter,
  DsQueryFilterOperator,
  DsQueryFilters,
  DsQuerySelectFilter,
  DsQuerySelectFilterCondition,
} from "./DsQuery";
import type { DsFilterableBooleanField, DsQueryBooleanFilter } from "./type-boolean";
import { BooleanFilterRow, createDefaultBooleanFilter, isBooleanFilter } from "./type-boolean";
import type { DsQueryDecimalFilter, DsQueryDecimalOptionalFilter } from "./type-decimal";
import { createDefaultDecimalFilter, DecimalFilterRow, isDecimalFilter } from "./type-decimal";
import type { DsQueryInstantFilter, DsQueryInstantOptionalFilter } from "./type-instant";
import { createDefaultInstantFilter, InstantFilterRow, isInstantFilter } from "./type-instant";
import type { DsQueryLocalDateFilter, DsQueryLocalDateOptionalFilter } from "./type-localdate";
import { createDefaultLocalDateFilter, isLocalDateFilter, LocalDateFilterRow } from "./type-localdate";
import type { DsQueryTextFilter } from "./type-text";
import { createDefaultTextFilter, isTextFilter, TextFilterRow } from "./type-text";
import {
  conditionRequiresValues,
  createDefaultSelectFilter,
  isSelectFilter,
  SELECT_CONDITIONS,
  SelectFilterRow,
} from "./type-select";
import { useState } from "react";
import {
  Button,
  Combobox,
  makeStyles,
  Option,
  Popover,
  PopoverSurface,
  PopoverTrigger,
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
  tokens,
} from "@fluentui/react-components";
import { AddRegular, DeleteRegular, FilterRegular } from "@fluentui/react-icons";
import { useFilterRowStyles } from "./filter-row-styles";

const useStyles = makeStyles({
  filterButton: {
    position: "relative",
  },
  popoverSurface: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
    minWidth: "420px",
    padding: tokens.spacingVerticalM,
  },
  operatorRow: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    paddingBottom: tokens.spacingVerticalXS,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  addSection: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    paddingTop: tokens.spacingVerticalS,
  },
  buttonLeft: {
    justifyContent: "flex-start",
  },
});

function RefFilterRow({
  filter,
  field,
  onUpdate,
  onRemove,
}: {
  filter: DsQuerySelectFilter;
  field: DsFilterableRefField;
  onUpdate: (patch: Partial<DsQuerySelectFilter>) => void;
  onRemove: () => void;
}) {
  const styles = useFilterRowStyles();
  const [search, setSearch] = useState("");
  const needsValues = conditionRequiresValues(filter.condition);
  const conditions = SELECT_CONDITIONS.filter((condition) =>
    (field.conditions ?? SELECT_CONDITIONS.map((c) => c.value)).includes(condition.value),
  );

  const { options, selectedLabels, isPending } = field.useOptions({
    search,
    limit: 10,
    selectedValues: filter.values,
  });

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
          <TagPicker selectedOptions={filter.values} onOptionSelect={handleOptionSelect}>
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
                placeholder={isPending ? "…" : "Rechercher…"}
              />
            </TagPickerControl>
            <TagPickerList>
              {isPending ? (
                <TagPickerOption value="__loading__">Chargement…</TagPickerOption>
              ) : options.length === 0 ? (
                <TagPickerOption value="__empty__">Aucun résultat</TagPickerOption>
              ) : (
                options.map((opt) => (
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

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function DsToolbarFilterable({
  filterable,
  filters,
  onChange,
}: {
  filterable: DsFilterableField[];
  filters: DsQueryFilters;
  onChange: (filters: DsQueryFilters) => void;
}) {
  const styles = useStyles();
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");

  const closeAdding = () => {
    setAdding(false);
    setSearch("");
  };

  const addFilter = (fieldId: string) => {
    const field = filterable.find((f) => f.id === fieldId);
    if (!field) return;
    const base = { id: crypto.randomUUID(), field: fieldId };
    let newFilter: DsQueryFilter;
    if (field.type === "text") {
      newFilter = createDefaultTextFilter(base);
    } else if (field.type === "boolean") {
      newFilter = createDefaultBooleanFilter(base);
    } else if (field.type === "instant") {
      newFilter = createDefaultInstantFilter(base, field.optional ?? false);
    } else if (field.type === "localdate") {
      newFilter = createDefaultLocalDateFilter(base, field.optional ?? false);
    } else if (field.type === "decimal") {
      newFilter = createDefaultDecimalFilter(base, field.optional ?? false);
    } else if (field.type === "select") {
      newFilter = createDefaultSelectFilter({
        ...base,
        conditions: field.conditions,
      });
    } else {
      newFilter = createDefaultSelectFilter({
        ...base,
        conditions: field.conditions,
      });
    }
    onChange({ ...filters, items: [...filters.items, newFilter] });
    closeAdding();
  };

  const updateFilter = (
    id: string,
    patch:
      | Partial<DsQueryTextFilter>
      | Partial<DsQuerySelectFilter>
      | Partial<DsQueryBooleanFilter>
      | Partial<DsQueryInstantFilter>
      | Partial<DsQueryInstantOptionalFilter>
      | Partial<DsQueryLocalDateFilter>
      | Partial<DsQueryLocalDateOptionalFilter>
      | Partial<DsQueryDecimalFilter>
      | Partial<DsQueryDecimalOptionalFilter>,
  ) => {
    onChange({
      ...filters,
      items: filters.items.map((f) => (f.id === id ? ({ ...f, ...patch } as DsQueryFilter) : f)),
    });
  };

  const removeFilter = (id: string) => {
    onChange({ ...filters, items: filters.items.filter((f) => f.id !== id) });
  };

  const clearAll = () => onChange({ ...filters, items: [] });

  const term = search.trim().toLowerCase();
  const matching = filterable
    .filter((field) => field.label.toLowerCase().includes(term))
    .sort((a, b) => a.label.localeCompare(b.label, "fr", { sensitivity: "base" }));

  return (
    <Popover
      positioning="below-start"
      onOpenChange={(_, data) => {
        if (!data.open) closeAdding();
      }}
    >
      <PopoverTrigger>
        <Button appearance="subtle" icon={<FilterRegular />} className={styles.filterButton} title="Filtrer" />
      </PopoverTrigger>
      <PopoverSurface className={styles.popoverSurface}>
        {filters.items.length >= 2 && (
          <div className={styles.operatorRow}>
            <Text>Combiner avec</Text>
            <Select
              size="small"
              value={filters.operator}
              onChange={(_, data) =>
                onChange({
                  ...filters,
                  operator: data.value as DsQueryFilterOperator,
                })
              }
            >
              <option value="and">ET</option>
              <option value="or">OU</option>
            </Select>
          </div>
        )}
        {filters.items.length === 0 && (
          <Text italic size={200}>
            Aucun filtre actif
          </Text>
        )}
        {filters.items.map((filter) => {
          const field = filterable.find((f) => f.id === filter.field);
          if (!field) return null;

          if (isTextFilter(filter)) {
            return (
              <TextFilterRow
                key={filter.id}
                filter={filter}
                fieldLabel={field.label}
                onUpdate={(patch) => updateFilter(filter.id, patch)}
                onRemove={() => removeFilter(filter.id)}
              />
            );
          }

          if (isBooleanFilter(filter) && field.type === "boolean") {
            return (
              <BooleanFilterRow
                key={filter.id}
                filter={filter}
                field={field as DsFilterableBooleanField}
                onUpdate={(patch) => updateFilter(filter.id, patch)}
                onRemove={() => removeFilter(filter.id)}
              />
            );
          }

          if (isInstantFilter(filter)) {
            return (
              <InstantFilterRow
                key={filter.id}
                filter={filter}
                fieldLabel={field.label}
                onUpdate={(patch) => updateFilter(filter.id, patch)}
                onRemove={() => removeFilter(filter.id)}
              />
            );
          }

          if (isLocalDateFilter(filter)) {
            return (
              <LocalDateFilterRow
                key={filter.id}
                filter={filter}
                fieldLabel={field.label}
                onUpdate={(patch) => updateFilter(filter.id, patch)}
                onRemove={() => removeFilter(filter.id)}
              />
            );
          }

          if (isDecimalFilter(filter)) {
            return (
              <DecimalFilterRow
                key={filter.id}
                filter={filter}
                fieldLabel={field.label}
                onUpdate={(patch) => updateFilter(filter.id, patch)}
                onRemove={() => removeFilter(filter.id)}
              />
            );
          }

          if (isSelectFilter(filter) && field.type === "select") {
            return (
              <SelectFilterRow
                key={filter.id}
                filter={filter}
                field={field}
                onUpdate={(patch) => updateFilter(filter.id, patch)}
                onRemove={() => removeFilter(filter.id)}
              />
            );
          }

          if (isSelectFilter(filter) && field.type === "ref") {
            return (
              <RefFilterRow
                key={filter.id}
                filter={filter}
                field={field}
                onUpdate={(patch) => updateFilter(filter.id, patch)}
                onRemove={() => removeFilter(filter.id)}
              />
            );
          }

          return null;
        })}
        <div className={styles.addSection}>
          {adding ? (
            <Combobox
              size="small"
              freeform
              autoFocus
              placeholder="Rechercher un champ…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onOptionSelect={(_, data) => {
                if (data.optionValue) addFilter(data.optionValue);
              }}
            >
              {matching.length === 0 ? (
                <Option value="" disabled text="Aucun résultat">
                  Aucun résultat
                </Option>
              ) : (
                matching.map((field) => (
                  <Option key={field.id} value={field.id} text={field.label}>
                    {field.label}
                  </Option>
                ))
              )}
            </Combobox>
          ) : (
            <Button
              appearance="subtle"
              size="small"
              icon={<AddRegular />}
              className={styles.buttonLeft}
              onClick={() => setAdding(true)}
            >
              Ajouter un filtre
            </Button>
          )}
        </div>
        {filters.items.length > 0 && (
          <Button
            appearance="subtle"
            size="small"
            icon={<DeleteRegular />}
            className={styles.buttonLeft}
            onClick={clearAll}
          >
            Supprimer les filtres
          </Button>
        )}
      </PopoverSurface>
    </Popover>
  );
}
