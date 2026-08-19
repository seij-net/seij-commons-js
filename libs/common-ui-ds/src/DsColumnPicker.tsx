import { useState } from "react";
import {
  Button,
  Checkbox,
  Input,
  makeStyles,
  mergeClasses,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Text,
  tokens,
} from "@fluentui/react-components";
import { ArrowDownRegular, ArrowUpRegular } from "@fluentui/react-icons";

const useStyles = makeStyles({
  content: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
    width: "280px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXXS,
  },
  sectionTitle: {
    color: tokens.colorNeutralForeground3,
  },
  scrollArea: {
    maxHeight: "320px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXXS,
  },
  displayedRow: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXXS,
  },
  displayedLabel: {
    minWidth: 0,
  },
  displayedActions: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXXS,
    marginLeft: "auto",
  },
  separator: {
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    paddingTop: tokens.spacingVerticalXS,
  },
});

export interface DsColumnPickerOption {
  id: string;
  label: string;
  checked: boolean;
}

export function DsColumnPicker({
  options,
  onChange,
  onMove,
}: {
  options: DsColumnPickerOption[];
  onChange: (id: string, checked: boolean) => void;
  onMove: (id: string, direction: "up" | "down") => void;
}) {
  const [search, setSearch] = useState("");
  const styles = useStyles();

  /** Checked options keep the order given by the caller: that is the table order. */
  const displayed = options.filter((option) => option.checked);

  /**
   * Only the available columns are searchable and alphabetically sorted. Filtering the
   * displayed ones would make the up/down buttons move a column relative to a list the
   * user cannot see.
   */
  const term = search.trim().toLowerCase();
  const available = options
    .filter((option) => !option.checked && option.label.toLowerCase().includes(term))
    .sort((a, b) => a.label.localeCompare(b.label, "fr", { sensitivity: "base" }));

  return (
    <Popover
      withArrow
      onOpenChange={(_, data) => {
        if (data.open) setSearch("");
      }}
    >
      <PopoverTrigger disableButtonEnhancement>
        <Button appearance="subtle">Colonnes ({displayed.length})</Button>
      </PopoverTrigger>
      <PopoverSurface>
        <div className={styles.content}>
          <div className={styles.section}>
            <Text size={200} className={styles.sectionTitle}>
              Affichées
            </Text>
            {displayed.length === 0 ? (
              <Text italic size={200}>
                Aucune colonne affichée
              </Text>
            ) : (
              <div className={styles.scrollArea}>
                {displayed.map((option, index) => (
                  <div key={option.id} className={styles.displayedRow}>
                    <Checkbox
                      className={styles.displayedLabel}
                      label={option.label}
                      checked
                      onChange={(_, data) => onChange(option.id, data.checked === true)}
                    />
                    <div className={styles.displayedActions}>
                      <Button
                        appearance="subtle"
                        size="small"
                        icon={<ArrowUpRegular />}
                        title="Déplacer vers la gauche"
                        disabled={index === 0}
                        onClick={() => onMove(option.id, "up")}
                      />
                      <Button
                        appearance="subtle"
                        size="small"
                        icon={<ArrowDownRegular />}
                        title="Déplacer vers la droite"
                        disabled={index === displayed.length - 1}
                        onClick={() => onMove(option.id, "down")}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={mergeClasses(styles.section, styles.separator)}>
            <Text size={200} className={styles.sectionTitle}>
              Disponibles
            </Text>
            <Input
              placeholder="Rechercher une colonne"
              value={search}
              onChange={(_, data) => setSearch(data.value)}
              size="small"
            />
            {available.length === 0 ? (
              <Text italic size={200}>
                Aucun résultat
              </Text>
            ) : (
              <div className={styles.scrollArea}>
                {available.map((option) => (
                  <Checkbox
                    key={option.id}
                    label={option.label}
                    checked={false}
                    onChange={(_, data) => onChange(option.id, data.checked === true)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </PopoverSurface>
    </Popover>
  );
}
