import { type ForwardedRef, forwardRef } from "react";
import { type RichTextEditorRef } from "./extensions/EditorRefExtension";
import { RichTextEditorBase } from "./components/RichTextEditorBase";
import { useExternalValueSyncBarrier } from "./components/ExternalValueSync";

export type { RichTextEditorRef };

type Markdown = string;

export interface RichTextEditorMarkdownProps {
  value: Markdown;
  disabled: boolean;
  onChange: (value: Markdown) => void;
  debug?: boolean;
}
function markdownEquality(previous: Markdown, next: Markdown) {
  return previous === next;
}
export const RichTextEditorMarkdown = forwardRef(function RichTextEditorJson(
  props: RichTextEditorMarkdownProps,
  ref: ForwardedRef<RichTextEditorRef>,
) {
  const { lastKnownValue, revision, handleChange } = useExternalValueSyncBarrier(
    props.value,
    props.onChange,
    markdownEquality,
  );

  return (
    <RichTextEditorBase<string>
      value={lastKnownValue}
      valueRevision={revision}
      format={"markdown"}
      disabled={props.disabled}
      debug={props.debug}
      ref={ref}
      onChange={handleChange}
    />
  );
});
