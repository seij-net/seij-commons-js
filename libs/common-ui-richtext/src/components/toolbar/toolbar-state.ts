import { $isHeadingNode, $isQuoteNode, HeadingTagType } from "@lexical/rich-text";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  type LexicalEditor,
  mergeRegister,
  RangeSelection,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { $isListNode } from "@lexical/list";
import { $isCodeNode } from "@lexical/code-core";
import { $findCodeLanguage, $findTopLevelElement, $isInsideLink } from "../../utils/lexical-utils";

/**
 * State that indicates
 *
 * - which kind of block where the current cursor is (title, h1, paragraph, link ...).
 *   There can be only one at the same time
 * - the text modifiers currently active (bold, italic, etc.)
 *   There can be multiple at the same time
 */
export interface ToolbarState {
  /**
   * Type of bloc where the selection anchor is
   */
  blockType: ToolbarStateBlocType;
  /**
   * Indicates the language when the bloc type is "code"
   */
  blockCodeLanguage: string;
  /**
   * Indicates the current selection is on a bold part
   */
  bold: boolean;
  /**
   * Indicates the current selection is on an inline code part (don't confuse that with code block)
   */
  inlineCode: boolean;
  /**
   * Indicates the current selection is in an italic part
   */
  italic: boolean;
  /**
   * Indicates the current selection is in a link
   */
  link: boolean;
  /**
   * Indicates the current selection is in a strikethrough part
   */
  strikethrough: boolean;
}

export type ToolbarStateBlocType =
  | "paragraph"
  | HeadingTagType
  | "quote"
  | "code"
  | "list_unordered"
  | "list_ordered"
  | "list_todo"
  | null;

/**
 * Constant state of the toolbar when nothing is selected.
 */
export const toolbarStateNothing: ToolbarState = {
  blockType: null,
  bold: false,
  inlineCode: false,
  blockCodeLanguage: "",
  italic: false,
  link: false,
  strikethrough: false,
};

/**
 * Subcribes to editor changes (selection and global state)
 * On each change, recompulte the toolbar state and return it.
 */
export function computeToolbarStateSubscription(editor: LexicalEditor) {
  return {
    initialValueFn: () => editor.getEditorState().read($computeToolbarStateFromEditor),
    subscribe: (callback: (value: ToolbarState) => void) =>
      mergeRegister(
        editor.registerUpdateListener(({ editorState }) => {
          callback(editorState.read($computeToolbarStateFromEditor));
        }),
        editor.registerCommand(
          SELECTION_CHANGE_COMMAND,
          () => {
            callback($computeToolbarStateFromEditor());
            return false;
          },
          COMMAND_PRIORITY_LOW,
        ),
      ),
  };
}

/**
 * Must be called in a Lexical context (update or read)
 */
export function $computeToolbarStateFromEditor(): ToolbarState {
  const selection = $getSelection();

  // Nothing selected then return nothing state
  if (!$isRangeSelection(selection)) {
    return toolbarStateNothing;
  }

  return {
    blockType: $findToolbarBlockType(selection),
    bold: selection.hasFormat("bold"),
    inlineCode: selection.hasFormat("code"),
    blockCodeLanguage: $findCodeLanguage(selection),
    italic: selection.hasFormat("italic"),
    link: $isInsideLink(selection),
    strikethrough: selection.hasFormat("strikethrough"),
  };
}

function $findToolbarBlockType(selection: RangeSelection): ToolbarStateBlocType {
  const topLevelElement = $findTopLevelElement(selection.anchor.getNode());
  let block: ToolbarStateBlocType = null;

  if (topLevelElement !== null) {
    if ($isHeadingNode(topLevelElement)) {
      block = topLevelElement.getTag();
    } else if ($isQuoteNode(topLevelElement)) {
      block = "quote";
    } else if ($isCodeNode(topLevelElement)) {
      block = "code";
    } else if ($isListNode(topLevelElement)) {
      const type = topLevelElement.getListType();
      if (type === "number") {
        block = "list_ordered";
      } else if (type === "bullet") {
        block = "list_unordered";
      } else if (type === "check") {
        block = "list_todo";
      }
    } else if (topLevelElement.getType() === "paragraph") {
      block = "paragraph";
    }
  }
  return block;
}
