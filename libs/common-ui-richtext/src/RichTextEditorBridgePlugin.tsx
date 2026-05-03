import {
  BOLD_STAR,
  BOLD_UNDERSCORE,
  CHECK_LIST,
  HEADING,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  LINK,
  ORDERED_LIST,
  QUOTE,
  STRIKETHROUGH,
  type Transformer,
  UNORDERED_LIST,
} from "@lexical/markdown";
import {
  $createHorizontalRuleNode,
  $isHorizontalRuleNode,
  HorizontalRuleNode,
} from "@lexical/react/LexicalHorizontalRuleNode";

const HORIZONTAL_RULE: Transformer = {
  dependencies: [HorizontalRuleNode],
  export: (node) => ($isHorizontalRuleNode(node) ? "---" : null),
  regExp: /^(---|\*\*\*|___)\s?$/,
  replace: (parentNode) => {
    parentNode.replace($createHorizontalRuleNode());
  },
  type: "element",
};

export const MARKDOWN_TRANSFORMERS: Transformer[] = [
  HORIZONTAL_RULE,
  HEADING,
  QUOTE,
  UNORDERED_LIST,
  ORDERED_LIST,
  CHECK_LIST,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  STRIKETHROUGH,
  LINK,
];
