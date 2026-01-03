import { makeStyles, tokens, Tooltip } from "@fluentui/react-components";
import { User } from "./TitleBar";
import { ReactNode } from "react";
import { NavigationTreeItem, NavigationTreeItemGroup, NavigationTreeItemPage, UserStatus } from "@seij/common-ui";
import { PanelLeftContract } from "./ApplicationShellPanelContract";
import { Icon, IconName, parseIconName } from "@seij/common-ui-icons";

const useStylesRailboxItem = makeStyles({
  container: {
    display: "flex",
    textAlign: "center",
    width: "32px",
    height: "32px",
    alignItems: "center",
    alignContent: "center",
    "& > div": {
      width: "100%",
    },
    "&:hover": {
      cursor: "pointer",
      backgroundColor: tokens.colorNeutralBackground4Hover,
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
  return (
    <div
      style={{
        backgroundColor: tokens.colorNeutralBackground4,
        width: "48px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "start",
          paddingTop: "0.5em",
        }}
      >
        <RailBoxApplicationIcon applicationIcon={applicationIcon} onClick={onClickHome} />
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "start",
        }}
      >
        {navigationItems.map((it) => (
          <RailBoxNavigationItem key={it.id} item={it} onClick={onClickMenuItem} />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "start",
        }}
      >
        <User status={userStatus} />
        <RailBoxPanelLeftExpand onClick={onClickSidebarExpand} />
      </div>
    </div>
  );
}

const RailBoxApplicationIcon = ({ applicationIcon, onClick }: { applicationIcon?: ReactNode; onClick: () => void }) => {
  const styles = useStylesRailboxItem();
  return (
    <div className={styles.container} onClick={() => onClick()}>
      <Tooltip content={"Home"} relationship="description">
        <span>{applicationIcon ? applicationIcon : <Icon name={"dashboard"} />}</span>
      </Tooltip>
    </div>
  );
};
const RailBoxPanelLeftExpand = ({ onClick }: { onClick: () => void }) => {
  const styles = useStylesRailboxItem();
  return (
    <div className={styles.container} onClick={() => onClick()}>
      <PanelLeftContract panelState={"rails"} onClick={onClick} />
    </div>
  );
};
const RailBoxNavigationItem = ({ item, onClick }: { item: NavigationTreeItem; onClick: (id: string) => void }) => {
  const styles = useStylesRailboxItem();
  if (item.type === "divider") return null;
  if (item.type === "group") {
    const nav = item as NavigationTreeItemGroup;
    const iconName: IconName | undefined = nav.icon ? parseIconName(nav.icon) : undefined;
    return (
      <div key={nav.id} className={styles.container} onClick={() => onClick(nav.id)}>
        <Tooltip content={nav.label} relationship="description">
          {iconName && <Icon name={iconName} />}
        </Tooltip>
      </div>
    );
  }
  if (item.type === "page") {
    const nav = item as NavigationTreeItemPage;
    if (nav.parentId !== null) return null;
    const iconName: IconName | undefined = nav.icon ? parseIconName(nav.icon) : undefined;
    return (
      <Tooltip content={nav.label} relationship="description">
        <div key={nav.id} className={styles.container} onClick={() => onClick(nav.id)}>
          <div>{iconName && <Icon name={iconName} />}</div>
        </div>
      </Tooltip>
    );
  }
  return null;
};
