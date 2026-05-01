import { makeStyles, tokens } from "@fluentui/react-components";
import { LinkExtension } from "@lexical/link";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextExtension } from "@lexical/rich-text";
import { CheckListExtension, ListExtension } from "@lexical/list";
import { configExtension, defineExtension, LexicalEditor } from "lexical";
import { ForwardedRef, forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { RichTextEditorToolbar } from "./RichTextEditorToolbar";
import { MARKDOWN_TRANSFORMERS } from "./RichTextEditorBridgePlugin";
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { HistoryExtension } from "@lexical/history";
import { HorizontalRuleExtension } from "@lexical/extension";
import { ReactExtension } from "@lexical/react/ReactExtension";
import { OnChangeJsonExtension } from "./extensions/OnChangeJsonExtension";
import { ClearFormattingExtension } from "./extensions/ClearFormattingExtension";
import { useEditorTheme } from "./styles/richtext-editor-styles";

const useStyles = makeStyles({

  editorArea: {
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    height: "160px",
    overflow: "auto",
    paddingLeft: tokens.spacingHorizontalS,
    paddingRight: tokens.spacingHorizontalS,
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalS,
    "& p": {
      marginTop: 0,
      marginBottom: tokens.spacingVerticalS,
    },
    "& p:last-child": {
      marginBottom: 0,
    },
  },
});

export interface RichTextEditorHandle {
  focus: () => void;
}

export interface RichTextEditorProps {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}

export const RichTextEditor = forwardRef(function RichTextEditor(
  props: RichTextEditorProps,
  ref: ForwardedRef<RichTextEditorHandle>,
) {
  const styles = useStyles();
  const editorRef = useRef<LexicalEditor | null>(null);
  const theme = useEditorTheme();

  const onChangeRef = useRef(props.onChange);
  onChangeRef.current = props.onChange;

  useImperativeHandle(
    ref,
    () => ({
      focus: () => editorRef.current?.focus(),
    }),
    [],
  );

  const SeijEditorExtension = useMemo(
    () =>
      defineExtension({
        name: "SeijEditorExtension",
        theme,
        dependencies: [
          HistoryExtension,
          ListExtension,
          CheckListExtension,
          LinkExtension,
          HorizontalRuleExtension,
          RichTextExtension,
          ClearFormattingExtension,
          configExtension(ReactExtension, { contentEditable: null, ErrorBoundary: LexicalErrorBoundary }),
          configExtension(OnChangeJsonExtension, { onChange: (v) => onChangeRef.current(JSON.stringify(v, null, 2)) }),
        ],
      }),
    [theme],
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
      <TreeViewPlugin />
    </LexicalExtensionComposer>
  );
});
