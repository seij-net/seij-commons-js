import { IconName } from "./iconNames";

export const iconLoaders: Record<IconName, () => Promise<{ default: React.ComponentType<{ size?: number }> }>> = {
  add: () => import("./icons/add"),
  back: () => import("./icons/back"),
  building_bank: () => import("./icons/building_bank"),
  chevron_right_filled: () => import("./icons/chevron_right_filled"),
  customers: () => import("./icons/customers"),
  dashboard: () => import("./icons/dashboard"),
  delete: () => import("./icons/delete"),
  dismiss: () => import("./icons/dismiss"),
  edit: () => import("./icons/edit"),
  empty: () => import("./icons/empty"),
  genericapp: () => import("./icons/genericapp"),
  more_menu_vertical: () => import("./icons/more_menu_vertical"),
  panel_left_expand: () => import("./icons/panel_left_expand"),
  panel_left_reduce: () => import("./icons/panel_left_reduce"),
  search: () => import("./icons/search"),
  signin: () => import("./icons/signin"),
  signout: () => import("./icons/signout"),
  user: () => import("./icons/user"),
  users: () => import("./icons/users"),
};
