import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef, useState } from "react";
import { SerializedEditorState } from "lexical";
import { CONTROLLED_VALUE_UPDATE_TAG } from "../extensions/ControlledValueUpdateTag";
import { $convertFromMarkdownString } from "@lexical/markdown";
import { MARKDOWN_TRANSFORMERS } from "../RichTextEditorBridgePlugin";

export function ExternalValueSync<EXTERNAL_VALUE>({
  value,
  valueRevision,
  format,
}: {
  value: EXTERNAL_VALUE;
  valueRevision: number;
  format: "state" | "markdown";
}) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (format == "state") {
      const serialized = value as SerializedEditorState;
      editor.setEditorState(editor.parseEditorState(serialized), {
        tag: CONTROLLED_VALUE_UPDATE_TAG,
      });
    } else if (format == "markdown") {
      const serialized = value as string;
      editor.update(() => $convertFromMarkdownString(serialized, MARKDOWN_TRANSFORMERS), {
        tag: CONTROLLED_VALUE_UPDATE_TAG,
      });
    }
  }, [
    // Only add valueRevision here, never add value because we do not
    // want to change on value, but only on revision.
    valueRevision,
  ]);
  return null;
}

export function useExternalValueSyncBarrier<T>(
  externalValue: T,
  onChange: (value: T) => void,
  equalityFn: (previous: T, next: T) => boolean,
) {
  const [revision, setRevision] = useState(0);

  const valueRef = useRef<{ lastKnown: T; origin: "props" | "change"; revision: number }>({
    lastKnown: externalValue,
    origin: "props",
    revision: 0,
  });

  useEffect(() => {
    if (equalityFn(valueRef.current.lastKnown, externalValue)) return;
    valueRef.current.origin = "props";
    valueRef.current.lastKnown = externalValue;
    setRevision((revision) => revision + 1);
  }, [externalValue]);

  const handleChange = (value: T) => {
    valueRef.current.origin = "change";
    valueRef.current.lastKnown = value;
    onChange(value);
  };

  return {
    lastKnownValue: valueRef.current.lastKnown,
    revision: revision,
    handleChange: handleChange,
  };
}
