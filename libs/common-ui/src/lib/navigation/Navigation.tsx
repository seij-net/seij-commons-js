import {
  NavCategory,
  NavCategoryItem,
  NavDivider,
  NavItem,
  NavSubItem,
  NavSubItemGroup,
  Text,
} from "@fluentui/react-components";
import {
  Board20Filled,
  Board20Regular,
  BookContactsFilled,
  BookContactsRegular,
  BuildingBankFilled,
  BuildingBankRegular,
  bundleIcon,
  CalendarEmptyFilled,
  CalendarEmptyRegular,
  FluentIcon,
  People20Filled,
  People20Regular,
  PersonStarburstFilled,
  PersonStarburstRegular,
  SignOutFilled,
  SignOutRegular,
} from "@fluentui/react-icons";
import { createContext, useContext, useMemo } from "react";
import {
  NavigationTreeIconName,
  NavigationTreeItem,
  NavigationTreeItemDivider,
  NavigationTreeItemGroup,
  NavigationTreeItemPage,
} from "./Navigation.types";
import { createNavigationTreeItemServiceImpl, NavigationTreeItemService } from "./NavigationService";

const itemsService = createContext<NavigationTreeItemService>(createNavigationTreeItemServiceImpl([]));
/**
 * Affiche un menu de navigation
 */
export function Navigation({
  items,
}: {
  /** Liste des items du menu */
  items: NavigationTreeItem[];
}) {
  const service = useMemo(() => createNavigationTreeItemServiceImpl(items), [items]);

  const topLevelItems = service.findTopLevelItems();

  return (
    <itemsService.Provider value={service}>
      {topLevelItems.map((it) => (
        <NavigationTreeItemComponent key={it.id} id={it.id} />
      ))}
    </itemsService.Provider>
  );
}

function NavigationTreeItemComponent({ id }: { id: string }) {
  const ctx = useContext(itemsService);
  const item = ctx.findById(id);

  if (item.type === "divider") return <NavigationTreeItemDividerComponent item={item as NavigationTreeItemDivider} />;
  if (item.type === "page") return <NavigationTreeItemPageComponent item={item as NavigationTreeItemPage} />;
  if (item.type === "group") return <NavigationTreeItemGroupComponent item={item as NavigationTreeItemGroup} />;
  return null;
}

function NavigationTreeItemDividerComponent({ item }: { item: NavigationTreeItemDivider }) {
  return <NavDivider />;
}
function NavigationTreeItemGroupComponent({ item }: { item: NavigationTreeItemGroup }) {
  const ctx = useContext(itemsService);
  const Icon = NavigationIcon({ iconName: item.icon });
  const itemChildren = ctx.findChildren(item.id);
  return (
    <NavCategory value={item.id}>
      <NavCategoryItem icon={<Icon />}>{item.label}</NavCategoryItem>
      <NavSubItemGroup>
        {itemChildren.map((child) => {
          const page = child as NavigationTreeItemPage;
          return (
            <NavSubItem key={child.id} value={child.id}>
              {page.label}
            </NavSubItem>
          );
        })}
      </NavSubItemGroup>
    </NavCategory>
  );
}
function NavigationTreeItemPageComponent({ item }: { item: NavigationTreeItemPage }) {
  const Icon = NavigationIcon({ iconName: item.icon });
  return (
    <NavItem value={item.id} icon={<Icon />}>
      <Text>{item.label}</Text>
    </NavItem>
  );
}

// -----------------------------------------------------------------------------
// Gestion des icones
// -----------------------------------------------------------------------------

const DashboardIcon = bundleIcon(Board20Filled, Board20Regular);
const UsersIcon = bundleIcon(People20Filled, People20Regular);
const CustomersIcon = bundleIcon(BookContactsFilled, BookContactsRegular);
const EmptyIcon = bundleIcon(CalendarEmptyFilled, CalendarEmptyRegular);
const SignOutIcon = bundleIcon(SignOutFilled, SignOutRegular);
const SignInIcon = bundleIcon(PersonStarburstFilled, PersonStarburstRegular);
const BuildingBankIcon = bundleIcon(BuildingBankFilled, BuildingBankRegular);
const NavigationIcon = ({ iconName }: { iconName?: NavigationTreeIconName | null | undefined }): FluentIcon => {
  if (!iconName) return EmptyIcon;
  if (iconName === "dashboard") return DashboardIcon;
  if (iconName === "users") return UsersIcon;
  if (iconName === "customers") return CustomersIcon;
  if (iconName === "signout") return SignOutIcon;
  if (iconName === "signin") return SignInIcon;
  if (iconName === "buildingBank") return BuildingBankIcon;
  return EmptyIcon;
};
