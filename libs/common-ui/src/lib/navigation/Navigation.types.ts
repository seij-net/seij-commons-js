/**
 * Liste des toutes les icones supportées par le menu de navigation
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
 * Type d'élément de navigation
 */
export type NavigationTreeItemType = "group" | "page" | "divider";
/**
 * Règles d'affichage
 */
export type NavigationTreeItemRule = "loggedout" | "loggedin";

/**
 * Element de menu, c'est ce que l'on doit renseigner pour
 * afficher un menu. Il faut les fournir dans une liste.
 */
export type NavigationTreeItem = NavigationTreeItemPage | NavigationTreeItemGroup | NavigationTreeItemDivider;

export interface NavigationTreeItemBase {
  /** Identifiant unique de l'entrée de menu */
  id: string;
  /** Type */
  type: NavigationTreeItemType;
  /** Règles d'affichage */
  rule?: NavigationTreeItemRule;
}

export interface NavigationTreeItemPage extends NavigationTreeItemBase {
  /** Libellé de l'entrée de menu */
  label: string;
  /** Description qui va juste en dessous, n'est pas obligatoire, n'est pas affiché à l'écran */
  description?: string;
  /** Item dans lequel le ranger ou null si c'est à la racine */
  parentId: string | null;
  /** Item path for navigation. If provided, router will be called for this path */
  path?: string;
  /** Si on veut mettre une icône */
  icon?: NavigationTreeIconName;
}
export interface NavigationTreeItemGroup extends NavigationTreeItemBase {
  /** Libellé de l'entrée de menu */
  label: string;
  /** Description qui va juste en dessous, n'est pas obligatoire, n'est pas affiché à l'écran */
  description?: string;
  /** Si on veut mettre une icône */
  icon?: NavigationTreeIconName;
}
export interface NavigationTreeItemDivider extends NavigationTreeItemBase {}
