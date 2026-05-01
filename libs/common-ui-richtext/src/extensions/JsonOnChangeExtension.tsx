import { defineExtension, HISTORY_MERGE_TAG, safeCast, UpdateListenerPayload } from "lexical";
import { CONTROLLED_VALUE_UPDATE_TAG } from "./ControlledValueUpdateTag";

export type JsonOnChangeExtensionConfig = {
  onChange: null | ((payload: UpdateListenerPayload) => void);
  ignoreSelectionChange?: boolean;
  ignoreHistoryMergeTagChange?: boolean;
};

export const JsonOnChangeExtension = defineExtension({
  name: "seij-json-onchange",
  config: safeCast<JsonOnChangeExtensionConfig>({
    onChange: null,
    ignoreSelectionChange: true,
    ignoreHistoryMergeTagChange: true,
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
        onChange(payload);
      }
    });
  },
});
