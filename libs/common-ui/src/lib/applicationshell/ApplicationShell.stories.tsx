import type { Meta, StoryObj } from "@storybook/react-vite";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import { ApplicationShell } from "./ApplicationShell";
import { NavigationTreeItem, NavigationTreeItemGroup, NavigationTreeItemPage } from "../navigation/Navigation.types";
import { Icon, IconName, iconPreload } from "@seij/common-ui-icons";

const meta = {
  title: "Shell/ApplicationShell",
  component: ApplicationShell,
  decorators: [SeijUIProviderDecorator],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ApplicationShell>;
export default meta;

type Story = StoryObj<typeof meta>;

const navigationItems: NavigationTreeItem[] = Array(10)
  .fill([
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
  ])
  .flat();

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
    applicationIcon: <Icon name="dashboard" />,
    main: (
      <div>
        <h1>test</h1>
        <p>Be careful to test on Mobile sizes too !!</p>
      </div>
    ),
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
