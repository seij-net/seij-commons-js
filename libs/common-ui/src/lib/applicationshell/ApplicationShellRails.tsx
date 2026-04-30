import { makeStyles, tokens, Tooltip } from "@fluentui/react-components";
import { ReactNode } from "react";
import { NavigationTreeItem, NavigationTreeItemGroup, NavigationTreeItemPage, UserStatus } from "@seij/common-ui";
import { PanelLeftContract } from "./ApplicationShellPanelContract";
import { Icon, IconName, parseIconName } from "@seij/common-ui-icons";
import { User } from "./User";

const useStyles = makeStyles({
  root: {
    backgroundColor: tokens.colorNeutralBackground4,
    width: "48px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: tokens.spacingVerticalXS,
  },
  topSection: {
    paddingTop: tokens.spacingVerticalS,
  },
  navSection: {
    flex: 1,
    paddingTop: tokens.spacingVerticalS,
  },
  bottomSection: {
    paddingBottom: tokens.spacingVerticalS,
  },
  item: {
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.borderRadiusMedium,
    "&:hover": {
      cursor: "pointer",
      backgroundColor: tokens.colorNeutralBackground4Hover,
    },
  },
  icon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  panelButton: {
    "& button": {
      width: "32px",
      minWidth: "32px",
      height: "32px",
      padding: "0",
    },
  },
});

export function Rails({
  applicationIcon,
  navigationItems,
  userStatus,
  onClickHome,
  onClickMenuItem,
  onClickSidebarExpand,
}: {
  applicationIcon?: ReactNode;
  navigationItems: NavigationTreeItem[];
  userStatus: UserStatus;
  onClickHome: () => void;
  onClickMenuItem: (id: string) => void;
  onClickSidebarExpand: () => void;
}) {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <div className={`${styles.section} ${styles.topSection}`}>
        <RailBoxApplicationIcon applicationIcon={applicationIcon} onClick={onClickHome} />
        <RailBoxPanelLeftExpand onClick={onClickSidebarExpand} />
      </div>
      <div className={`${styles.section} ${styles.navSection}`}>
        {navigationItems.map((it) => (
          <RailBoxNavigationItem key={it.id} item={it} onClick={onClickMenuItem} />
        ))}
      </div>
      <div className={`${styles.section} ${styles.bottomSection}`}>
        <RailItem>
          <User status={userStatus} variant="icon" />
        </RailItem>
      </div>
    </div>
  );
}

const RailItem = ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => {
  const styles = useStyles();
  return (
    <div className={styles.item} onClick={onClick}>
      {children}
    </div>
  );
};

const RailBoxApplicationIcon = ({ applicationIcon, onClick }: { applicationIcon?: ReactNode; onClick: () => void }) => {
  const styles = useStyles();
  return (
    <Tooltip content="Home" relationship="description">
      <RailItem onClick={onClick}>
        <span className={styles.icon}>{applicationIcon ? applicationIcon : <Icon name="dashboard" />}</span>
      </RailItem>
    </Tooltip>
  );
};
const RailBoxPanelLeftExpand = ({ onClick }: { onClick: () => void }) => {
  const styles = useStyles();
  return (
    <RailItem>
      <div className={styles.panelButton}>
        <PanelLeftContract panelState="rails" onClick={onClick} />
      </div>
    </RailItem>
  );
};
const RailBoxNavigationItem = ({ item, onClick }: { item: NavigationTreeItem; onClick: (id: string) => void }) => {
  if (item.type === "divider") return null;
  if (item.type === "group") {
    const nav = item as NavigationTreeItemGroup;
    const iconName: IconName | undefined = nav.icon ? parseIconName(nav.icon) : undefined;
    return (
      <Tooltip content={nav.label} relationship="description">
        <RailItem onClick={() => onClick(nav.id)}>{iconName && <Icon name={iconName} />}</RailItem>
      </Tooltip>
    );
  }
  if (item.type === "page") {
    const nav = item as NavigationTreeItemPage;
    if (nav.parentId !== null) return null;
    const iconName: IconName | undefined = nav.icon ? parseIconName(nav.icon) : undefined;
    return (
      <Tooltip content={nav.label} relationship="description">
        <RailItem onClick={() => onClick(nav.id)}>{iconName && <Icon name={iconName} />}</RailItem>
      </Tooltip>
    );
  }
  return null;
};
