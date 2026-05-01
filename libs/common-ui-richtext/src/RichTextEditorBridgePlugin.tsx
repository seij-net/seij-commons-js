import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  CHECK_LIST,
  HEADING,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  LINK,
  ORDERED_LIST,
  QUOTE,
  STRIKETHROUGH,
  Transformer,
  UNORDERED_LIST,
} from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createHorizontalRuleNode,
  $isHorizontalRuleNode,
  HorizontalRuleNode,
} from "@lexical/react/LexicalHorizontalRuleNode";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState, LexicalEditor } from "lexical";
import { MutableRefObject, useCallback, useEffect, useRef } from "react";

interface RichTextEditorBridgePluginProps {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  editorRef: MutableRefObject<LexicalEditor | null>;
}

export function RichTextEditorBridgePlugin({ value, disabled, onChange, editorRef }: RichTextEditorBridgePluginProps) {
  const [editor] = useLexicalComposerContext();
  const currentValueRef = useRef(value);
  const lastEmittedValueRef = useRef<string | null>(null);
  const lastAppliedValueRef = useRef<string | null>(null);
  const isApplyingExternalValueRef = useRef(false);

  useEffect(() => {
    currentValueRef.current = value;
  }, [value]);

  useEffect(() => {
    editorRef.current = editor;
    return () => {
      if (editorRef.current === editor) {
        editorRef.current = null;
      }
    };
  }, [editor, editorRef]);

  useEffect(() => {
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  useEffect(() => {
    if (value === lastEmittedValueRef.current || value === lastAppliedValueRef.current) {
      return;
    }

    lastAppliedValueRef.current = value;
    isApplyingExternalValueRef.current = true;
    setEditorStateFromMarkdown(editor, value);
  }, [editor, value]);

  const handleChange = useCallback(
    (editorState: EditorState) => {
      if (isApplyingExternalValueRef.current) {
        isApplyingExternalValueRef.current = false;
        return;
      }

      const nextValue = editorState.read(() => $convertToMarkdownString(MARKDOWN_TRANSFORMERS));
      lastEmittedValueRef.current = nextValue;

      if (nextValue !== currentValueRef.current) {
        onChange(nextValue);
      }
    },
    [onChange],
  );

  return <OnChangePlugin ignoreSelectionChange onChange={handleChange} />;
}

function setEditorStateFromMarkdown(editor: LexicalEditor, value: string) {
  editor.update(() => {
    $convertFromMarkdownString(value, MARKDOWN_TRANSFORMERS);
  });
}

const HORIZONTAL_RULE: Transformer = {
  dependencies: [HorizontalRuleNode],
  export: (node) => ($isHorizontalRuleNode(node) ? "---" : null),
  regExp: /^(---|\*\*\*|___)\s?$/,
  replace: (parentNode) => {
    parentNode.replace($createHorizontalRuleNode());
  },
  type: "element",
};

export const MARKDOWN_TRANSFORMERS: Transformer[] = [
  HORIZONTAL_RULE,
  HEADING,
  QUOTE,
  UNORDERED_LIST,
  ORDERED_LIST,
  CHECK_LIST,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  STRIKETHROUGH,
  LINK,
];
