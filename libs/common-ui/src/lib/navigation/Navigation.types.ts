/**
 * All icon names supported by the Navigation menu.
 *
 * These are semantic identifiers consumed by the UI layer to render a visual
 * icon next to a navigation entry. Keep this list in sync with the icon set
 * actually available in the navigation component.
 */
export type NavigationTreeIconName =
  | "buildingBank"
  | "dashboard"
  | "customers"
  | "users"
  | "features"
  | "permissions"
  | "signin"
  | "signout";

/**
 * Kind of a navigation item.
 *
 * - "group": non-clickable category that can contain items
 * - "page": clickable leaf that may navigate to `path`
 * - "divider": visual separator between items in the same level
 */
export type NavigationTreeItemType = "group" | "page" | "divider";

/**
 * Visibility rule for an item depending on authentication status.
 *
 * - "loggedout": show only when the user is NOT authenticated
 * - "loggedin": show only when the user IS authenticated
 */
export type NavigationTreeItemRule = "loggedout" | "loggedin";

/**
 * A navigation tree item definition. Provide a flat list of items — the
 * component will use `parentId` (for pages) to reconstruct the hierarchy.
 *
 * The goal is to be able to get navigation items as serializable DTO from backends and plugins.
 *
 * Notes
 * - Use `NavigationTreeItemGroup` to create non-clickable categories.
 * - Use `NavigationTreeItemPage` for actual leaf entries that may have a `path`.
 * - Use `NavigationTreeItemDivider` to insert visual separators within a group.
 */
export type NavigationTreeItem = NavigationTreeItemPage | NavigationTreeItemGroup | NavigationTreeItemDivider;

export interface NavigationTreeItemBase {
  /** Unique identifier of the navigation entry. Stable across renders. */
  id: string;
  /** Item kind: group, page, or divider. */
  type: NavigationTreeItemType;
  /**
   * Optional visibility rule based on authentication status.
   *
   * The rule is used by security layers when they are availble, it means that, using just "common-ui"
   * it doesn't do anything, but "@seij/common-auth" uses it to filter out items.
   *
   * Participates in the goal of having navigation items coming from a backend or plugins in serializable formats.
   **/
  rule?: NavigationTreeItemRule;
}

export interface NavigationTreeItemPage extends NavigationTreeItemBase {
  /** Display label shown in the navigation. */
  label: string;
  /**
   * Optional description placed just under the label (not rendered in the UI by default).
   * Can be used for help text or tooltips depending on the consumer.
   */
  description?: string;
  /**
   * Parent group id, or null if the page is at the root level.
   *
   * Example: parentId = "admin" to place the page under the "Admin" group.
   */
  parentId: string | null;
  /**
   * Route path to navigate to when the item is selected. If omitted, the item is still
   * selectable but no automatic navigation will occur; you may handle it manually.
   */
  path?: string;
  /** Optional icon to render next to the label. */
  icon?: NavigationTreeIconName;
}
export interface NavigationTreeItemGroup extends NavigationTreeItemBase {
  /** Display label for the group header. */
  label: string;
  /** Optional description (not rendered in the UI by default). */
  description?: string;
  /** Optional icon to render next to the group label. */
  icon?: NavigationTreeIconName;
}
/**
 * Visual separator between items.
 *
 * Only the base fields are used: set `type: "divider"` and a unique `id`.
 * Other base fields like `rule` may still control visibility.
 */
export interface NavigationTreeItemDivider extends NavigationTreeItemBase {}
