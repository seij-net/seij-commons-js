import {
  NavCategory,
  NavCategoryItem,
  NavDivider,
  NavItem,
  NavSubItem,
  NavSubItemGroup,
  Text,
} from "@fluentui/react-components";

import { createContext, useContext, useMemo } from "react";
import {
  NavigationTreeIconName,
  NavigationTreeItem,
  NavigationTreeItemDivider,
  NavigationTreeItemGroup,
  NavigationTreeItemPage,
} from "./Navigation.types";
import { createNavigationTreeItemServiceImpl, NavigationTreeItemService } from "./NavigationService";
import { Icon } from "@seij/common-ui-icons";

const itemsService = createContext<NavigationTreeItemService>(createNavigationTreeItemServiceImpl([]));
/**
 * Displays a navigation menu.
 *
 * Current implementation is limited to 2 hierarchical levels (direct items or group/items).
 *
 * This will be improved later.
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
  const itemChildren = ctx.findChildren(item.id);
  return (
    <NavCategory value={item.id}>
      <NavCategoryItem icon={<NavigationIcon iconName={item.icon} />}>{item.label}</NavCategoryItem>
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
  return (
    <NavItem value={item.id} icon={<NavigationIcon iconName={item.icon} />}>
      <Text>{item.label}</Text>
    </NavItem>
  );
}

// -----------------------------------------------------------------------------
// Gestion des icones
// -----------------------------------------------------------------------------

const NavigationIcon = ({ iconName }: { iconName?: NavigationTreeIconName | null | undefined }) => {
  if (!iconName) return <Icon name="empty" />;
  return <Icon name={iconName} />;
};
