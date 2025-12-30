export const iconNames = [
  "add",
  "back",
  "building_bank",
  "chevron_right_filled",
  "customers",
  "dashboard",
  "delete",
  "dismiss",
  "edit",
  "empty",
  "genericapp",
  "more_menu_vertical",
  "search",
  "signin",
  "signout",
  "user",
  "users",
] as const;
export type IconName = (typeof iconNames)[number];
export function parseIconName(value?: string): IconName | undefined {
  if (!value) return undefined;
  if ((iconNames as readonly string[]).includes(value)) {
    return value as IconName;
  }
  return undefined;
}
