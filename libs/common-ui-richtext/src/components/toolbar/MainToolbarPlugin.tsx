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
  ArrowClockwiseRegular,
  ArrowCounterclockwiseRegular,
  ClipboardTaskListLtrRegular,
  CodeRegular,
  LineHorizontal1Regular,
  LinkRegular,
  TextBoldRegular,
  TextBulletListLtrRegular,
  TextClearFormattingRegular,
  TextIndentDecreaseLtrRegular,
  TextIndentIncreaseLtrRegular,
  TextItalicRegular,
  TextNumberListLtrRegular,
  TextQuoteRegular,
  TextStrikethroughRegular,
} from "@fluentui/react-icons";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/extension";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, $createQuoteNode, type HeadingTagType } from "@lexical/rich-text";
import { INSERT_CHECK_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list";
import { $createCodeNode } from "@lexical/code-core";
import {
  $createParagraphNode,
  $getSelection,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { useMemo } from "react";
import { CLEAR_FORMATTING_COMMAND } from "../../extensions/ClearFormattingExtension";
import { computeToolbarStateSubscription, ToolbarState } from "./toolbar-state";
import { useLexicalSubscription } from "@lexical/react/useLexicalSubscription";

type BlockStyleDropdownType = "paragraph" | "code" | HeadingTagType;

const blockStyleDropdownValues: Array<{ label: string; value: BlockStyleDropdownType }> = [
  { label: "Normal text", value: "paragraph" },
  { label: "Heading 1", value: "h1" },
  { label: "Heading 2", value: "h2" },
  { label: "Heading 3", value: "h3" },
  { label: "Heading 4", value: "h4" },
  { label: "Heading 5", value: "h5" },
  { label: "Heading 6", value: "h6" },
  { label: "Code block", value: "code" },
];

export interface MainToolbarProps {
  /** if true toolbar shall be disabled */
  disabled: boolean;
}

export function MainToolbarPlugin({ disabled }: MainToolbarProps) {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();
  const toolbarState = useLexicalSubscription(computeToolbarStateSubscription);
  const toolbarDisabled = disabled || !isEditable;

  const fluentToolbarCheckedValues = useMemo(() => toFluentUiToolbarCheckedValues(toolbarState), [toolbarState]);
  const selectedBlockStyleDropdownType = getTextStyleValue(toolbarState.block);

  const selectedBlockStyleDropdownLabel =
    blockStyleDropdownValues.find((textStyle) => textStyle.value === selectedBlockStyleDropdownType)?.label ??
    "Normal text";

  const handleChangeBlockStyleDropdown = (style: BlockStyleDropdownType) => {
    editor.update(() => {
      $setBlocksType($getSelection(), () => {
        if (style === "paragraph") return $createParagraphNode();
        if (style === "code") return $createCodeNode();
        return $createHeadingNode(style);
      });
    });
  };
  const handleClickBold = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  const handleClickItalic = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  const handleClickCode = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
  const handleClickStrikethrough = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
  const handleClickClearFormatting = () => editor.dispatchCommand(CLEAR_FORMATTING_COMMAND, undefined);
  const handleClickHorizontalRule = () => editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
  const handleClickUnorderedList = () => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  const handleClickNumberedList = () => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  const handleClickTaskList = () => editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
  const handleClickIndentDecrease = () => editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
  const handleClickIndentIncrease = () => editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
  const handleClickUndo = () => editor.dispatchCommand(UNDO_COMMAND, undefined);
  const handleClickRedo = () => editor.dispatchCommand(REDO_COMMAND, undefined);
  const handleClickLink = () => {
    // When the link button is clicked, we must either remove the underlying link if we are on a link
    // of create a new node with a link, even if empty (just with https://).
    // This is important to do it here, because unless the link is written in the editor,
    // the link dialog cannot show up if the cursor or selection is not already on a link.
    if (toolbarState.link) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    }
  };
  const handleClickQuote = () => {
    editor.update(() => {
      $setBlocksType($getSelection(), () => $createQuoteNode());
    });
  };

  return (
    <Toolbar
      aria-label="Rich text editor toolbar"
      checkedValues={fluentToolbarCheckedValues}
      size="medium"
      style={{
        borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
        borderLeft: `1px solid ${tokens.colorNeutralStroke2}`,
        borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
        borderTopLeftRadius: tokens.borderRadiusLarge,
        borderTopRightRadius: tokens.borderRadiusLarge,
      }}
    >
      <Menu checkedValues={{ textStyle: [selectedBlockStyleDropdownType] }}>
        <MenuTrigger disableButtonEnhancement>
          <MenuButton
            aria-label="Text style"
            disabled={toolbarDisabled}
            size="small"
            appearance={"transparent"}
            style={{ width: "9em", justifyContent: "space-between" }}
          >
            {selectedBlockStyleDropdownLabel}
          </MenuButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            {blockStyleDropdownValues.map((textStyle) => (
              <MenuItemRadio
                key={textStyle.value}
                name="textStyle"
                onClick={() => handleChangeBlockStyleDropdown(textStyle.value)}
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
        disabled={toolbarDisabled}
        icon={<TextBoldRegular />}
        name="format"
        onClick={handleClickBold}
        value="bold"
      />
      <ToolbarToggleButton
        aria-label="Italic"
        disabled={toolbarDisabled}
        icon={<TextItalicRegular />}
        name="format"
        onClick={handleClickItalic}
        value="italic"
      />
      <ToolbarToggleButton
        aria-label="Code"
        disabled={toolbarDisabled}
        icon={<CodeRegular />}
        name="format"
        onClick={handleClickCode}
        value="code"
      />
      <ToolbarToggleButton
        aria-label="Strikethrough"
        disabled={toolbarDisabled}
        icon={<TextStrikethroughRegular />}
        name="format"
        onClick={handleClickStrikethrough}
        value="strikethrough"
      />
      <ToolbarButton
        aria-label="Clear formatting"
        disabled={toolbarDisabled}
        icon={<TextClearFormattingRegular />}
        onClick={handleClickClearFormatting}
      />
      <ToolbarDivider />
      <ToolbarToggleButton
        aria-label="Quote"
        disabled={toolbarDisabled}
        icon={<TextQuoteRegular />}
        name="block"
        onClick={handleClickQuote}
        value="quote"
      />
      <ToolbarButton
        aria-label="Horizontal rule"
        disabled={toolbarDisabled}
        icon={<LineHorizontal1Regular />}
        onClick={handleClickHorizontalRule}
      />
      <ToolbarDivider />
      <ToolbarToggleButton
        aria-label="Unordered list"
        disabled={toolbarDisabled}
        icon={<TextBulletListLtrRegular />}
        name="block"
        onClick={handleClickUnorderedList}
        value="list_unordered"
      />
      <ToolbarToggleButton
        aria-label="Ordered list"
        disabled={toolbarDisabled}
        icon={<TextNumberListLtrRegular />}
        name="block"
        onClick={handleClickNumberedList}
        value="list_ordered"
      />
      <ToolbarToggleButton
        aria-label="Task list"
        disabled={toolbarDisabled}
        icon={<ClipboardTaskListLtrRegular />}
        name="block"
        onClick={handleClickTaskList}
        value="list_todo"
      />
      <ToolbarDivider />
      <ToolbarButton
        aria-label="Outdent"
        disabled={toolbarDisabled}
        icon={<TextIndentDecreaseLtrRegular />}
        onClick={handleClickIndentDecrease}
      />
      <ToolbarButton
        aria-label="Indent"
        disabled={toolbarDisabled}
        icon={<TextIndentIncreaseLtrRegular />}
        onClick={handleClickIndentIncrease}
      />
      <ToolbarDivider />
      <ToolbarToggleButton
        aria-label="Link"
        disabled={toolbarDisabled}
        icon={<LinkRegular />}
        name="format"
        onClick={handleClickLink}
        value="link"
      />
      <ToolbarButton
        aria-label="Undo"
        disabled={toolbarDisabled}
        icon={<ArrowCounterclockwiseRegular />}
        onClick={handleClickUndo}
      />
      <ToolbarButton
        aria-label="Redo"
        disabled={toolbarDisabled}
        icon={<ArrowClockwiseRegular />}
        onClick={handleClickRedo}
      />
    </Toolbar>
  );
}

/**
 * Converts the toolbarState computed from Lexical current state
 * into a set of checkedValues as expected by FluentUI Toolbar
 *
 * ```
 * checkedValues = {
 *   block: ["quote"], // or ["bullet"], ["number"], ["check"], etc.
 *   format: ["bold", "italic", "link"]
 * }
 * ```
 */
function toFluentUiToolbarCheckedValues(toolbarState: ToolbarState): {
  block: string[];
  format: string[];
} {
  return {
    block: toolbarState.block === null ? [] : [toolbarState.block],
    format: [
      toolbarState.bold ? "bold" : null,
      toolbarState.code ? "code" : null,
      toolbarState.italic ? "italic" : null,
      toolbarState.link ? "link" : null,
      toolbarState.strikethrough ? "strikethrough" : null,
    ].filter((value): value is string => value !== null),
  };
}

/**
 * Converts a block from the toolbar state into a block style for the dropdown
 * if block style selection. We need this because the toolbar state has more
 * kinds of blocks that the dropdown (for example, "quote" or "lists" are not in the
 * dropdown).
 * @param block
 */
function getTextStyleValue(block: ToolbarState["block"]): BlockStyleDropdownType {
  if (block === "code") {
    return block;
  }

  if (block === "h1" || block === "h2" || block === "h3" || block === "h4" || block === "h5" || block === "h6") {
    return block;
  }

  return "paragraph";
}
