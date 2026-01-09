import { ApplicationShell, ApplicationShellProps } from "@seij/common-ui";
import { useAuthentication } from "./authentication";
import { AuthenticationStatusView } from "./AuthenticationStatusView";
import { ReactNode } from "react";
import { AuthenticationPaths } from "./authpaths";

export type ApplicationShellSecuredProps = Omit<ApplicationShellProps, "main" | "matchPath" | "userStatus"> & {
  outlet: ReactNode;
  matchPath: (path: string) => boolean;
  pathname: string;
};

export const ApplicationShellSecured = (props: ApplicationShellSecuredProps) => {
  const { outlet, matchPath, pathname, navigationItems, ...otherProps } = props;

  const authentication = useAuthentication();
  const navigationItemsSecured = navigationItems.filter((nav) => {
    if (!nav.rule) return authentication.isAuthenticated;
    if (nav.rule === "loggedin") return authentication.isAuthenticated;
    if (nav.rule === "loggedout") return !authentication.isAuthenticated;
    return false;
  });

  const notAuthenticatedPage = !authentication.isAuthenticated && pathname !== AuthenticationPaths.login;

  return (
    <ApplicationShell
      {...otherProps}
      userStatus={{
        isAuthenticated: authentication.isAuthenticated,
        isLoading: authentication.isLoading,
        userName: authentication.userDisplayName,
        errorMessage: authentication.error?.message ?? null,
        onClickSignIn: authentication.signIn,
        onClickSignOut: authentication.signOut,
      }}
      main={notAuthenticatedPage ? <AuthenticationStatusView /> : outlet}
      navigationItems={navigationItemsSecured}
      matchPath={(it) => matchPath(it ?? "unknown-url")}
    />
  );
};
