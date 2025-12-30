import {
  Hamburger,
  makeStyles,
  NavDrawer,
  NavDrawerBody,
  NavDrawerHeader,
  tokens,
  Tooltip,
} from "@fluentui/react-components";
import { ReactNode, useMemo, useState } from "react";
import { Navigation } from "../navigation/Navigation";
import { NavigationTreeItem } from "../navigation/Navigation.types";
import { createNavigationTreeItemServiceImpl } from "../navigation/NavigationService";
import { UserStatus } from "./ApplicationShell.types";
import { TitleBar } from "./TitleBar";

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
  bugerIcon: {
    color: tokens.colorNeutralForegroundOnBrand,
    ":hover": {
      color: tokens.colorNeutralForegroundOnBrand,
    },
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

  const styles = useApplicationShellStyles();
  const [navDrawerOpened, setNavDrawerOpened] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<string>(navigationItemSelectedFromUrl ?? "");
  const [openedCategories, setOpenCategories] = useState<string[]>(defaultOpenCategory);

  const navigationService = useMemo(() => createNavigationTreeItemServiceImpl(navigationItems), [navigationItems]);
  const handleClickHamburger = () => {
    setNavDrawerOpened(!navDrawerOpened);
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
        {!navDrawerOpened ? (
          <TitleBar
            applicationName={applicationName}
            userStatus={userStatus}
            onClickHome={onClickHome}
            hamburger={<MenuBurger onClick={handleClickHamburger} />}
          />
        ) : null}
      </div>
      <div data-e2e-id="shell__main" className={styles.main}>
        <NavDrawer
          selectedValue={selectedItem}
          open={navDrawerOpened}
          density={"small"}
          type={"inline"}
          openCategories={openedCategories}
          onNavItemSelect={(e, data) => {
            handleClickMenuItem(data.value);
          }}
          onNavCategoryItemToggle={(e, data) => {
            handleClickCategory(data.categoryValue ?? "");
          }}
        >
          <TitleBar
            applicationName={applicationName}
            userStatus={userStatus}
            onClickHome={onClickHome}
            hamburger={<MenuBurger onClick={handleClickHamburger} />}
          />
          <NavDrawerHeader></NavDrawerHeader>
          <NavDrawerBody>
            <Navigation items={navigationItems} />
          </NavDrawerBody>
        </NavDrawer>
        <div data-e2e-id="shell__content" className={styles.content}>
          {main}
        </div>
      </div>
    </div>
  );
}

const MenuBurger = ({ onClick }: { onClick: () => void }) => {
  const styles = useApplicationShellStyles();
  return (
    <Tooltip content="Navigation" relationship="label">
      <Hamburger className={styles.bugerIcon} onClick={onClick} />
    </Tooltip>
  );
};
