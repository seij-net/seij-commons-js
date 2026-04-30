import {
  Avatar,
  makeStyles,
  Menu,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Spinner,
  Text,
  tokens,
} from "@fluentui/react-components";
import type { ReactNode } from "react";
import type { UserStatus as ApplicationUserStatus } from "./ApplicationShell.types";
import { Icon } from "@seij/common-ui-icons";

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100%",
    display: "inline-flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    minWidth: 0,
  },
  action: {
    width: "100%",
    height: "100%",
    border: "0",
    backgroundColor: "transparent",
    cursor: "pointer",
    color: "inherit",
    font: "inherit",
    textDecorationLine: "none",
  },
  icon: {
    justifyContent: "center",
    padding: "0",
  },
  full: {
    justifyContent: "flex-start",
    paddingInline: tokens.spacingHorizontalS,
    paddingBlock: tokens.spacingVerticalXS,
  },
  text: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
});

export interface UserProps {
  status: ApplicationUserStatus;
  variant?: "full" | "icon";
}

interface UserStatusViewProps {
  variant: UserProps["variant"];
  ariaLabel: string;
  visual: ReactNode;
  text?: ReactNode;
  menu: ReactNode;
}

export function User({ status, variant = "icon" }: UserProps) {
  if (status.isLoading) {
    return <UserLoading variant={variant} />;
  }

  if (status.errorMessage) {
    return <UserError status={status} variant={variant} />;
  }

  if (status.isAuthenticated) {
    return <UserAuthenticated status={status} variant={variant} />;
  }

  return <UserUnauthenticated status={status} variant={variant} />;
}

function UserLoading({ variant }: { variant: UserProps["variant"] }) {
  return (
    <UserStatusView
      variant={variant}
      ariaLabel="Chargement utilisateur"
      visual={<Avatar aria-label="Chargement utilisateur" icon={<Spinner size="tiny" />} />}
      text="Chargement..."
      menu={<MenuItem disabled>Chargement...</MenuItem>}
    />
  );
}

function UserError({ status, variant }: UserProps) {
  return (
    <UserStatusView
      variant={variant}
      ariaLabel="Erreur de connexion"
      visual={<Avatar aria-label="Erreur de connexion" icon={<Icon name="error" />} />}
      text={status.errorMessage ?? ""}
      menu={
        <>
          <MenuItem disabled>{status.errorMessage}</MenuItem>
          <MenuDivider />
          <MenuItem onClick={status.onClickSignIn}>Se connecter</MenuItem>
        </>
      }
    />
  );
}

function UserAuthenticated({ status, variant }: UserProps) {
  const name = status.userName ?? "";

  return (
    <UserStatusView
      variant={variant}
      ariaLabel={name}
      visual={<Avatar aria-label={name} name={name} />}
      text={name}
      menu={
        <>
          <MenuItem disabled>{name}</MenuItem>
          <MenuDivider />
          <MenuItem onClick={status.onClickSignOut}>Se déconnecter</MenuItem>
        </>
      }
    />
  );
}

function UserUnauthenticated({ status, variant }: UserProps) {
  return (
    <UserStatusView
      variant={variant}
      ariaLabel="Non connecté"
      visual={<Avatar aria-label="Non connecté" />}
      text="Se connecter"
      menu={<MenuItem onClick={status.onClickSignIn}>Se connecter</MenuItem>}
    />
  );
}

function UserStatusView({ variant, ariaLabel, visual, text, menu }: UserStatusViewProps) {
  const styles = useStyles();
  const isFull = variant === "full";
  const content = (
    <>
      {visual}
      {isFull && text !== undefined ? <Text className={styles.text}>{text}</Text> : null}
    </>
  );

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <button
          type="button"
          className={`${styles.root} ${styles.action} ${isFull ? styles.full : styles.icon}`}
          aria-label={ariaLabel}
        >
          {content}
        </button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>{menu}</MenuList>
      </MenuPopover>
    </Menu>
  );
}
