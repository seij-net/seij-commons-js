import { defineExtension, HISTORY_MERGE_TAG, safeCast } from "lexical";
import { CONTROLLED_VALUE_UPDATE_TAG } from "./ControlledValueUpdateTag";
import { $convertToMarkdownString } from "@lexical/markdown";
import { DEFAULT_TRANSFORMERS } from "@lexical/react/LexicalMarkdownShortcutPlugin";

export type JsonOnChangeExtensionConfig = {
  onChange: null | ((payload: object | string) => void);
  ignoreSelectionChange?: boolean;
  ignoreHistoryMergeTagChange?: boolean;
  format: "state" | "markdown";
};

export const JsonOnChangeExtension = defineExtension({
  name: "seij-json-onchange",
  config: safeCast<JsonOnChangeExtensionConfig>({
    onChange: null,
    ignoreSelectionChange: true,
    ignoreHistoryMergeTagChange: true,
    format: "state",
  }),
  register: (editor, config) => {
    const { ignoreSelectionChange = true, onChange, ignoreHistoryMergeTagChange = true } = config;

    return editor.registerUpdateListener((payload) => {
      if (ignoreSelectionChange && payload.dirtyElements.size === 0 && payload.dirtyLeaves.size === 0) return;
      if (ignoreHistoryMergeTagChange && payload.tags.has(HISTORY_MERGE_TAG)) return;
      if (payload.prevEditorState.isEmpty()) return;

      // This update came from props.value. Do not send it back to React as
      // onChange, otherwise we will get infinite loops of value/onChange.
      if (payload.tags.has(CONTROLLED_VALUE_UPDATE_TAG)) return;

      if (onChange !== null) {
        let result: object | string = "";
        if (config.format === "state") result = payload.editorState.toJSON();
        if (config.format === "markdown")
          result = payload.editorState.read(() => $convertToMarkdownString(DEFAULT_TRANSFORMERS));
        onChange(result);
      }
    });
  },
});
