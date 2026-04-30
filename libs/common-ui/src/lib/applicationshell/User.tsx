import { Avatar, makeStyles, Spinner, Tooltip } from "@fluentui/react-components";
import type { UserStatus } from "./ApplicationShell.types";
import { createClickHandlers } from "./clickhandlers";
import { Icon } from "@seij/common-ui-icons";

const useStyles = makeStyles({
  userActionButton: {
    width: "100%",
    height: "100%",
    display: "inline-block",
    textAlign: "center",
  },
});
export function User({ status }: { status: UserStatus }) {
  const styles = useStyles();

  if (status.isLoading) {
    return <Spinner />;
  }

  const onClickHandlers = createClickHandlers(status.onClickSignOut);

  if (status.errorMessage) {
    return (
      <Tooltip content={status.errorMessage} relationship="description">
        <a tabIndex={0} className={styles.userActionButton} {...onClickHandlers}>
          <Avatar aria-label="Erreur de chargement utilisateur" icon={<Icon name={"error"}/>} />
        </a>
      </Tooltip>
    );
  }

  if (status.isAuthenticated) {
    const name = status.userName ?? "";
    const onClickHandlers = createClickHandlers(status.onClickSignIn);
    return (
      <a tabIndex={0} className={styles.userActionButton} {...onClickHandlers}>
        <Avatar aria-label={name} name={name} />
      </a>
    );
  }



  return (
    <a tabIndex={0} className={styles.userActionButton} {...onClickHandlers}>
      <Avatar aria-label="Non connecté" />
    </a>
  );
}
