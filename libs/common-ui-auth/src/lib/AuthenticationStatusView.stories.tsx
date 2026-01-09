import { Meta, StoryContext, StoryFn, StoryObj } from "@storybook/react-vite";
import { AuthenticationStatusView } from "./AuthenticationStatusView";
import { SeijUIProviderDecorator } from "../stories/utils/SeijUIProviderDecorator";
import { AuthContext, AuthContextProps } from "react-oidc-context";
import { useI18n } from "@seij/common-ui";

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
    <AuthContext.Provider value={{ activeNavigator: "signinSilent" } as Partial<AuthContextProps>}>
      <AuthenticationStatusView />
    </AuthContext.Provider>
  ),
};
export const SignoutRedirect: Story = {
  render: () => (
    <AuthContext.Provider value={{ activeNavigator: "signoutRedirect" } as Partial<AuthContextProps>}>
      <AuthenticationStatusView />
    </AuthContext.Provider>
  ),
};
export const IsLoading: Story = {
  render: () => (
    <AuthContext.Provider value={{ isLoading: true } as Partial<AuthContextProps>}>
      <AuthenticationStatusView />
    </AuthContext.Provider>
  ),
};

export const Error: Story = {
  render: () => (
    <AuthContext.Provider
      value={
        {
          error: { message: "An error occured blah blah" },
          signinRedirect: () => window.alert("Sign In retry"),
        } as Partial<AuthContextProps>
      }
    >
      <AuthenticationStatusView />
    </AuthContext.Provider>
  ),
};

export const IsAuthenticated: Story = {
  render: () => (
    <AuthContext.Provider
      value={
        {
          isAuthenticated: true,
          user: {
            profile: {
              name: "Sebby",
            },
          },
          removeUser: () => window.alert("Sign Out clicked"),
        } as Partial<AuthContextProps>
      }
    >
      <AuthenticationStatusView />
    </AuthContext.Provider>
  ),
};
export const NotAuthenticated: Story = {
  render: () => (
    <AuthContext.Provider
      value={
        {
          isAuthenticated: false,
          user: null,
          signinRedirect: () => window.alert("Sign In clicked"),
        } as Partial<AuthContextProps>
      }
    >
      <AuthenticationStatusView />
    </AuthContext.Provider>
  ),
};

function LocaleDecorator(Story: StoryFn, context: StoryContext<{ lang: "en" | "fr" }>) {
  const { getLocale } = useI18n();
  const locale = getLocale();
  return (
    <div>
      <div>Lang: {locale}</div>
      <Story />
    </div>
  );
}
