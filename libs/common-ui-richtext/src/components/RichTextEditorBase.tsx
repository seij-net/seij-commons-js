import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import { LinkExtension } from "@lexical/link";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextExtension } from "@lexical/rich-text";
import { CheckListExtension, ListExtension } from "@lexical/list";
import { configExtension, defineExtension } from "lexical";
import { type ForwardedRef, forwardRef, type ReactElement, type RefAttributes, useMemo, useRef } from "react";
import { MainToolbarPlugin } from "./toolbar/MainToolbarPlugin";
import TreeViewComponent from "../components/TreeViewComponent";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { HistoryExtension } from "@lexical/history";
import { HorizontalRuleExtension } from "@lexical/extension";
import { ReactExtension } from "@lexical/react/ReactExtension";
import { ClearFormattingExtension } from "../extensions/ClearFormattingExtension";
import { JsonOnChangeExtension } from "../extensions/JsonOnChangeExtension";
import { useEditorTheme } from "../styles/richtext-editor-styles";
import { EditorRefExtension, type RichTextEditorRef, useEditorRef } from "../extensions/EditorRefExtension";
import { ExternalValueSync } from "./external-value-sync/ExternalValueSync";
import { LinkEditorPlugin } from "./link/LinkEditorPlugin";
import { CodeShikiExtension } from "@lexical/code-shiki";
import { useRichTextI18n } from "../utils/useRichTextI18n";

const useStyles = makeStyles({
  editor: {
    display: "flex",
    flexDirection: "column",
    maxHeight: "100vh",
    minHeight: 0,
  },
  contentViewport: {
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    minHeight: 0,
    overflow: "auto",
    paddingLeft: tokens.spacingHorizontalS,
    paddingRight: tokens.spacingHorizontalS,
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalS,
    position: "relative",
  },
  contentEditable: {
    minHeight: "320px",
    outlineStyle: "none",
  },
});

/**
 * Used to customize various parts of the editor. Give them CSS classnames.
 */
export interface RichTextEditorClassNames {
  /**
   * Root of the component, includes the toolbar and editor
   */
  editor?: string;
  /**
   * Visible area/scrollable around the editable content
   */
  contentViewport?: string;
  /**
   * Editable content area (the ContentEditable itself)
   */
  contentEditable?: string;
}

export interface RichTextEditorBaseProps<EXTERNAL_VALUE> {
  value: EXTERNAL_VALUE;
  valueRevision: number;
  disabled: boolean;
  debug?: boolean;
  onChange: (value: EXTERNAL_VALUE) => void;
  format: "markdown" | "state";
  classNames?: RichTextEditorClassNames;
}

function RichTextEditorBaseComponent<EXTERNAL_VALUE>(
  props: RichTextEditorBaseProps<EXTERNAL_VALUE>,
  ref: ForwardedRef<RichTextEditorRef>,
) {
  const styles = useStyles();
  const { editorRef, pendingFocusRef } = useEditorRef(ref);
  const theme = useEditorTheme();
  const { t } = useRichTextI18n();

  // We copy the onChange coming from the props when they change
  // in a stable ref, so that the memoization give a stable extension.
  const onChangeRef = useRef(props.onChange);
  onChangeRef.current = props.onChange;

  const debug = props.debug ?? false;
  const contentEditablePlaceholder = t("contentEditablePlaceholder");

  const SeijEditorExtension = useMemo(
    () =>
      defineExtension({
        name: "SeijEditorExtension",
        theme,
        dependencies: [
          configExtension(EditorRefExtension, { editorRef, pendingFocusRef }),
          //CodeExtension,
          CodeShikiExtension,
          HistoryExtension,
          ListExtension,
          CheckListExtension,
          LinkExtension,
          HorizontalRuleExtension,
          RichTextExtension,
          ClearFormattingExtension,
          configExtension(ReactExtension, { contentEditable: null, ErrorBoundary: LexicalErrorBoundary }),
          configExtension(JsonOnChangeExtension, {
            format: props.format,
            onChange: (payload) => {
              onChangeRef.current(payload as EXTERNAL_VALUE);
            },
          }),
        ],
      }),
    [editorRef, pendingFocusRef, theme, props.format],
  );

  return (
    <LexicalExtensionComposer extension={SeijEditorExtension} contentEditable={null}>
      <div className={mergeClasses(styles.editor, props.classNames?.editor)}>
        <MainToolbarPlugin disabled={props.disabled} />
        <MarkdownShortcutPlugin />
        <ExternalValueSync value={props.value} valueRevision={props.valueRevision} format={props.format} />
        <div className={mergeClasses(styles.contentViewport, props.classNames?.contentViewport)}>
          <ContentEditable
            aria-placeholder={contentEditablePlaceholder}
            className={mergeClasses(styles.contentEditable, props.classNames?.contentEditable, "notranslate")}
            placeholder={<div>{contentEditablePlaceholder}</div>}
            spellCheck
            translate={"no"}
          />
        </div>
      </div>
      {debug && <TreeViewComponent />}
      <LinkEditorPlugin disabled={props.disabled} />
    </LexicalExtensionComposer>
  );
}

export const RichTextEditorBase = forwardRef(RichTextEditorBaseComponent) as <EXTERNAL_VALUE>(
  props: RichTextEditorBaseProps<EXTERNAL_VALUE> & RefAttributes<RichTextEditorRef>,
) => ReactElement | null;
