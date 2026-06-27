import type {
  DsFilterableBooleanField,
  DsFilterableField,
  DsQueryFilter,
  DsQueryFilters,
  DsQuerySorting,
} from "./DsQuery";
import { formatTextFilterChip, isTextFilter } from "./type-text";
import { formatSelectFilterChip, isSelectFilter } from "./type-select";
import { formatBooleanFilterChip, isBooleanFilter } from "./type-boolean";
import { formatInstantFilterChip, isInstantFilter } from "./type-instant";
import { formatLocalDateFilterChip, isLocalDateFilter } from "./type-localdate";
import { formatDecimalFilterChip, isDecimalFilter } from "./type-decimal";
import { Button, makeStyles, tokens } from "@fluentui/react-components";
import { DismissRegular } from "@fluentui/react-icons";

const useStyles = makeStyles({
  row: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    paddingTop: tokens.spacingVerticalXS,
  },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXXS,
    paddingLeft: tokens.spacingHorizontalS,
    paddingRight: tokens.spacingHorizontalXXS,
    paddingTop: tokens.spacingVerticalXXS,
    paddingBottom: tokens.spacingVerticalXXS,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground3,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase200,
  },
  dismissButton: {
    minWidth: "unset",
    height: "16px",
    width: "16px",
    padding: "0",
  },
});

function formatSortChip(sort: DsQuerySorting, sortable: { id: string; label: string }[]): string {
  const label = sortable.find((s) => s.id === sort.id)?.label ?? sort.id;
  return `${label} ${sort.desc ? "↓" : "↑"}`;
}

function formatFilterChip(filter: DsQueryFilter, filterable: DsFilterableField[]): string {
  const field = filterable.find((f) => f.id === filter.field);
  const fieldLabel = field?.label ?? filter.field;

  if (isTextFilter(filter)) return formatTextFilterChip(filter, fieldLabel);

  if (isBooleanFilter(filter))
    return formatBooleanFilterChip(filter, fieldLabel, field as DsFilterableBooleanField | undefined);

  if (isInstantFilter(filter)) return formatInstantFilterChip(filter, fieldLabel);

  if (isLocalDateFilter(filter)) return formatLocalDateFilterChip(filter, fieldLabel);

  if (isDecimalFilter(filter)) return formatDecimalFilterChip(filter, fieldLabel);

  if (isSelectFilter(filter) && field?.type === "select")
    return formatSelectFilterChip(filter, fieldLabel, field.options);

  // ref — no labels available synchronously
  if (isSelectFilter(filter)) {
    const count = filter.values.length;
    if (filter.condition === "empty") return `${fieldLabel} vide`;
    if (filter.condition === "notEmpty") return `${fieldLabel} non vide`;
    if (count === 0) return `${fieldLabel} = …`;
    return `${fieldLabel} = ${count === 1 ? "1 élément" : `${count} éléments`}`;
  }

  return fieldLabel;
}

export function DsToolbarChips({
  sorting,
  filters,
  sortable,
  filterable,
  onRemoveSort,
  onRemoveFilter,
}: {
  sorting: DsQuerySorting[];
  filters: DsQueryFilters;
  sortable?: { id: string; label: string }[];
  filterable?: DsFilterableField[];
  onRemoveSort: (id: string) => void;
  onRemoveFilter: (id: string) => void;
}) {
  const styles = useStyles();
  const hasChips = sorting.length > 0 || filters.items.length > 0;
  if (!hasChips) return null;

  return (
    <div className={styles.row}>
      {sorting.map((sort) => (
        <Chip
          key={`sort-${sort.id}`}
          label={formatSortChip(sort, sortable ?? [])}
          onRemove={() => onRemoveSort(sort.id)}
        />
      ))}
      {filters.items.map((filter) => (
        <Chip
          key={`filter-${filter.id}`}
          label={formatFilterChip(filter, filterable ?? [])}
          onRemove={() => onRemoveFilter(filter.id)}
        />
      ))}
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  const styles = useStyles();
  return (
    <span className={styles.chip}>
      {label}
      <Button
        appearance="transparent"
        size="small"
        className={styles.dismissButton}
        icon={<DismissRegular fontSize={10} />}
        onClick={onRemove}
      />
    </span>
  );
}
