import { defineExtension, HISTORY_MERGE_TAG, safeCast } from "lexical";


export type OnChangeJsonConfig = {
  onChange: null | ((json: object) => void);
  ignoreSelectionChange?: boolean;
  ignoreHistoryMergeTagChange?: boolean;
};

export const OnChangeJsonExtension = defineExtension({
  name: "seij-onchange-json",
  config: safeCast<OnChangeJsonConfig>({
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
      if (config.onChange !== null) {
        const json = payload.editorState.toJSON();
        config.onChange(json);
      }
    });
  },
});
