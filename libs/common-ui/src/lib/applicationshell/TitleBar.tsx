import { Avatar, makeStyles, Spinner, Text, tokens, useKeyboardNavAttribute } from "@fluentui/react-components";
import { KeyboardEventHandler, ReactNode } from "react";
import { UserStatus } from "./ApplicationShell.types";
import { Icon } from "@seij/common-ui-icons";

const useTitleBarStyles = makeStyles({
  root: {
    height: "48px",
    lineHeight: "48px",
    width: "100%",
  },
  appBar: {
    display: "flex",
    color: tokens.colorNeutralForegroundOnBrand,
    backgroundColor: tokens.colorBrandBackground,
    width: "100%",
    maxWidth: "100%",
  },
  launcher: {
    width: "48px",
    minWidth: "48px",
    height: "48px",
    lineHeight: "48px",
    flex: 0,
    textAlign: "center",
    ":hover": {
      background: tokens.colorBrandBackgroundHover,
      cursor: "pointer",
    },
  },
  launcher_icon: {
    fontSize: "24px",
    "& img": {
      maxWidth: "32px",
      maxHeight: "32px",
      verticalAlign: "text-top"
    },
  },
  title: {
    height: "48px",
    flex: 1,
    whiteSpace: "nowrap",
  },
  actions: {
    height: "48px",
    minWidth: "48px",
    flex: 0,
    display: "flex",
    justifyContent: "space-around",
  },
  home: {
    width: "100%",
    height: "100%",
    display: "inline-block",
  },
  userActionButton: {
    width: "100%",
    height: "100%",
    display: "inline-block",
    textAlign: "center",
  },
});

export function TitleBar({
  hamburger,
  onClickHome,
  userStatus,
  applicationName,
  applicationIcon,
}: {
  userStatus: UserStatus;
  applicationName: ReactNode;
  applicationIcon?: ReactNode;
  hamburger: ReactNode | null;
  onClickHome: () => void;
}) {
  const styles = useTitleBarStyles();
  return (
    <div className={styles.root}>
      <div className={styles.appBar}>
        {hamburger ? <div className={styles.launcher}>{hamburger}</div> : null}
        <div className={styles.launcher}>
          <Home applicationIcon={applicationIcon} onClick={onClickHome} />
        </div>
        <div className={styles.title}>
          <Text weight="semibold">{applicationName}</Text>
        </div>
        <div className={styles.actions}>
          <User status={userStatus} />
        </div>
      </div>
    </div>
  );
}

function Home({ applicationIcon, onClick }: { applicationIcon?: ReactNode; onClick: () => void }) {
  const styles = useTitleBarStyles();
  const ref = useKeyboardNavAttribute<HTMLAnchorElement>();
  const onClickHandlers = createClickHandlers(onClick);
  return (
    <a tabIndex={0} {...onClickHandlers} className={styles.home} aria-label="Accueil" ref={ref}>
      {applicationIcon ? <span className={styles.launcher_icon}>{applicationIcon}</span> : <Icon name="genericapp" className={styles.launcher_icon} />}
    </a>
  );
}

export function User({ status }: { status: UserStatus }) {
  const styles = useTitleBarStyles();

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

const createClickHandlers = (onClick: () => void) => {
  const handleKeyUp: KeyboardEventHandler<HTMLAnchorElement> = (e) => {
    const correct = e.key === "Enter" || e.key === " ";
    if (correct) {
      onClick();
      e.preventDefault();
    }
  };
  return {
    onClick: onClick,
    onKeyUp: handleKeyUp,
  };
};
