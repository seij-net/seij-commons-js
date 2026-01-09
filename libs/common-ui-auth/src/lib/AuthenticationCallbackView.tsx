import { useEffect, useState } from "react";
import { useAuthentication } from "./authentication";
import { Button } from "@seij/common-ui";
import { useAuthI18n } from "./authI18n";

export const AuthenticationCallbackView = ({ onClickHome }: { onClickHome: () => void }) => {
  const [rendered, setRendered] = useState(false);

  const handleClickHome = () => {
    onClickHome();
  };

  const authentication = useAuthentication();

  const { t } = useAuthI18n();

  useEffect(() => {
    if (rendered) handleClickHome();
    else setRendered(true);
  }, [rendered]);

  switch (authentication.activeNavigator) {
    case "signinSilent":
      return <div>{t("authenticating")}</div>;
    case "signoutRedirect":
      return <div>{t("disconnecting")}</div>;
  }

  if (authentication.isLoading) {
    return <div>{t("authenticationLoading")}</div>;
  }

  if (authentication.error) {
    return <div>Oops... {authentication.error.message}</div>;
  }

  return (
    <div>
      <div>{t("authenticationSuccess")}</div>
      <div>
        <Button onClick={handleClickHome}>{t("backToHome")}</Button>
      </div>
    </div>
  );
};
