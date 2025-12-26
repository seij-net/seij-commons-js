import type { Meta, StoryObj } from "@storybook/react-vite";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import { ApplicationShell } from "./ApplicationShell";
const meta = {
  title: "Shell/ApplicationShell",
  component: ApplicationShell,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof ApplicationShell>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Test: Story = {
  args: {
    applicationName: "Shell",
    main: <h1>test</h1>,
    navigationItems: [],
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
