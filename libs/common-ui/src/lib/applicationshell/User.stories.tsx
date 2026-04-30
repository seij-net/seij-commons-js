import type { Meta, StoryObj } from "@storybook/react";
import { User } from "./User";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";

const defaultHandlers = {
  onClickSignIn: () => undefined,
  onClickSignOut: () => undefined,
};

const meta = {
  title: "Composites/User",
  component: User,
  decorators: [SeijUIProviderDecorator]
} satisfies Meta<typeof User>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {
    status: {
      isLoading: true,
      isAuthenticated: false,
      errorMessage: null,
      userName: null,
      ...defaultHandlers,
    },
  },
};

export const Error: Story = {
  args: {
    status: {
      isLoading: false,
      isAuthenticated: false,
      errorMessage: "Erreur de connexion",
      userName: null,
      ...defaultHandlers,
    },
  },
};

export const Authenticated: Story = {
  args: {
    status: {
      isLoading: false,
      isAuthenticated: true,
      errorMessage: null,
      userName: "Jean Dupont",
      ...defaultHandlers,
    },
  },
};

export const Unauthenticated: Story = {
  args: {
    status: {
      isLoading: false,
      isAuthenticated: false,
      errorMessage: null,
      userName: null,
      ...defaultHandlers,
    },
  },
};
