import { makeStyles, tokens } from "@fluentui/react-components";

export const useFilterRowStyles = makeStyles({
  filterRow: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
  },
  fieldLabel: {
    fontWeight: tokens.fontWeightSemibold,
    minWidth: "80px",
    maxWidth: "100px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  filterValue: {
    flex: 1,
    minWidth: 0,
  },
});
