import { Meta, StoryObj } from "@storybook/react-vite";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import { Navigation } from "./Navigation";
import type { NavigationTreeItem } from "./Navigation.types";
import { NavDrawer, NavDrawerBody } from "@fluentui/react-components";

const meta = {
  title: "Shell/Navigation",
  component: Navigation,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof Navigation>;
export default meta;

type Story = StoryObj<{ items: NavigationTreeItem[] }>;

const sampleItems: NavigationTreeItem[] = [
  {
    id: "dashboard",
    type: "page",
    label: "Dashboard",
    icon: "dashboard",
  },
  {
    id: "users",
    type: "group",
    label: "Users",
    icon: "users",
    parentId: undefined,
  },
  {
    id: "user-list",
    type: "page",
    label: "User List",
    icon: "users",
    parentId: "users",
  },
  {
    id: "divider-1",
    type: "divider",
    parentId: undefined,
  },
  {
    id: "customers",
    type: "page",
    label: "Customers",
    icon: "customers",
  },
  {
    id: "settings",
    type: "group",
    label: "Settings",
    icon: "users",
    parentId: undefined,
  },
  {
    id: "profile",
    type: "page",
    label: "Profile",
    icon: "users",
    parentId: "settings",
  },
  {
    id: "security",
    type: "group",
    label: "Security",
    icon: "users",
    parentId: "settings",
  },
  {
    id: "password",
    type: "page",
    label: "Password",
    icon: "users",
    parentId: "security",
  },
  {
    id: "2fa",
    type: "page",
    label: "Two-Factor Auth",
    icon: "users",
    parentId: "security",
  },
  {
    id: "divider-2",
    type: "divider",
    parentId: undefined,
  },
  {
    id: "reports",
    type: "group",
    label: "Reports",
    icon: "buildingBank",
    parentId: undefined,
  },
  {
    id: "sales-report",
    type: "page",
    label: "Sales",
    icon: "buildingBank",
    parentId: "reports",
  },
  {
    id: "user-report",
    type: "page",
    label: "User Activity",
    icon: "buildingBank",
    parentId: "reports",
  },
];

export const Standard: Story = {
  args: {
    items: sampleItems,
  },
  render: (args) => (
    <NavDrawer
      defaultSelectedValue="settings"
      defaultSelectedCategoryValue=""
      open={true}
      type="inline"
      multiple={false}
    >
      <NavDrawerBody>
        <Navigation {...args} />
      </NavDrawerBody>
    </NavDrawer>
  ),
};
