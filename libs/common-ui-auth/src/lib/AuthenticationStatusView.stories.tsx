import { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import type { Decorator } from "@storybook/react-vite";
import { AuthenticationStatusView } from "./AuthenticationStatusView";
import { SeijUIProviderDecorator } from "../stories/utils/SeijUIProviderDecorator";
import { AuthContext, AuthContextProps } from "react-oidc-context";
import { useI18n } from "@seij/common-ui";

const LocaleDecorator: Decorator = (Story) => {
  const { getLocale } = useI18n();
  const locale = getLocale();
  return (
    <div>
      <div>Lang: {locale}</div>
      <Story />
    </div>
  );
};

const meta = {
  title: "Views/AuthenticationStatusView",
  component: AuthenticationStatusView,
  decorators: [LocaleDecorator, SeijUIProviderDecorator],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof AuthenticationStatusView>;

export default meta;

type Story = StoryObj<typeof AuthenticationStatusView>;

export const Authenticating: Story = {
  render: () => (
    <AuthContext.Provider value={mockAuthContext({ activeNavigator: "signinSilent" })}>
      <AuthenticationStatusView />
    </AuthContext.Provider>
  ),
};

export const SignoutRedirect: Story = {
  render: () => (
    <AuthContext.Provider value={mockAuthContext({ activeNavigator: "signoutRedirect" })}>
      <AuthenticationStatusView />
    </AuthContext.Provider>
  ),
};

export const IsLoading: Story = {
  render: () => (
    <AuthContext.Provider value={mockAuthContext({ isLoading: true })}>
      <AuthenticationStatusView />
    </AuthContext.Provider>
  ),
};

export const Error: Story = {
  render: () => (
    <AuthContext.Provider
      value={mockAuthContext({
        error: Object.assign(new globalThis.Error("An error occured blah blah"), { source: "signinCallback" as const }),
        signinRedirect: () => Promise.resolve(window.alert("Sign In retry")),
      })}
    >
      <AuthenticationStatusView />
    </AuthContext.Provider>
  ),
};

export const IsAuthenticated: Story = {
  render: () => (
    <AuthContext.Provider
      value={mockAuthContext({
        isAuthenticated: true,
        user: { profile: { name: "Sebby" } } as AuthContextProps["user"],
        removeUser: () => Promise.resolve(window.alert("Sign Out clicked")),
      })}
    >
      <AuthenticationStatusView />
    </AuthContext.Provider>
  ),
};

export const NotAuthenticated: Story = {
  render: () => (
    <AuthContext.Provider
      value={mockAuthContext({
        isAuthenticated: false,
        user: null,
        signinRedirect: () => Promise.resolve(window.alert("Sign In clicked")),
      })}
    >
      <AuthenticationStatusView />
    </AuthContext.Provider>
  ),
};

function mockAuthContext(ctx: Partial<AuthContextProps>): AuthContextProps {
  return {
    isLoading: false,
    isAuthenticated: false,
    user: undefined,
    activeNavigator: undefined,
    error: undefined,
    settings: {} as AuthContextProps["settings"],
    events: {} as AuthContextProps["events"],
    clearStaleState: () => Promise.resolve(),
    removeUser: () => Promise.resolve(),
    signinPopup: () => Promise.reject(),
    signinSilent: () => Promise.resolve(null),
    signinRedirect: () => Promise.resolve(),
    signinResourceOwnerCredentials: () => Promise.reject(),
    signoutRedirect: () => Promise.resolve(),
    signoutPopup: () => Promise.resolve(),
    signoutSilent: () => Promise.resolve(),
    querySessionStatus: () => Promise.resolve(null),
    revokeTokens: () => Promise.resolve(),
    startSilentRenew: () => {},
    stopSilentRenew: () => {},
    ...ctx,
  };
}
