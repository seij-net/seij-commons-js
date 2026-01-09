import { Button } from "@seij/common-ui";
import { useEffect, useState } from "react";
import { useAuthentication } from "./authentication";
import { useAuthI18n } from "./authI18n";

export const AuthenticationLogoutView = ({ onClickHome }: { onClickHome: (props?: { replace: boolean }) => void }) => {
  const [rendered, setRendered] = useState(false);
  const { t } = useAuthI18n();
  const authentication = useAuthentication();
  useEffect(() => {
    if (rendered) {
      authentication.signOut();
      onClickHome();
    } else setRendered(true);
  }, [rendered]);
  const handleClickHome = () => {
    onClickHome({ replace: true });
  };

  return (
    <div>
      {t("disconnecting")} <Button onClick={handleClickHome}>{t("backToHome")}</Button>
    </div>
  );
};
