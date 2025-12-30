import type { Meta, StoryObj } from "@storybook/react-vite";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import { ApplicationShell } from "./ApplicationShell";
import { NavigationTreeItem, NavigationTreeItemGroup, NavigationTreeItemPage } from "../navigation/Navigation.types";
import { IconName, iconPreload } from "@seij/common-ui-icons";

const meta = {
  title: "Shell/ApplicationShell",
  component: ApplicationShell,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof ApplicationShell>;
export default meta;

type Story = StoryObj<typeof meta>;

const navigationItems: NavigationTreeItem[] = [
  {
    id: "new",
    type: "page",
    label: "New item",
    icon: "add",
  },
  {
    id: "search",
    type: "page",
    label: "Search items",
    icon: "search",
  },
  {
    id: "login",
    type: "page",
    label: "Login",
    icon: "signin",
  },
  {
    id: "logout",
    type: "page",
    label: "Logout",
    icon: "signout",
  },
];

iconPreload(
  new Set(
    navigationItems
      .filter((it) => it.type === "page" || it.type === "group")
      .map((it: NavigationTreeItemPage | NavigationTreeItemGroup) => it?.icon)
      .filter((it: IconName | null | undefined) => it !== undefined && it !== null),
  ),
);

export const Test: Story = {
  args: {
    applicationName: "Shell",
    main: <h1>test</h1>,
    navigationItems: navigationItems,
    onClickHome: () => {},
    matchPath: () => false,
    navigate: () => {},
    userStatus: {
      isLoading: false,
      isAuthenticated: true,
      errorMessage: null,
      userName: "toto",
      onClickSignIn: () => {},
      onClickSignOut: () => null,
    },
  },
};
