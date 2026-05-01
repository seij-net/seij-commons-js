import { $removeList } from "@lexical/list";
import { $setBlocksType } from "@lexical/selection";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  defineExtension,
} from "lexical";

/**
 * Command exported, so the toolbar can call it
 */
export const CLEAR_FORMATTING_COMMAND = createCommand<void>("CLEAR_FORMATTING_COMMAND");

/**
 * Extension to remove direct styling
 */
export const ClearFormattingExtension = defineExtension({
  name: "seij-clear-formatting",
  register: (editor) =>
    editor.registerCommand(
      CLEAR_FORMATTING_COMMAND,
      () => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection)) {
          return false;
        }

        selection.setFormat(0);
        selection.setStyle("");

        for (const node of selection.extract()) {
          if ($isTextNode(node)) {
            node.setFormat(0);
            node.setStyle("");
          }
        }

        $removeList();
        $setBlocksType($getSelection(), () => $createParagraphNode());

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    ),
});
