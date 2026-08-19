import { useState } from "react";
import {
  Button,
  Checkbox,
  Input,
  makeStyles,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  tokens,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  content: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
    width: "280px",
  },
  scrollArea: {
    maxHeight: "320px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXXS,
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
}: {
  options: DsColumnPickerOption[];
  onChange: (id: string, checked: boolean) => void;
}) {
  const [search, setSearch] = useState("");
  const [checkedFirstIds, setCheckedFirstIds] = useState<string[]>([]);
  const styles = useStyles();

  const rank = (id: string) => {
    const index = checkedFirstIds.indexOf(id);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  };

  const term = search.trim().toLowerCase();
  const visibleOptions = options
    .filter((option) => option.label.toLowerCase().includes(term))
    .map((option, index) => ({ option, index }))
    .sort((a, b) => rank(a.option.id) - rank(b.option.id) || a.index - b.index)
    .map((entry) => entry.option);

  return (
    <Popover
      withArrow
      onOpenChange={(_, data) => {
        if (data.open) {
          setSearch("");
          setCheckedFirstIds(options.filter((option) => option.checked).map((option) => option.id));
        }
      }}
    >
      <PopoverTrigger disableButtonEnhancement>
        <Button appearance="subtle">Colonnes ({options.filter((option) => option.checked).length})</Button>
      </PopoverTrigger>
      <PopoverSurface>
        <div className={styles.content}>
          <Input
            placeholder="Rechercher une colonne"
            value={search}
            onChange={(_, data) => setSearch(data.value)}
            size="small"
          />
          <div className={styles.scrollArea}>
            {visibleOptions.map((option) => (
              <Checkbox
                key={option.id}
                label={option.label}
                checked={option.checked}
                onChange={(_, data) => onChange(option.id, data.checked === true)}
              />
            ))}
          </div>
        </div>
      </PopoverSurface>
    </Popover>
  );
}
