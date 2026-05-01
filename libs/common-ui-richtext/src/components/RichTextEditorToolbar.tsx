import { tokens, Toolbar, ToolbarButton, ToolbarDivider, ToolbarToggleButton } from "@fluentui/react-components";
import {
  ClipboardTaskListLtrRegular,
  LineHorizontal1Regular,
  LinkRegular,
  TextClearFormattingRegular,
  TextBoldRegular,
  TextBulletListLtrRegular,
  TextHeader2Regular,
  TextIndentDecreaseLtrRegular,
  TextIndentIncreaseLtrRegular,
  TextItalicRegular,
  TextNumberListLtrRegular,
  TextQuoteRegular,
  TextStrikethroughRegular,
  TextTRegular,
} from "@fluentui/react-icons";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, $isQuoteNode } from "@lexical/rich-text";
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import {
  $createParagraphNode,
  $findMatchingParent,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  LexicalNode,
  mergeRegister,
  OUTDENT_CONTENT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  TextFormatType,
} from "lexical";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CLEAR_FORMATTING_COMMAND } from "../extensions/ClearFormattingExtension";

interface ToolbarState {
  block: "paragraph" | "h2" | "quote" | "bullet" | "number" | "check" | null;
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
}

const inactiveToolbarState: ToolbarState = {
  block: null,
  bold: false,
  italic: false,
  strikethrough: false,
};

export function RichTextEditorToolbar({ disabled }: { disabled: boolean }) {
  const [editor] = useLexicalComposerContext();
  const [toolbarState, setToolbarState] = useState<ToolbarState>(inactiveToolbarState);
  const checkedValues = useMemo(
    () => ({
      block: toolbarState.block === null ? [] : [toolbarState.block],
      format: [
        toolbarState.bold ? "bold" : null,
        toolbarState.italic ? "italic" : null,
        toolbarState.strikethrough ? "strikethrough" : null,
      ].filter((value): value is string => value !== null),
    }),
    [toolbarState],
  );

  const updateToolbarState = useCallback(() => {
    const selection = $getSelection();

    if (!$isRangeSelection(selection)) {
      setToolbarState(inactiveToolbarState);
      return;
    }

    const topLevelElement = getTopLevelElement(selection.anchor.getNode());
    let block: ToolbarState["block"] = null;

    if (topLevelElement !== null) {
      if ($isHeadingNode(topLevelElement) && topLevelElement.getTag() === "h2") {
        block = "h2";
      } else if ($isQuoteNode(topLevelElement)) {
        block = "quote";
      } else if ($isListNode(topLevelElement)) {
        block = topLevelElement.getListType();
      } else if (topLevelElement.getType() === "paragraph") {
        block = "paragraph";
      }
    }

    setToolbarState({
      block,
      bold: selection.hasFormat("bold"),
      italic: selection.hasFormat("italic"),
      strikethrough: selection.hasFormat("strikethrough"),
    });
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(updateToolbarState);
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbarState();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, updateToolbarState]);

  const formatText = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const setParagraph = () => {
    editor.update(() => {
      $setBlocksType($getSelection(), () => $createParagraphNode());
    });
  };

  const setHeading = () => {
    editor.update(() => {
      $setBlocksType($getSelection(), () => $createHeadingNode("h2"));
    });
  };

  const setQuote = () => {
    editor.update(() => {
      $setBlocksType($getSelection(), () => $createQuoteNode());
    });
  };

  const setLink = () => {
    const url = window.prompt("URL");
    if (url === null) {
      return;
    }
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, url.trim().length > 0 ? url : null);
  };

  return (
    <Toolbar
      aria-label="Rich text editor toolbar"
      checkedValues={checkedValues}
      size="small"
      style={{ backgroundColor: tokens.colorNeutralBackground3 }}
    >
      <ToolbarToggleButton
        aria-label="Paragraph"
        disabled={disabled}
        icon={<TextTRegular />}
        name="block"
        onClick={setParagraph}
        value="paragraph"
      />
      <ToolbarToggleButton
        aria-label="Heading"
        disabled={disabled}
        icon={<TextHeader2Regular />}
        name="block"
        onClick={setHeading}
        value="h2"
      />
      <ToolbarDivider />
      <ToolbarToggleButton
        aria-label="Bold"
        disabled={disabled}
        icon={<TextBoldRegular />}
        name="format"
        onClick={() => formatText("bold")}
        value="bold"
      />
      <ToolbarToggleButton
        aria-label="Italic"
        disabled={disabled}
        icon={<TextItalicRegular />}
        name="format"
        onClick={() => formatText("italic")}
        value="italic"
      />
      <ToolbarToggleButton
        aria-label="Strikethrough"
        disabled={disabled}
        icon={<TextStrikethroughRegular />}
        name="format"
        onClick={() => formatText("strikethrough")}
        value="strikethrough"
      />
      <ToolbarButton
        aria-label="Clear formatting"
        disabled={disabled}
        icon={<TextClearFormattingRegular />}
        onClick={() => editor.dispatchCommand(CLEAR_FORMATTING_COMMAND, undefined)}
      />
      <ToolbarDivider />
      <ToolbarToggleButton
        aria-label="Quote"
        disabled={disabled}
        icon={<TextQuoteRegular />}
        name="block"
        onClick={setQuote}
        value="quote"
      />
      <ToolbarButton
        aria-label="Horizontal rule"
        disabled={disabled}
        icon={<LineHorizontal1Regular />}
        onClick={() => editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)}
      />
      <ToolbarDivider />
      <ToolbarToggleButton
        aria-label="Bulleted list"
        disabled={disabled}
        icon={<TextBulletListLtrRegular />}
        name="block"
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
        value="bullet"
      />
      <ToolbarToggleButton
        aria-label="Numbered list"
        disabled={disabled}
        icon={<TextNumberListLtrRegular />}
        name="block"
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
        value="number"
      />
      <ToolbarToggleButton
        aria-label="Task list"
        disabled={disabled}
        icon={<ClipboardTaskListLtrRegular />}
        name="block"
        onClick={() => editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)}
        value="check"
      />
      <ToolbarDivider />
      <ToolbarButton
        aria-label="Outdent"
        disabled={disabled}
        icon={<TextIndentDecreaseLtrRegular />}
        onClick={() => editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)}
      />
      <ToolbarButton
        aria-label="Indent"
        disabled={disabled}
        icon={<TextIndentIncreaseLtrRegular />}
        onClick={() => editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)}
      />
      <ToolbarDivider />
      <ToolbarButton aria-label="Link" disabled={disabled} icon={<LinkRegular />} onClick={setLink} />
    </Toolbar>
  );
}

function getTopLevelElement(node: LexicalNode): LexicalNode | null {
  return $findMatchingParent(node, (parentNode) => {
    const parent = parentNode.getParent();
    return parent !== null && $isRootOrShadowRoot(parent);
  });
}
