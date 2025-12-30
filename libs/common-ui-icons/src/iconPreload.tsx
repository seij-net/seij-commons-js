import { iconLoaders } from "./iconLoaders";
import type { IconName } from "./iconNames";

/**
 * Utility function to preload known icons (that your app will surely use) so that you avoid any flickering effect.
 *
 * A good usage is to use that in your main App (just at the start of your component).
 *
 * Also when you get icons from backend in DTOs (a menu for example), immediately after your get
 * the data, start the preload, so that your menu items don't flick too much.
 *
 * @param names Names of icons to preload
 */
export function iconPreload(names: IconName[]) {
  names.forEach((name) => {
    iconLoaders[name]();
  });
}
