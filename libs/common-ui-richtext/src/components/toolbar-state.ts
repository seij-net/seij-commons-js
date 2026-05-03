import { $isHeadingNode, $isQuoteNode, HeadingTagType } from "@lexical/rich-text";
import { $findMatchingParent, $getSelection, $isRangeSelection, $isRootOrShadowRoot, LexicalNode } from "lexical";
import { $isListNode } from "@lexical/list";
import { $isLinkNode } from "@lexical/link";

export const inactiveToolbarState: ToolbarState = {
  block: null,
  bold: false,
  code: false,
  italic: false,
  link: false,
  strikethrough: false,
};

export interface ToolbarState {
  block: "paragraph" | HeadingTagType | "quote" | "bullet" | "number" | "check" | null;
  bold: boolean;
  code: boolean;
  italic: boolean;
  link: boolean;
  strikethrough: boolean;
}

export function computeToolbarStateFromEditor(): ToolbarState {
  const selection = $getSelection();

  if (!$isRangeSelection(selection)) {
    return inactiveToolbarState;
  }

  const topLevelElement = getTopLevelElement(selection.anchor.getNode());
  let block: ToolbarState["block"] = null;

  if (topLevelElement !== null) {
    if ($isHeadingNode(topLevelElement)) {
      block = topLevelElement.getTag();
    } else if ($isQuoteNode(topLevelElement)) {
      block = "quote";
    } else if ($isListNode(topLevelElement)) {
      block = topLevelElement.getListType();
    } else if (topLevelElement.getType() === "paragraph") {
      block = "paragraph";
    }
  }

  return {
    block,
    bold: selection.hasFormat("bold"),
    code: selection.hasFormat("code"),
    italic: selection.hasFormat("italic"),
    link: isSelectionInLink(),
    strikethrough: selection.hasFormat("strikethrough"),
  };
}

function isSelectionInLink() {
  const selection = $getSelection();

  if (!$isRangeSelection(selection)) {
    return false;
  }

  const node = selection.anchor.getNode();
  return $isLinkNode(node) || $findMatchingParent(node, $isLinkNode) !== null;
}

function getTopLevelElement(node: LexicalNode): LexicalNode | null {
  return $findMatchingParent(node, (parentNode) => {
    const parent = parentNode.getParent();
    return parent !== null && $isRootOrShadowRoot(parent);
  });
}
