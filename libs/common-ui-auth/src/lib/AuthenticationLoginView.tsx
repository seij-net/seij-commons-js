import { useEffect, useState } from "react";
import { useAuthentication } from "./authentication";
import { Button } from "@seij/common-ui";
import { useAuthI18n } from "./authI18n";

export const AuthenticationLoginView = ({ onClickHome }: { onClickHome: (props?: { replace: boolean }) => void }) => {
  const [rendered, setRendered] = useState(false);
  const { t } = useAuthI18n();
  const authentication = useAuthentication();
  useEffect(() => {
    if (rendered) {
      authentication.signIn();
      onClickHome();
    } else setRendered(true);
  }, [rendered]);
  const handleClickHome = () => {
    onClickHome({ replace: true });
  };

  return (
    <div>
      {t("authenticating")}
      <Button onClick={handleClickHome}>{t("backToHome")}</Button>
    </div>
  );
};
