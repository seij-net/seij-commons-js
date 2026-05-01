import { makeStyles, tokens } from "@fluentui/react-components";
import { EditorThemeClasses } from "lexical";
import { useMemo } from "react";

export const useEditorStyles = makeStyles({
  strikethrough: {
    textDecorationLine: "line-through",
  },
  underlineStrikethrough: {
    textDecorationLine: "underline line-through",
  },
  checklist: {
    listStyleType: "none",
    marginTop: 0,
    marginBottom: 0,
    paddingLeft: 0,
  },
  listitem: {
    marginTop: 0,
    marginBottom: tokens.spacingVerticalXXS,
  },
  listitemChecked: {
    display: "block",
    listStyleType: "none",
    marginLeft: "0.5em",
    marginRight: "0.5em",
    minHeight: "1.5em",
    outlineStyle: "none",
    paddingLeft: "1.5em",
    paddingRight: "1.5em",
    position: "relative",
    textDecorationLine: "line-through",
    "::before": {
      backgroundColor: tokens.colorBrandBackground,
      borderRadius: tokens.borderRadiusSmall,
      border: `1px solid ${tokens.colorBrandBackground}`,
      content: '""',
      cursor: "pointer",
      display: "block",
      height: "0.9em",
      left: 0,
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: "0.9em",
    },
    "::after": {
      borderBottomColor: tokens.colorNeutralForegroundInverted,
      borderBottomStyle: "solid",
      borderBottomWidth: "0.1em",
      borderRightColor: tokens.colorNeutralForegroundInverted,
      borderRightStyle: "solid",
      borderRightWidth: "0.1em",
      content: '""',
      cursor: "pointer",
      display: "block",
      height: "0.4em",
      left: "0.35em",
      position: "absolute",
      top: "45%",
      transform: "translateY(-50%) rotate(45deg)",
      width: "0.2em",
    },
  },
  listitemUnchecked: {
    display: "block",
    listStyleType: "none",
    marginLeft: "0.5em",
    marginRight: "0.5em",
    minHeight: "1.5em",
    outlineStyle: "none",
    paddingLeft: "1.5em",
    paddingRight: "1.5em",
    position: "relative",
    "::before": {
      backgroundColor: tokens.colorNeutralBackground1,
      borderRadius: tokens.borderRadiusSmall,
      border: `1px solid ${tokens.colorNeutralStrokeAccessible}`,
      content: '""',
      cursor: "pointer",
      display: "block",
      height: "0.9em",
      left: 0,
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: "0.9em",
    },
  },
  paragraph: {
    marginTop: 0,
    marginBottom: tokens.spacingVerticalS,
    "&:last-child": {
      marginBottom: 0,
    },
  },
  quote: {
    marginLeft: tokens.spacingVerticalS,
    borderLeft: `2px solid ${tokens.colorNeutralStroke2}`
  }
});

export const useEditorTheme = () => {
  const styles = useEditorStyles();

  return useMemo<EditorThemeClasses>(
    () => ({
      text: {
        strikethrough: styles.strikethrough,
        underlineStrikethrough: styles.underlineStrikethrough,
      },
      list: {
        checklist: styles.checklist,
        listitem: styles.listitem,
        listitemChecked: styles.listitemChecked,
        listitemUnchecked: styles.listitemUnchecked,
      },
      paragraph: styles.paragraph,
      quote: styles.quote
    }),
    [styles],
  );
};
