import { type SerializedEditorState } from "lexical";
import { type ForwardedRef, forwardRef } from "react";
import { type RichTextEditorRef } from "./extensions/EditorRefExtension";
import { RichTextEditorBase } from "./components/RichTextEditorBase";
import { useExternalValueSyncBarrier } from "./components/external-value-sync/ExternalValueSync";

export interface RichTextEditorJsonProps {
  value: SerializedEditorState;
  disabled: boolean;
  onChange: (value: SerializedEditorState) => void;
  debug?: boolean;
}

function jsonEquality(previous: SerializedEditorState, next: SerializedEditorState) {
  return previous === next;
}

export const RichTextEditorJson = forwardRef(function RichTextEditorJson(
  props: RichTextEditorJsonProps,
  ref: ForwardedRef<RichTextEditorRef>,
) {
  const { lastKnownValue, revision, handleChange } = useExternalValueSyncBarrier(
    props.value,
    props.onChange,
    jsonEquality,
  );

  return (
    <RichTextEditorBase<SerializedEditorState>
      value={lastKnownValue}
      valueRevision={revision}
      disabled={props.disabled}
      debug={props.debug}
      ref={ref}
      format={"state"}
      onChange={handleChange}
    />
  );
});
