import type { DsQuerySnapshot, DsQueryStorage } from "./DsQuery";
import { useState } from "react";
import {
  Button,
  Input,
  makeStyles,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Text,
  tokens,
} from "@fluentui/react-components";
import { ArrowResetRegular, BookmarkFilled, BookmarkRegular, DeleteRegular, SaveRegular } from "@fluentui/react-icons";

const useStyles = makeStyles({
  button: {
    position: "relative",
  },
  surface: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
    minWidth: "220px",
    padding: tokens.spacingVerticalM,
  },
  sectionTitle: {
    color: tokens.colorNeutralForeground3,
    paddingBottom: tokens.spacingVerticalXS,
  },
  savedRow: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
  },
  savedLabel: {
    flex: 1,
    cursor: "pointer",
    ":hover": { color: tokens.colorBrandForeground1 },
  },
  divider: {
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    marginTop: tokens.spacingVerticalXS,
    marginBottom: tokens.spacingVerticalXS,
  },
  saveRow: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
  },
  buttonLeft: {
    justifyContent: "flex-start",
  },
});

export function DsToolbarSavedFilters({
  queryStorage,
  queryDefaults,
  currentSnapshot,
  onApply,
  activeFilterName,
}: {
  queryStorage: DsQueryStorage;
  queryDefaults?: DsQuerySnapshot;
  currentSnapshot: DsQuerySnapshot;
  onApply: (snapshot: DsQuerySnapshot, name?: string) => void;
  activeFilterName: string | null;
}) {
  const styles = useStyles();
  const [savedFilters, setSavedFilters] = useState(() => queryStorage.listSavedQueries());
  const [savingName, setSavingName] = useState<string | null>(null);

  const handleSave = () => {
    if (!savingName?.trim()) return;
    queryStorage.saveNamedQuery(savingName.trim(), currentSnapshot);
    setSavedFilters(queryStorage.listSavedQueries());
    setSavingName(null);
  };

  const handleDelete = (name: string) => {
    queryStorage.deleteNamedQuery(name);
    setSavedFilters(queryStorage.listSavedQueries());
  };

  const handleReset = () => {
    onApply(
      queryDefaults ?? {
        sorting: [],
        filters: { operator: "and", items: [] },
      },
    );
  };

  return (
    <Popover
      positioning="below-start"
      onOpenChange={(_, data) => {
        if (!data.open) setSavingName(null);
      }}
    >
      <PopoverTrigger>
        <Button
          appearance="subtle"
          icon={activeFilterName ? <BookmarkFilled /> : <BookmarkRegular />}
          className={styles.button}
          title="Filtres enregistrés"
        >
          {activeFilterName ?? null}
        </Button>
      </PopoverTrigger>
      <PopoverSurface className={styles.surface}>
        {savedFilters.length === 0 ? (
          <Text italic size={200} className={styles.sectionTitle}>
            Aucun filtre enregistré
          </Text>
        ) : (
          <>
            <Text size={200} className={styles.sectionTitle}>
              Filtres enregistrés
            </Text>
            {savedFilters.map(({ name, query }) => (
              <div key={name} className={styles.savedRow}>
                <Text className={styles.savedLabel} onClick={() => onApply(query, name)}>
                  {name}
                </Text>
                <Button
                  appearance="subtle"
                  size="small"
                  icon={<DeleteRegular />}
                  title="Supprimer"
                  onClick={() => handleDelete(name)}
                />
              </div>
            ))}
          </>
        )}
        <div className={styles.divider} />
        {savingName === null ? (
          <Button
            appearance="subtle"
            size="small"
            icon={<SaveRegular />}
            className={styles.buttonLeft}
            onClick={() => setSavingName("")}
          >
            Enregistrer les filtres actuels
          </Button>
        ) : (
          <div className={styles.saveRow}>
            <Input
              size="small"
              placeholder="Nom…"
              value={savingName}
              autoFocus
              onChange={(_, data) => setSavingName(data.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") setSavingName(null);
              }}
            />
            <Button size="small" appearance="primary" onClick={handleSave}>
              OK
            </Button>
            <Button size="small" onClick={() => setSavingName(null)}>
              ✕
            </Button>
          </div>
        )}
        {queryDefaults && (
          <Button
            appearance="subtle"
            size="small"
            icon={<ArrowResetRegular />}
            className={styles.buttonLeft}
            onClick={handleReset}
          >
            Réinitialiser
          </Button>
        )}
      </PopoverSurface>
    </Popover>
  );
}
