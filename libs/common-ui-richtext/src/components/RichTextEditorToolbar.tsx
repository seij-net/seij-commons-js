import {
  Menu,
  MenuButton,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuTrigger,
  tokens,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  ToolbarToggleButton,
} from "@fluentui/react-components";
import {
  ClipboardTaskListLtrRegular,
  LineHorizontal1Regular,
  LinkRegular,
  TextClearFormattingRegular,
  TextBoldRegular,
  TextBulletListLtrRegular,
  TextIndentDecreaseLtrRegular,
  TextIndentIncreaseLtrRegular,
  TextItalicRegular,
  TextNumberListLtrRegular,
  TextQuoteRegular,
  TextStrikethroughRegular,
} from "@fluentui/react-icons";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { $setBlocksType } from "@lexical/selection";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
  type HeadingTagType,
} from "@lexical/rich-text";
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
  block: "paragraph" | HeadingTagType | "quote" | "bullet" | "number" | "check" | null;
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
}

type TextStyleValue = "paragraph" | HeadingTagType;

const textStyles: Array<{ label: string; value: TextStyleValue }> = [
  { label: "Normal text", value: "paragraph" },
  { label: "Heading 1", value: "h1" },
  { label: "Heading 2", value: "h2" },
  { label: "Heading 3", value: "h3" },
  { label: "Heading 4", value: "h4" },
  { label: "Heading 5", value: "h5" },
  { label: "Heading 6", value: "h6" },
];

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
  const selectedTextStyle = getTextStyleValue(toolbarState.block);
  const selectedTextStyleLabel =
    textStyles.find((textStyle) => textStyle.value === selectedTextStyle)?.label ?? "Normal text";

  const updateToolbarState = useCallback(() => {
    const selection = $getSelection();

    if (!$isRangeSelection(selection)) {
      setToolbarState(inactiveToolbarState);
      return;
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

  const setTextStyle = (style: TextStyleValue) => {
    editor.update(() => {
      $setBlocksType($getSelection(), () => (style === "paragraph" ? $createParagraphNode() : $createHeadingNode(style)));
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
      style={{
        borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
        borderLeft: `1px solid ${tokens.colorNeutralStroke2}`,
        borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
        borderTopLeftRadius: tokens.borderRadiusLarge,
        borderTopRightRadius: tokens.borderRadiusLarge,
      }}
    >
      <Menu checkedValues={{ textStyle: [selectedTextStyle] }}>
        <MenuTrigger disableButtonEnhancement>
          <MenuButton aria-label="Text style" disabled={disabled} size="small" appearance={"transparent"} style={{width:"9em", justifyContent: "space-between"}}>
            {selectedTextStyleLabel}
          </MenuButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            {textStyles.map((textStyle) => (
              <MenuItemRadio
                key={textStyle.value}
                name="textStyle"
                onClick={() => setTextStyle(textStyle.value)}
                value={textStyle.value}
              >
                {textStyle.label}
              </MenuItemRadio>
            ))}
          </MenuList>
        </MenuPopover>
      </Menu>

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

function getTextStyleValue(block: ToolbarState["block"]): TextStyleValue {
  if (block === "h1" || block === "h2" || block === "h3" || block === "h4" || block === "h5" || block === "h6") {
    return block;
  }

  return "paragraph";
}
