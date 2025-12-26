import { isNil, keyBy } from "lodash-es";
import { NavigationTreeItem, NavigationTreeItemPage } from "./Navigation.types";

export interface NavigationTreeItemService {
  findById(id: string): NavigationTreeItem;
  findChildren(id: string): NavigationTreeItem[];
  findTopLevelItems(): NavigationTreeItem[];
}
export const createNavigationTreeItemServiceImpl = (items: NavigationTreeItem[]): NavigationTreeItemService => {
  const itemsMap = keyBy(items, (it) => it.id);
  return {
    findById: (id: string) => itemsMap[id],
    findChildren: (id: string) =>
      items.filter((it) => it.type === "page" && (it as NavigationTreeItemPage).parentId === id),
    findTopLevelItems: () => items.filter((it) => isNil((it as any).parentId)),
  };
};
