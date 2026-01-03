import { makeStyles, tokens } from "@fluentui/react-components";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { NavigationTreeItem } from "../navigation/Navigation.types";
import { createNavigationTreeItemServiceImpl } from "../navigation/NavigationService";
import { UserStatus } from "./ApplicationShell.types";
import { TitleBar } from "./TitleBar";
import { useIsMobile } from "../responsive/useMobile";
import { Rails } from "./ApplicationShellRails";
import { Sidebar } from "./ApplicationShellSidebar";
import { MenuBurger } from "./ApplicationShellHamburger";

const useApplicationShellStyles = makeStyles({
  shell: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  titleBar: {
    width: "100%",
    height: "48px",
    flex: 0,
  },
  main: {
    overflow: "hidden",
    display: "flex",
    height: "100%",
  },
  content: {
    flex: "1",
    display: "bloc",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    overflow: "auto",
    backgroundColor: tokens.colorNeutralBackground2,
  },
});

/**
 * Props for the `ApplicationShell` layout component.
 *
 * The shell renders a persistent left navigation (Fluent UI `NavDrawer`), a top `TitleBar`,
 * and your main application content. It also wires navigation events so the currently
 * selected item reflects the browser URL and clicking items triggers navigation.
 */
export interface ApplicationShellProps {
  /**
   * Human‑readable name of the application displayed in the `TitleBar`.
   * Example: "Orders Console".
   */
  applicationName: string;
  /**
   * Icon to display next to the application name
   */
  applicationIcon?: ReactNode;
  /**
   * Main content of the page. This is rendered in the scrollable content area on the right
   * of the navigation drawer. Typically the routed page/component for the current URL.
   */
  main: ReactNode;

  /**
   * Tree of navigation items used to render the side navigation and compute selection.
   * Items may be categories or leaf entries with a `path`. When a leaf item is selected
   * and has a `path`, `navigate(path)` is invoked.
   */
  navigationItems: NavigationTreeItem[];

  /**
   * Current user status information shown in the `TitleBar` (e.g., username, avatar, roles).
   */
  userStatus: UserStatus;

  /**
   * Called when the home button in the `TitleBar` is clicked.
   * Use this to navigate to your application home route or perform any related action.
   */
  onClickHome: () => void;

  /**
   * Imperative navigation function called when a navigation leaf item with a `path`
   * is selected. Provide the function from your router (e.g., react-router navigate).
   */
  navigate: (path: string) => void;

  /**
   * Function used to check whether the current browser location matches a given item `path`.
   * It is used at render time to preselect the item that corresponds to the current URL.
   * Return `true` if the provided `path` matches the active route.
   */
  matchPath: (path: string | undefined) => boolean;
}

/**
 * ApplicationShell
 *
 * High‑level layout component that composes the application chrome:
 * - Top `TitleBar` showing the application name and user status
 * - Left `NavDrawer` for hierarchical navigation
 * - Main scrollable content area where your routed page is rendered
 *
 * Behavior
 * - Preselects the navigation item that matches the current URL via `matchPath`
 * - When a leaf item with a `path` is clicked, calls `navigate(path)`
 * - Keeps track of opened navigation categories and the selected item
 * - Displays a hamburger in the TitleBar to toggle the navigation drawer
 *
 * Usage (example)
 *
 * ```tsx
 * <ApplicationShell
 *   applicationName="Orders Console"
 *   navigationItems={items}
 *   userStatus={{ displayName: "Jane Doe" }}
 *   onClickHome={() => navigate("/")}
 *   navigate={(path) => navigate(path)}
 *   matchPath={(path) => !!path && !!match(path)}
 *   main={<Outlet />}
 * />
 * ```
 * Where `navigate`/`match` typically come from your router (e.g., react‑router v6's
 * `useNavigate`/`useMatch`). See `ApplicationShellProps` for details on each prop.
 */
export function ApplicationShell({
  applicationName,
  applicationIcon,
  main,
  navigationItems,
  userStatus,
  onClickHome,
  navigate,
  matchPath,
}: ApplicationShellProps) {
  // test si le chemin courant du navigateur correspond à cet item
  // attention, on est obligés de tester tous les items, qu'ils aient
  // un lien ou pas, d'où le url-inconnue pour ceux qui n'ont pas de lien.
  // On est obligés car useMatch est un hook que l'on ne peut pas lancer
  // de manière conditionnelle
  const navigationItemFound = navigationItems.find((it) => "path" in it && it.path !== null && matchPath(it.path));
  const navigationItemSelectedFromUrl = navigationItemFound?.id;
  const defaultOpenCategory =
    navigationItemFound && "parentId" in navigationItemFound && navigationItemFound.parentId !== null
      ? [navigationItemFound.parentId]
      : [];

  // Hooks
  const isMobile = useIsMobile();
  const styles = useApplicationShellStyles();

  const [sidebarMode, setSidebarMode] = useState<"rails" | "expanded">(initialSidebarModeDetect);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>(navigationItemSelectedFromUrl ?? "");
  const [openedCategories, setOpenCategories] = useState<string[]>(defaultOpenCategory);
  const navigationService = useMemo(() => createNavigationTreeItemServiceImpl(navigationItems), [navigationItems]);

  useEffect(() => {
    // Persist user choice for the rails or sidebar mode
    if (!isMobile) {
      localStorage.setItem("sidebarMode", sidebarMode);
    }
  }, [isMobile, sidebarMode]);

  // Events

  const handleClickHamburger = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleChangeSidebarMode = () => {
    if (sidebarMode === "expanded") {
      setSidebarMode("rails");
    }
    if (sidebarMode === "rails") {
      setSidebarMode("expanded");
    }
  };

  const handleClickMenuItem = (itemId: string) => {
    const item = navigationService.findById(itemId);
    setSelectedItem(item.id);
    const parentId = "parentId" in item ? item.parentId : null;
    if (parentId) {
      if (!openedCategories.find((cat) => cat === parentId)) {
        setOpenCategories([...openedCategories, parentId]);
      }
    }
    if ("path" in item && item.path) navigate(item.path);
  };

  const handleClickCategory = (categoryId: string) => {
    if (!openedCategories.find((cat) => cat === categoryId)) {
      setOpenCategories([...openedCategories, categoryId]);
    } else {
      setOpenCategories(openedCategories.filter((it) => it !== categoryId));
    }
  };

  const openCategories: string[] = [];
  if (navigationItemFound && "parentId" in navigationItemFound && navigationItemFound.parentId !== null) {
    openCategories.push(navigationItemFound.parentId);
  }

  return (
    <div data-e2e-id="shell" className={styles.shell}>
      <div data-e2e-id="shell__menu_top" className={styles.titleBar}>
        {isMobile ? (
          <TitleBar
            applicationName={applicationName}
            applicationIcon={applicationIcon}
            userStatus={userStatus}
            onClickHome={onClickHome}
            hamburger={<MenuBurger onClick={handleClickHamburger} />}
          />
        ) : null}
      </div>
      <div data-e2e-id="shell__main" className={styles.main}>
        {((!isMobile && sidebarMode === "expanded") || isMobile) && (
          <Sidebar
            selectedItem={selectedItem}
            openedCategories={openedCategories}
            drawerOpen={drawerOpen}
            isMobile={isMobile}
            applicationName={applicationName}
            applicationIcon={applicationIcon}
            userStatus={userStatus}
            navigationItems={navigationItems}
            onClickHome={onClickHome}
            onClickHamburger={handleClickHamburger}
            onClickMenuItem={handleClickMenuItem}
            onClickCategory={handleClickCategory}
            onClickPanelReduce={handleChangeSidebarMode}
          />
        )}
        {sidebarMode === "rails" && (
          <Rails
            applicationIcon={applicationIcon}
            navigationItems={navigationItems}
            userStatus={userStatus}
            onClickHome={onClickHome}
            onClickMenuItem={handleClickMenuItem}
            onClickSidebarExpand={handleChangeSidebarMode}
          />
        )}
        <div data-e2e-id="shell__content" className={styles.content}>
          {main}
        </div>
      </div>
    </div>
  );
}

const initialSidebarModeDetect = () => {
  const value = localStorage.getItem("sidebarMode");
  if (value === "expanded") return "expanded";
  if (value === "rails") return "rails";
  return "expanded";
};
