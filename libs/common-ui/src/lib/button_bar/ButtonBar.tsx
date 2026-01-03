import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import { PropsWithChildren } from "react";

const useStyles = makeStyles({
  root: {
    display: "flex",
    columnGap: tokens.spacingHorizontalM,
  },
  variant_table_bottom_actions: {
    marginTop: tokens.spacingVerticalL,
    justifyContent: "flex-end",
  },
});

export function ButtonBar({
  children,
  variant = "default",
}: {
  variant?: "default" | "table_bottom_actions";
} & PropsWithChildren) {
  const styles = useStyles();
  const classNames = mergeClasses(
    styles.root,
    variant === "table_bottom_actions" ? styles.variant_table_bottom_actions : undefined,
  );
  return <div className={classNames}>{children}</div>;
}
