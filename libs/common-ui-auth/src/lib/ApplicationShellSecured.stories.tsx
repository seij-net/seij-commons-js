import { Meta, StoryObj } from "@storybook/react-vite";
import { AuthenticationStatusView } from "./AuthenticationStatusView";
import { SeijUIProviderDecorator } from "../stories/utils/SeijUIProviderDecorator";
import { ApplicationShellSecured } from "./ApplicationShellSecured";
import { SeijUIProvider } from "@seij/common-ui";
import { AuthenticationProvider } from "./AuthenticationProvider";
import { AuthenticationConfig, createAuthenticationConfig } from "./authentication";
import { AuthenticationPaths } from "./authpaths";
import { AuthProviderProps } from "react-oidc-context";

const meta = {
  title: "Views/ApplicationShellSecured",
  component: ApplicationShellSecured,
  decorators: [SeijUIProviderDecorator],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ApplicationShellSecured>;

export default meta;

type Story = StoryObj<typeof AuthenticationStatusView>;

export const Authenticating: Story = {
  render: () => {
    const props: AuthProviderProps = {
      redirect_uri: "http://localhost:6006/" + AuthenticationPaths.callback,
      authority: "http://localhost/oidc/authority",
      client_id: "my_client_id",
    };
    const config: AuthenticationConfig = createAuthenticationConfig(props);
    return (
      <SeijUIProvider>
        <AuthenticationProvider {...config}>
          <ApplicationShellSecured
            applicationName={"my app"}
            navigationItems={[
              {
                id: "login",
                type: "page",
                icon: "signin",
                label: "Log in",
                rule: "loggedout",
              },
              {
                id: "logout",
                type: "page",
                icon: "signout",
                label: "Log out",
                rule: "loggedin",
              },
              {
                id: "always",
                type: "page",
                icon: "search",
                label: "Always there",
              },
            ]}
            navigate={(it) => window.alert("Navigate " + it)}
            outlet={<div>Main content</div>}
            onClickHome={() => window.alert("On click home")}
            matchPath={() => false}
            pathname={"/"}
          />
        </AuthenticationProvider>
      </SeijUIProvider>
    );
  },
};
