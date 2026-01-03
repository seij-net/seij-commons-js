import {
  AppItem,
  Hamburger,
  NavDrawer,
  NavDrawerBody,
  NavDrawerFooter,
  NavDrawerHeader,
  Tooltip,
} from "@fluentui/react-components";
import { Navigation, NavigationTreeItem, UserStatus } from "@seij/common-ui";
import { User } from "./TitleBar";
import { PanelLeftContract } from "./ApplicationShellPanelContract";
import { ReactNode } from "react";

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
      <NavDrawerHeader>
        {isMobile ? (
          <Tooltip content="Navigation" relationship="label">
            <Hamburger onClick={onClickHamburger} />
          </Tooltip>
        ) : null}
        <AppItem onClick={onClickHome} icon={<span>{applicationIcon}</span>}>
          {applicationName}
        </AppItem>
      </NavDrawerHeader>
      <NavDrawerBody>
        <Navigation items={navigationItems} />
      </NavDrawerBody>
      <NavDrawerFooter>
        <div style={{ display: "flex" }}>
          <User status={userStatus} />
          {isMobile ? null : <PanelLeftContract panelState={"expanded"} onClick={onClickPanelReduce} />}
        </div>
      </NavDrawerFooter>
    </NavDrawer>
  );
}
