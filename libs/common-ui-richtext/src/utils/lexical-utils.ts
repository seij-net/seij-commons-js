import { $isCodeNode } from "@lexical/code-core";
import { $isLinkNode } from "@lexical/link";
import { $findMatchingParent, $isRootOrShadowRoot, type LexicalNode, type RangeSelection } from "lexical";

/**
 * Returns the direct child of the editor root that contains the given node.
 */
export function $findTopLevelElement(node: LexicalNode): LexicalNode | null {
  return $findMatchingParent(node, (parentNode) => {
    const parent = parentNode.getParent();
    return parent !== null && $isRootOrShadowRoot(parent);
  });
}

/**
 * Returns the language configured on the selected code block, or an empty
 * string when the selection is not inside a code block.
 */
export function $findCodeLanguage(selection: RangeSelection): string {
  const topLevelElement = $findTopLevelElement(selection.anchor.getNode());

  if ($isCodeNode(topLevelElement)) {
    return topLevelElement.getLanguage() ?? "";
  }

  return "";
}

/**
 * Returns true when the selection anchor is inside a link node.
 */
export function $isInsideLink(selection: RangeSelection): boolean {
  const node = selection.anchor.getNode();
  return $isLinkNode(node) || $findMatchingParent(node, $isLinkNode) !== null;
}
