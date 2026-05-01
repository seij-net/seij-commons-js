import { makeStyles, tokens } from "@fluentui/react-components";
import { LinkExtension } from "@lexical/link";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextExtension } from "@lexical/rich-text";
import { CheckListExtension, ListExtension } from "@lexical/list";
import { configExtension, defineExtension } from "lexical";
import { type ForwardedRef, forwardRef, type ReactElement, type RefAttributes, useMemo } from "react";
import { RichTextEditorToolbar } from "../components/RichTextEditorToolbar";
import { MARKDOWN_TRANSFORMERS } from "../RichTextEditorBridgePlugin";
import TreeViewComponent from "../components/TreeViewComponent";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { HistoryExtension } from "@lexical/history";
import { HorizontalRuleExtension } from "@lexical/extension";
import { ReactExtension } from "@lexical/react/ReactExtension";
import { ClearFormattingExtension } from "../extensions/ClearFormattingExtension";
import { JsonOnChangeExtension } from "../extensions/JsonOnChangeExtension";
import { useEditorTheme } from "../styles/richtext-editor-styles";
import { EditorRefExtension, type RichTextEditorRef, useEditorRef } from "../extensions/EditorRefExtension";

const useStyles = makeStyles({
  editorArea: {
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    height: "160px",
    overflow: "auto",
    paddingLeft: tokens.spacingHorizontalS,
    paddingRight: tokens.spacingHorizontalS,
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalS,
  },
});
export interface RichTextEditorBaseProps<EXTERNAL_VALUE> {
  value: EXTERNAL_VALUE;
  disabled: boolean;
  debug?: boolean;
}

function RichTextEditorBaseComponent<EXTERNAL_VALUE>(
  props: RichTextEditorBaseProps<EXTERNAL_VALUE>,
  ref: ForwardedRef<RichTextEditorRef>,
) {
  const styles = useStyles();
  const editorRef = useEditorRef(ref);
  const theme = useEditorTheme();

  const debug = props.debug ?? false;

  const SeijEditorExtension = useMemo(
    () =>
      defineExtension({
        name: "SeijEditorExtension",
        theme,
        dependencies: [
          configExtension(EditorRefExtension, { editorRef }),
          HistoryExtension,
          ListExtension,
          CheckListExtension,
          LinkExtension,
          HorizontalRuleExtension,
          RichTextExtension,
          ClearFormattingExtension,
          configExtension(ReactExtension, { contentEditable: null, ErrorBoundary: LexicalErrorBoundary }),
          configExtension(JsonOnChangeExtension, {
            onChange: (payload) => {
              /* TODO() */
            },
          }),
        ],
      }),
    [editorRef, theme],
  );

  return (
    <LexicalExtensionComposer extension={SeijEditorExtension} contentEditable={null}>
      <RichTextEditorToolbar disabled={props.disabled} />
      <MarkdownShortcutPlugin transformers={MARKDOWN_TRANSFORMERS} />
      <ContentEditable
        aria-placeholder="Enter text"
        placeholder={<div>Enter text</div>}
        spellCheck
        className={styles.editorArea}
      />
      {debug && <TreeViewComponent />}
    </LexicalExtensionComposer>
  );
}

export const RichTextEditorBase = forwardRef(RichTextEditorBaseComponent) as <EXTERNAL_VALUE>(
  props: RichTextEditorBaseProps<EXTERNAL_VALUE> & RefAttributes<RichTextEditorRef>,
) => ReactElement | null;
