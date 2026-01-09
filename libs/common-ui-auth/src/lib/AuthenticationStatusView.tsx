import { Button, ErrorBox, ViewBody, ViewHeader, ViewLayout, ViewTitle } from "@seij/common-ui";
import { useAuthentication } from "./authentication";
import { toProblem } from "@seij/common-types";
import { useAuthI18n } from "./authI18n";
import { PropsWithChildren } from "react";

export const AuthenticationStatusView = () => {
  const authentication = useAuthentication();

  const { t } = useAuthI18n();

  switch (authentication.activeNavigator) {
    case "signinSilent":
      return (
        <AuthenticationLayout title={t("authentication")}>
          <p>{t("authenticating")}</p>
          <p>{t("pleaseWait")}</p>
        </AuthenticationLayout>
      );
    case "signoutRedirect":
      return (
        <AuthenticationLayout title={t("disconnect")}>
          <p>{t("disconnecting")}</p>
          <p>{t("pleaseWait")}</p>
        </AuthenticationLayout>
      );
  }

  if (authentication.isLoading) {
    return (
      <AuthenticationLayout title={t("authentication")}>
        <p>{t("authenticationLoading")}</p>
        <p>{t("pleaseWait")}</p>
      </AuthenticationLayout>
    );
  }

  if (authentication.error) {
    return (
      <AuthenticationLayout title={t("authenticationError")}>
        <ErrorBox error={toProblem(authentication.error.message)} />
        <Button onClick={authentication.signIn}>{t("retry")}</Button>
      </AuthenticationLayout>
    );
  }

  if (authentication.isAuthenticated) {
    return (
      <AuthenticationLayout title={t("authenticationSuccess")}>
        <p>{t("welcome", { username: authentication.userDisplayName })}</p>
        <p>{t("applicationShouldDisplaySoon")}</p>
        <Button onClick={authentication.signOut}>{t("signOut")}</Button>
      </AuthenticationLayout>
    );
  }

  return (
    <AuthenticationLayout title={t("authentication")}>
      <p>{t("youAreNotSignedIn")}</p>
      <p>{t("pleaseSignIn")}</p>
      <Button onClick={authentication.signIn}>{t("signIn")}</Button>
    </AuthenticationLayout>
  );
};

function AuthenticationLayout({ title, children }: { title: string } & PropsWithChildren) {
  return (
    <ViewLayout contentSize="xsmall">
      <ViewHeader>
        <ViewTitle>{title}</ViewTitle>
      </ViewHeader>
      <ViewBody>{children}</ViewBody>
    </ViewLayout>
  );
}
