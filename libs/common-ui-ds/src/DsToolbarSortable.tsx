import type { DsQuerySorting } from "./DsQuery";
import { useState } from "react";
import {
  Button,
  makeStyles,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Select,
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

  const toggleDirection = (index: number) => {
    onChange(sorting.map((s, i) => (i === index ? { ...s, desc: !s.desc } : s)));
  };

  const removeCriterion = (index: number) => {
    onChange(sorting.filter((_, i) => i !== index));
  };

  const addCriterion = (id: string) => {
    if (sorting.some((s) => s.id === id)) return;
    onChange([...sorting, { id, desc: false }]);
    setAdding(false);
  };

  const clearAll = () => onChange([]);

  const usedIds = new Set(sorting.map((s) => s.id));
  const available = sortable.filter((f) => !usedIds.has(f.id));
  const labelFor = (id: string) => sortable.find((f) => f.id === id)?.label ?? id;

  return (
    <Popover
      positioning="below-start"
      onOpenChange={(_, data) => {
        if (!data.open) setAdding(false);
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
              <Select
                size="small"
                defaultValue=""
                onChange={(_, data) => {
                  if (data.value) addCriterion(data.value);
                }}
              >
                <option value="" disabled>
                  Choisir un champ…
                </option>
                {available.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.label}
                  </option>
                ))}
              </Select>
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
