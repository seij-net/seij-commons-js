import { $isHeadingNode, $isQuoteNode, HeadingTagType } from "@lexical/rich-text";
import {
  $findMatchingParent,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_LOW,
  type LexicalEditor,
  LexicalNode,
  mergeRegister,
  RangeSelection,
  SELECTION_CHANGE_COMMAND
} from "lexical";
import { $isListNode } from "@lexical/list";
import { $isLinkNode } from "@lexical/link";

/**
 * State that indicates
 *
 * - which kind of block where the current cursor is (title, h1, paragraph, link ...).
 *   There can be only one at the same time
 * - the text modifiers currently active (bold, italic, etc.)
 *   There can be multiple at the same time
 */
export interface ToolbarState {
  block: ToolbarStateBlocType;
  bold: boolean;
  code: boolean;
  italic: boolean;
  link: boolean;
  strikethrough: boolean;
}

export type ToolbarStateBlocType =
  | "paragraph"
  | HeadingTagType
  | "quote"
  | "list_unordered"
  | "list_ordered"
  | "list_todo"
  | null;

/**
 * Constant state of the toolbar when nothing is selected.
 */
export const toolbarStateNothing: ToolbarState = {
  block: null,
  bold: false,
  code: false,
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
    block: $findToolbarBlockType(selection),
    bold: selection.hasFormat("bold"),
    code: selection.hasFormat("code"),
    italic: selection.hasFormat("italic"),
    link: $isInsideLink(selection),
    strikethrough: selection.hasFormat("strikethrough"),
  };
}

function $findToolbarBlockType(selection: RangeSelection) {
  const topLevelElement = $findTopLevelElement(selection.anchor.getNode());
  let block: ToolbarStateBlocType = null;

  if (topLevelElement !== null) {
    if ($isHeadingNode(topLevelElement)) {
      block = topLevelElement.getTag();
    } else if ($isQuoteNode(topLevelElement)) {
      block = "quote";
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

function $isInsideLink(selection: RangeSelection) {
  const node = selection.anchor.getNode();
  return $isLinkNode(node) || $findMatchingParent(node, $isLinkNode) !== null;
}

function $findTopLevelElement(node: LexicalNode): LexicalNode | null {
  return $findMatchingParent(node, (parentNode) => {
    const parent = parentNode.getParent();
    return parent !== null && $isRootOrShadowRoot(parent);
  });
}
