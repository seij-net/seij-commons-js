import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { User } from "./User";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";

const defaultHandlers = {
  onClickSignIn: fn(),
  onClickSignOut: fn(),
};

const meta = {
  title: "Composites/User",
  component: User,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof User>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {
    variant: "icon",
    status: {
      isLoading: true,
      isAuthenticated: false,
      errorMessage: null,
      userName: null,
      ...defaultHandlers,
    },
  },
};

export const LoadingFull: Story = {
  args: {
    variant: "full",
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
    variant: "icon",
    status: {
      isLoading: false,
      isAuthenticated: false,
      errorMessage: "Erreur de connexion",
      userName: null,
      ...defaultHandlers,
    },
  },
};

export const ErrorFull: Story = {
  args: {
    variant: "full",
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
    variant: "icon",
    status: {
      isLoading: false,
      isAuthenticated: true,
      errorMessage: null,
      userName: "Jean Dupont",
      ...defaultHandlers,
    },
  },
};

export const AuthenticatedFull: Story = {
  args: {
    variant: "full",
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
    variant: "icon",
    status: {
      isLoading: false,
      isAuthenticated: false,
      errorMessage: null,
      userName: null,
      ...defaultHandlers,
    },
  },
};

export const UnauthenticatedFull: Story = {
  args: {
    variant: "full",
    status: {
      isLoading: false,
      isAuthenticated: false,
      errorMessage: null,
      userName: null,
      ...defaultHandlers,
    },
  },
};
