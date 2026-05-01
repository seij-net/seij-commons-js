import { tokens } from "@fluentui/react-components";
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
  const editorRef = useRef<LexicalEditor | null>(null);

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
        dependencies: [
          HistoryExtension,
          ListExtension,
          CheckListExtension,
          LinkExtension,
          HorizontalRuleExtension,
          RichTextExtension,
          configExtension(ReactExtension, { contentEditable: null, ErrorBoundary: LexicalErrorBoundary }),
          configExtension(OnChangeJsonExtension, { onChange: (v) => props.onChange(JSON.stringify(v, null, 2)) }),
        ],
      }),
    [],
  );


  return (
    <LexicalExtensionComposer extension={SeijEditorExtension} contentEditable={null}>
      <RichTextEditorToolbar disabled={props.disabled} />
      <MarkdownShortcutPlugin transformers={MARKDOWN_TRANSFORMERS} />
      <ContentEditable
        aria-placeholder="Enter text"
        placeholder={<div>Enter text</div>}
        spellCheck
        style={{
          border: `1px solid ${tokens.colorNeutralStroke1}`,
          height: 160,
          overflow: "auto",
          padding: tokens.spacingHorizontalS,
        }}
      />
      <TreeViewPlugin />
    </LexicalExtensionComposer>
  );
});
