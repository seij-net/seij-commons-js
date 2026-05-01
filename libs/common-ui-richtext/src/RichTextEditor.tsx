import { makeStyles, tokens } from "@fluentui/react-components";
import { LinkExtension } from "@lexical/link";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextExtension } from "@lexical/rich-text";
import { CheckListExtension, ListExtension } from "@lexical/list";
import { configExtension, defineExtension, type SerializedEditorState } from "lexical";
import {
  type ForwardedRef,
  forwardRef,
  type ReactElement,
  type RefAttributes,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { RichTextEditorToolbar } from "./RichTextEditorToolbar";
import { MARKDOWN_TRANSFORMERS } from "./RichTextEditorBridgePlugin";
import TreeViewComponent from "./components/TreeViewComponent";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { HistoryExtension } from "@lexical/history";
import { HorizontalRuleExtension } from "@lexical/extension";
import { ReactExtension } from "@lexical/react/ReactExtension";
import { ClearFormattingExtension } from "./extensions/ClearFormattingExtension";
import { JsonOnChangeExtension } from "./extensions/JsonOnChangeExtension";
import { useEditorTheme } from "./styles/richtext-editor-styles";
import { EditorRefExtension, type RichTextEditorRef, useEditorRef } from "./extensions/EditorRefExtension";
import { CONTROLLED_VALUE_UPDATE_TAG } from "./extensions/ControlledValueUpdateTag";

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

export type { RichTextEditorRef };

const toJsonLexicalValue = (value: SerializedEditorState) => value;
const fromJsonLexicalValue = (value: SerializedEditorState) => value;

export interface RichTextEditorJsonProps {
  value: SerializedEditorState;
  disabled: boolean;
  onChange: (value: SerializedEditorState) => void;
  debug?: boolean;
}

export const RichTextEditorJson = forwardRef(function RichTextEditorJson(
  props: RichTextEditorJsonProps,
  ref: ForwardedRef<RichTextEditorRef>,
) {
  return (
    <RichTextEditorBase<SerializedEditorState>
      value={props.value}
      disabled={props.disabled}
      debug={props.debug}
      ref={ref}
      toLexicalValue={toJsonLexicalValue}
      fromLexicalValue={fromJsonLexicalValue}
      onChange={props.onChange}
    />
  );
});

export const RichTextEditor = RichTextEditorJson;

export interface RichTextEditorBaseProps<EXTERNAL_VALUE> {
  value: EXTERNAL_VALUE;
  disabled: boolean;
  debug?: boolean;
  toLexicalValue: (value: EXTERNAL_VALUE) => SerializedEditorState;
  fromLexicalValue: (value: SerializedEditorState) => EXTERNAL_VALUE;
  onChange: (value: EXTERNAL_VALUE) => void;
}

function RichTextEditorBaseComponent<EXTERNAL_VALUE>(
  props: RichTextEditorBaseProps<EXTERNAL_VALUE>,
  ref: ForwardedRef<RichTextEditorRef>,
) {
  const styles = useStyles();
  const editorRef = useEditorRef(ref);
  const theme = useEditorTheme();

  const lastAppliedValueRef = useRef<EXTERNAL_VALUE | null>(null);
  const lastEmittedValueRef = useRef<EXTERNAL_VALUE | null>(null);
  const fromLexicalValueRef = useRef(props.fromLexicalValue);
  const onChangeRef = useRef(props.onChange);

  fromLexicalValueRef.current = props.fromLexicalValue;
  onChangeRef.current = props.onChange;

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
            onChange: (value) => {
              const externalValue = fromLexicalValueRef.current(value);
              lastEmittedValueRef.current = externalValue;
              onChangeRef.current(externalValue);
            },
          }),
        ],
      }),
    [editorRef, theme],
  );

  useEffect(() => {
    const editor = editorRef.current;

    if (editor === null) {
      return;
    }

    if (props.value === lastAppliedValueRef.current || props.value === lastEmittedValueRef.current) {
      return;
    }

    lastAppliedValueRef.current = props.value;

    const lexicalValue: SerializedEditorState = props.toLexicalValue(props.value);
    editor.setEditorState(editor.parseEditorState(lexicalValue), {
      tag: CONTROLLED_VALUE_UPDATE_TAG,
    });
  }, [editorRef, props.value, props.toLexicalValue]);

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
