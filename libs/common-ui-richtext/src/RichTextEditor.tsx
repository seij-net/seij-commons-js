import { tokens } from "@fluentui/react-components";
import { LinkNode } from "@lexical/link";
import { $convertFromMarkdownString } from "@lexical/markdown";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { LexicalEditor } from "lexical";
import { ForwardedRef, forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { RichTextEditorToolbar } from "./RichTextEditorToolbar";
import { MARKDOWN_TRANSFORMERS, RichTextEditorBridgePlugin } from "./RichTextEditorBridgePlugin";
import { TreeView } from "@lexical/react/LexicalTreeView";
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import OnChangeJsonPlugin from "./plugins/OnChangeJsonPlugin";

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

  const initialConfig = useMemo(
    () => ({
      namespace: "SeijRichTextEditor",
      editable: !props.disabled,
      editorState: () => {
        $convertFromMarkdownString(props.value, MARKDOWN_TRANSFORMERS);
      },
      nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, HorizontalRuleNode],
      onError: (error: Error) => {
        throw error;
      },
      theme: {},
    }),
    [],
  );

  useImperativeHandle(
    ref,
    () => ({
      focus: () => editorRef.current?.focus(),
    }),
    [],
  );

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextEditorToolbar disabled={props.disabled} />
      <RichTextPlugin
        contentEditable={
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
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <ListPlugin />
      <CheckListPlugin />
      <LinkPlugin />
      <HorizontalRulePlugin />
      <MarkdownShortcutPlugin transformers={MARKDOWN_TRANSFORMERS} />
      {/*<RichTextEditorBridgePlugin {...props} editorRef={editorRef} /> */}
      <OnChangeJsonPlugin onChange={props.onChange} />
      <TreeViewPlugin />
    </LexicalComposer>
  );
});
