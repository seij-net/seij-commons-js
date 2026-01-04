import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import { PropsWithChildren } from "react";

const useStyles = makeStyles({
  root: {
    display: "flex",
    columnGap: tokens.spacingHorizontalM,
  },
  variant_end: {
    justifyContent: "flex-end",
  },
  variant_table_bottom_actions: {
    marginTop: tokens.spacingVerticalL,
    justifyContent: "flex-end",
  },
});

type Variant = "default" | "end" | "table_bottom_actions";

const variantClass = (variant: Variant, styles: ReturnType<typeof useStyles>) => {
  switch (variant) {
    case "end":
      return styles.variant_end;
    case "table_bottom_actions":
      return styles.variant_table_bottom_actions;
    default:
      return undefined;
  }
};

export function ButtonBar({
  children,
  variant = "default",
}: {
  variant?: Variant;
} & PropsWithChildren) {
  const styles = useStyles();
  const classNames = mergeClasses(styles.root, variantClass(variant, styles));
  return <div className={classNames}>{children}</div>;
}
