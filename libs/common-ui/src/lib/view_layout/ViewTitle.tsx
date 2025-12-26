import {
  Button,
  makeStyles,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Title3,
} from "@fluentui/react-components";
import { AddSquareRegular, ArrowLeftFilled, DeleteRegular, MoreVerticalFilled } from "@fluentui/react-icons";
import { isFunction } from "lodash-es";
import { ReactNode } from "react";

export interface Action {
  id: string;
  label: string;
  icon?: "plus" | "trash";
  onClick: () => any;
  disabled?: boolean;
  type: "PRIMARY" | "SECONDARY" | "ADDITIONAL";
}

const useStyles = makeStyles({
  root: {
    display: "flex",
    align: "center",
    justify: "space-between",
    justifyContent: "center",
    height: "48px",
  },
  title: {
    flex: 1,
    display: "flex",
    alignItems: "center",
  },
  backButton: {
    flex: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  actions: {
    flex: 0,
    display: "flex",
    alignItems: "center",
  },
  moreActions: {
    flex: 0,
    display: "flex",
    alignItems: "center",
    minWidth: "48px",
    justifyContent: "flex-end",
  },
});

/**
 * Zone de titre d'une vue
 */
export function ViewTitle({
  children,
  onBack,
  actions,
}: {
  /** Titre de la vue (en tout cas ce que l'on met dans la zone de titre) */
  children: ReactNode;
  /** Si spécifié, on ajoute une fleche "back" pour revenir en arrière */
  onBack?: () => void;
  /** Liste d'actions a ajouter à droite dans la zone d'actions */
  actions?: Action[];
}) {
  const styles = useStyles();

  const displayBackButton = isFunction(onBack);
  const additionalList = (actions ?? []).filter((it) => it.type === "ADDITIONAL");
  const secondaryList = (actions ?? []).filter((it) => it.type === "SECONDARY");
  const primary = (actions ?? []).filter((it) => it.type === "PRIMARY");
  const handleBack = () => {
    if (displayBackButton && onBack) onBack();
  };
  const handleClick = async (id: string) => {
    (actions ?? []).find((it) => it.id === id)?.onClick();
  };
  return (
    <div className={styles.root}>
      {displayBackButton && (
        <div className={styles.backButton}>
          <Button icon={<ArrowLeftFilled />} appearance="subtle" onClick={handleBack} />
        </div>
      )}
      <div className={styles.title}>
        <Title3>{children}</Title3>
      </div>
      <div className={styles.actions}>
        {secondaryList.length > 0 &&
          secondaryList.map((it) => (
            <Button key={it.id} disabled={it.disabled} appearance="secondary" onClick={() => handleClick(it.id)}>
              {it.label}
            </Button>
          ))}
        {primary.length > 0 &&
          primary.map((it) => (
            <Button key={it.id} disabled={it.disabled} appearance="primary" onClick={() => handleClick(it.id)}>
              {it.label}
            </Button>
          ))}
      </div>
      <div className={styles.moreActions}>
        {additionalList.length > 0 && (
          <Menu positioning={{ autoSize: true }}>
            <MenuTrigger disableButtonEnhancement>
              <Button icon={<MoreVerticalFilled />} />
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                {additionalList.map((it) => (
                  <AdditionalActionMenuItem key={it.id} action={it} onClick={handleClick} />
                ))}
              </MenuList>
            </MenuPopover>
          </Menu>
        )}
      </div>
    </div>
  );
}

function EmptyIcon() {
  return <span />;
}

function AdditionalActionMenuItem({ action, onClick }: { action: Action; onClick: (id: string) => void }) {
  let Icon: any;
  if (action.icon === "plus") {
    Icon = AddSquareRegular;
  } else if (action.icon === "trash") {
    Icon = DeleteRegular;
  } else {
    Icon = EmptyIcon;
  }
  return (
    <MenuItem disabled={action.disabled} onClick={() => onClick(action.id)} icon={<Icon />}>
      {action.label}
    </MenuItem>
  );
}
