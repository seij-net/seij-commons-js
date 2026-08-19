import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import type { PropsWithChildren } from "react";

const useStyles = makeStyles({
  root: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    margin: "0 auto",
    maxWidth: "60rem",
    minHeight: 0,
    padding: tokens.spacingHorizontalM,
    width: "100%",
  },
});

export function DsViewFullHeightContainer({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  const styles = useStyles();

  return <div className={mergeClasses(styles.root, className)}>{children}</div>;
}
