import type { DsQuerySorting } from "./DsQuery";
import { useState } from "react";
import {
  Button,
  Combobox,
  makeStyles,
  Option,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Text,
  tokens,
} from "@fluentui/react-components";
import {
  AddRegular,
  ArrowSortDownRegular,
  ArrowSortUpRegular,
  ArrowSortRegular,
  DeleteRegular,
  DismissRegular,
} from "@fluentui/react-icons";

const useStyles = makeStyles({
  sortButton: {
    position: "relative",
  },
  popoverSurface: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
    minWidth: "220px",
    padding: tokens.spacingVerticalM,
  },
  sortRow: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
  },
  sortLabel: {
    flex: 1,
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

export function DsToolbarSortable({
  sortable,
  sorting,
  onChange,
}: {
  sortable: { id: string; label: string }[];
  sorting: DsQuerySorting[];
  onChange: (sorting: DsQuerySorting[]) => void;
}) {
  const styles = useStyles();
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");

  const toggleDirection = (index: number) => {
    onChange(sorting.map((s, i) => (i === index ? { ...s, desc: !s.desc } : s)));
  };

  const removeCriterion = (index: number) => {
    onChange(sorting.filter((_, i) => i !== index));
  };

  const closeAdding = () => {
    setAdding(false);
    setSearch("");
  };

  const addCriterion = (id: string) => {
    if (sorting.some((s) => s.id === id)) return;
    onChange([...sorting, { id, desc: false }]);
    closeAdding();
  };

  const clearAll = () => onChange([]);

  const usedIds = new Set(sorting.map((s) => s.id));
  const available = sortable.filter((f) => !usedIds.has(f.id));
  const term = search.trim().toLowerCase();
  const matching = available
    .filter((f) => f.label.toLowerCase().includes(term))
    .sort((a, b) => a.label.localeCompare(b.label, "fr", { sensitivity: "base" }));
  const labelFor = (id: string) => sortable.find((f) => f.id === id)?.label ?? id;

  return (
    <Popover
      positioning="below-start"
      onOpenChange={(_, data) => {
        if (!data.open) closeAdding();
      }}
    >
      <PopoverTrigger>
        <Button appearance="subtle" icon={<ArrowSortRegular />} className={styles.sortButton} title="Trier" />
      </PopoverTrigger>
      <PopoverSurface className={styles.popoverSurface}>
        {sorting.length === 0 ? (
          <Text italic size={200}>
            Aucun tri actif
          </Text>
        ) : (
          sorting.map((criterion, index) => (
            <div key={criterion.id} className={styles.sortRow}>
              <Text className={styles.sortLabel}>{labelFor(criterion.id)}</Text>
              <Button
                appearance="subtle"
                size="small"
                icon={criterion.desc ? <ArrowSortDownRegular /> : <ArrowSortUpRegular />}
                title={criterion.desc ? "Décroissant" : "Croissant"}
                onClick={() => toggleDirection(index)}
              />
              <Button
                appearance="subtle"
                size="small"
                icon={<DismissRegular />}
                title="Supprimer ce critère"
                onClick={() => removeCriterion(index)}
              />
            </div>
          ))
        )}
        {available.length > 0 && (
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
                  if (data.optionValue) addCriterion(data.optionValue);
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
                Ajouter un tri
              </Button>
            )}
          </div>
        )}
        {sorting.length > 0 && (
          <Button
            appearance="subtle"
            size="small"
            icon={<DeleteRegular />}
            className={styles.buttonLeft}
            onClick={clearAll}
          >
            Supprimer le tri
          </Button>
        )}
      </PopoverSurface>
    </Popover>
  );
}
