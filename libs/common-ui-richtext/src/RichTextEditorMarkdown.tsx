import { type ForwardedRef, forwardRef } from "react";
import { type RichTextEditorRef } from "./extensions/EditorRefExtension";
import { RichTextEditorBase } from "./components/RichTextEditorBase";

export type { RichTextEditorRef };

type Markdown = string;

export interface RichTextEditorMarkdownProps {
  value: Markdown;
  disabled: boolean;
  onChange: (value: Markdown) => void;
  debug?: boolean;
}

export const RichTextEditorMarkdown = forwardRef(function RichTextEditorJson(
  props: RichTextEditorMarkdownProps,
  ref: ForwardedRef<RichTextEditorRef>,
) {
  return (
    <RichTextEditorBase<string>
      value={props.value}
      format={"markdown"}
      disabled={props.disabled}
      debug={props.debug}
      ref={ref}
      onChange={props.onChange}
    />
  );
});
