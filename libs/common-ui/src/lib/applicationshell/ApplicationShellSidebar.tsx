import {
  Hamburger,
  makeStyles,
  NavDrawer,
  NavDrawerBody,
  NavDrawerFooter,
  NavDrawerHeader,
  tokens,
  Tooltip,
} from "@fluentui/react-components";
import { Navigation, NavigationTreeItem, UserStatus } from "@seij/common-ui";
import { PanelLeftContract } from "./ApplicationShellPanelContract";
import { ReactNode } from "react";
import { User } from "./User";

const useStyles = makeStyles({
  // Override style of FluentUI header
  headerDrawer: {
    marginRight: 0,
    paddingRight: tokens.spacingHorizontalS,
  },
  // For the content inside headerDrawer, used to align boxes
  headerContent: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    gap: tokens.spacingHorizontalXS,
    boxSizing: "border-box",
  },
  appButton: {
    flex: 1,
    minWidth: 0,
    minHeight: "40px",
    display: "inline-flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalM,
    border: "0",
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: "transparent",
    color: "inherit",
    font: "inherit",
    textAlign: "left",
    cursor: "pointer",
    ":hover": {
      backgroundColor: tokens.colorSubtleBackgroundHover,
    },
    ":active": {
      backgroundColor: tokens.colorSubtleBackgroundPressed,
    },
  },
  appIcon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  appTitle: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontWeight: tokens.fontWeightSemibold,
  },
  closePanelButton: {
    flexShrink: 0,
  },
  // We do that to cancel FluentUI margins that are wrong
  footerDrawer: {
    padding: "0",
  },
  // Content inside footerDrawer
  footerContent: {
    display: "flex",
    width: "100%",
    boxSizing: "border-box",
    paddingInline: tokens.spacingHorizontalS,
    paddingBlock: tokens.spacingVerticalS,
  },
  userAction: {
    flex: 1,
    minWidth: 0,
    ":hover": {
      backgroundColor: tokens.colorSubtleBackgroundHover,
      cursor: "pointer",
    },
    ":active": {
      backgroundColor: tokens.colorSubtleBackgroundPressed,
    },
  },
});

export function Sidebar({
  selectedItem,
  isMobile,
  applicationName,
  drawerOpen,
  openedCategories,
  applicationIcon,
  userStatus,
  navigationItems,
  onClickHome,
  onClickMenuItem,
  onClickCategory,
  onClickHamburger,
  onClickPanelReduce,
}: {
  isMobile: boolean;
  drawerOpen: boolean;
  selectedItem: string;
  applicationName: string;
  applicationIcon?: ReactNode;
  openedCategories: string[];
  navigationItems: NavigationTreeItem[];
  userStatus: UserStatus;
  onClickHome: () => void;
  onClickMenuItem: (id: string) => void;
  onClickCategory: (id: string) => void;
  onClickHamburger: () => void;
  onClickPanelReduce: () => void;
}) {
  const styles = useStyles();

  return (
    <NavDrawer
      selectedValue={selectedItem}
      open={(isMobile && drawerOpen) || !isMobile}
      density={"small"}
      type={isMobile ? "overlay" : "inline"}
      openCategories={openedCategories}
      onNavItemSelect={(e, data) => {
        onClickMenuItem(data.value);
      }}
      onNavCategoryItemToggle={(e, data) => {
        onClickCategory(data.categoryValue ?? "");
      }}
    >
      <NavDrawerHeader className={styles.headerDrawer}>
        <div className={styles.headerContent}>
          {isMobile ? (
            <Tooltip content="Navigation" relationship="label">
              <Hamburger onClick={onClickHamburger} />
            </Tooltip>
          ) : null}
          <button type="button" className={styles.appButton} onClick={onClickHome}>
            <span className={styles.appIcon}>{applicationIcon}</span>
            <span className={styles.appTitle}>{applicationName}</span>
          </button>
          {isMobile ? null : (
            <div className={styles.closePanelButton}>
              <PanelLeftContract panelState={"expanded"} onClick={onClickPanelReduce} />
            </div>
          )}
        </div>
      </NavDrawerHeader>
      <NavDrawerBody>
        <Navigation items={navigationItems} />
      </NavDrawerBody>
      <NavDrawerFooter className={styles.footerDrawer}>
        <div className={styles.footerContent}>
          <div className={styles.userAction}>
            <User status={userStatus} variant="full" />
          </div>
        </div>
      </NavDrawerFooter>
    </NavDrawer>
  );
}
