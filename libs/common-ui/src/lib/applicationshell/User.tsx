import { Avatar, makeStyles, Spinner } from "@fluentui/react-components";
import type { UserStatus } from "./ApplicationShell.types";
import { createClickHandlers } from "./clickhandlers";

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

  if (status.errorMessage) {
    return <div>Oops... {status.errorMessage}</div>;
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

  const onClickHandlers = createClickHandlers(status.onClickSignOut);

  return (
    <a tabIndex={0} className={styles.userActionButton} {...onClickHandlers}>
      <Avatar aria-label="Non connecté" />
    </a>
  );
}
