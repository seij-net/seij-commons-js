import {
  Menu,
  MenuButton,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuTrigger,
  tokens,
  Tooltip,
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
import { $createCodeNode, $isCodeNode } from "@lexical/code-core";
import { getCodeLanguageOptions, normalizeCodeLanguage } from "@lexical/code-shiki";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
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
import { $findTopLevelElement } from "../../utils/lexical-utils";
import { useRichTextI18n } from "../../utils/useRichTextI18n";

type BlockStyleDropdownType = "paragraph" | "code" | HeadingTagType;

const codeLanguageDropdownValues = getCodeLanguageOptions().filter(([value]) =>
  [
    "c",
    "cpp",
    "csharp",
    "dax",
    "fsharp",
    "go",
    "java",
    "javascript",
    "julia",
    "kotlin",
    "m",
    "matlab",
    "php",
    "python",
    "r",
    "ruby",
    "rust",
    "sas",
    "scala",
    "sql",
    "swift",
    "typescript",
    "vb",
  ].includes(value),
);

export interface MainToolbarProps {
  /** if true toolbar shall be disabled */
  disabled: boolean;
}

export function MainToolbarPlugin({ disabled }: MainToolbarProps) {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();
  const toolbarState = useLexicalSubscription(computeToolbarStateSubscription);
  const toolbarDisabled = disabled || !isEditable;
  const { t } = useRichTextI18n();

  const blockStyleDropdownValues: Array<{ label: string; value: BlockStyleDropdownType }> = [
    { label: t("toolbarNormalText"), value: "paragraph" },
    { label: t("toolbarHeading1"), value: "h1" },
    { label: t("toolbarHeading2"), value: "h2" },
    { label: t("toolbarHeading3"), value: "h3" },
    { label: t("toolbarHeading4"), value: "h4" },
    { label: t("toolbarHeading5"), value: "h5" },
    { label: t("toolbarHeading6"), value: "h6" },
    { label: t("toolbarCodeBlock"), value: "code" },
  ];

  const fluentToolbarCheckedValues = useMemo(() => toFluentUiToolbarCheckedValues(toolbarState), [toolbarState]);
  const selectedBlockStyleDropdownType = getTextStyleValue(toolbarState.blockType);

  const selectedBlockStyleDropdownLabel =
    blockStyleDropdownValues.find((textStyle) => textStyle.value === selectedBlockStyleDropdownType)?.label ??
    t("toolbarNormalText");
  const isCodeBlock = toolbarState.blockType === "code";
  const selectedCodeLanguage = normalizeCodeLanguage(toolbarState.blockCodeLanguage || "javascript");
  const selectedCodeLanguageLabel =
    codeLanguageDropdownValues.find(([value]) => value === selectedCodeLanguage)?.[1] ?? selectedCodeLanguage;

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
  const handleChangeCodeLanguage = (language: string) => {
    editor.update(() => {
      const selection = $getSelection();

      if (!$isRangeSelection(selection)) return;

      const topLevelElement = $findTopLevelElement(selection.anchor.getNode());
      if ($isCodeNode(topLevelElement)) {
        topLevelElement.setLanguage(language);
      }
    });
  };
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
      aria-label={t("toolbarRichTextEditor")}
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
            aria-label={t("toolbarTextStyleMenu")}
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

      {isCodeBlock && (
        <Menu checkedValues={{ codeLanguage: [selectedCodeLanguage] }}>
          <MenuTrigger disableButtonEnhancement>
            <MenuButton
              aria-label={t("toolbarCodeLanguageMenu")}
              disabled={toolbarDisabled}
              size="small"
              appearance={"transparent"}
              style={{ width: "9em", justifyContent: "space-between" }}
            >
              {selectedCodeLanguageLabel}
            </MenuButton>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              {codeLanguageDropdownValues.map(([value, label]) => (
                <MenuItemRadio
                  key={value}
                  name="codeLanguage"
                  onClick={() => handleChangeCodeLanguage(value)}
                  value={value}
                >
                  {label}
                </MenuItemRadio>
              ))}
            </MenuList>
          </MenuPopover>
        </Menu>
      )}

      {!isCodeBlock && (
        <>
          <Tooltip content={t("toolbarBoldButton")} relationship={"description"} withArrow>
            <ToolbarToggleButton
              aria-label={t("toolbarBoldButton")}
              disabled={toolbarDisabled}
              icon={<TextBoldRegular />}
              name="format"
              onClick={handleClickBold}
              value="bold"
            />
          </Tooltip>
          <Tooltip content={t("toolbarItalicButton")} relationship={"description"} withArrow>
            <ToolbarToggleButton
              aria-label={t("toolbarItalicButton")}
              disabled={toolbarDisabled}
              icon={<TextItalicRegular />}
              name="format"
              onClick={handleClickItalic}
              value="italic"
            />
          </Tooltip>
          <Tooltip content={t("toolbarInlineCodeButton")} relationship={"description"} withArrow>
            <ToolbarToggleButton
              aria-label={t("toolbarInlineCodeButton")}
              disabled={toolbarDisabled}
              icon={<CodeRegular />}
              name="format"
              onClick={handleClickCode}
              value="code"
            />
          </Tooltip>
          <Tooltip content={t("toolbarStrikethroughButton")} relationship={"description"} withArrow>
            <ToolbarToggleButton
              aria-label={t("toolbarStrikethroughButton")}
              disabled={toolbarDisabled}
              icon={<TextStrikethroughRegular />}
              name="format"
              onClick={handleClickStrikethrough}
              value="strikethrough"
            />
          </Tooltip>
          <Tooltip content={t("toolbarClearFormattingButton")} relationship={"description"} withArrow>
            <ToolbarButton
              aria-label={t("toolbarClearFormattingButton")}
              disabled={toolbarDisabled}
              icon={<TextClearFormattingRegular />}
              onClick={handleClickClearFormatting}
            />
          </Tooltip>
          <ToolbarDivider />
        </>
      )}
      <Tooltip content={t("toolbarQuoteButton")} relationship={"description"} withArrow>
        <ToolbarToggleButton
          aria-label={t("toolbarQuoteButton")}
          disabled={toolbarDisabled}
          icon={<TextQuoteRegular />}
          name="block"
          onClick={handleClickQuote}
          value="quote"
        />
      </Tooltip>
      <Tooltip content={t("toolbarHorizontalRuleButton")} relationship={"description"} withArrow>
        <ToolbarButton
          aria-label={t("toolbarHorizontalRuleButton")}
          disabled={toolbarDisabled}
          icon={<LineHorizontal1Regular />}
          onClick={handleClickHorizontalRule}
        />
      </Tooltip>
      <ToolbarDivider />
      <Tooltip content={t("toolbarUnorderedListButton")} relationship={"description"} withArrow>
        <ToolbarToggleButton
          aria-label={t("toolbarUnorderedListButton")}
          disabled={toolbarDisabled}
          icon={<TextBulletListLtrRegular />}
          name="block"
          onClick={handleClickUnorderedList}
          value="list_unordered"
        />
      </Tooltip>
      <Tooltip content={t("toolbarOrderedListButton")} relationship={"description"} withArrow>
        <ToolbarToggleButton
          aria-label={t("toolbarOrderedListButton")}
          disabled={toolbarDisabled}
          icon={<TextNumberListLtrRegular />}
          name="block"
          onClick={handleClickNumberedList}
          value="list_ordered"
        />
      </Tooltip>
      <Tooltip content={t("toolbarTaskListButton")} relationship={"description"} withArrow>
        <ToolbarToggleButton
          aria-label={t("toolbarTaskListButton")}
          disabled={toolbarDisabled}
          icon={<ClipboardTaskListLtrRegular />}
          name="block"
          onClick={handleClickTaskList}
          value="list_todo"
        />
      </Tooltip>
      <ToolbarDivider />
      <Tooltip content={t("toolbarOutdentButton")} relationship={"description"} withArrow>
        <ToolbarButton
          aria-label={t("toolbarOutdentButton")}
          disabled={toolbarDisabled}
          icon={<TextIndentDecreaseLtrRegular />}
          onClick={handleClickIndentDecrease}
        />
      </Tooltip>
      <Tooltip content={t("toolbarIndentButton")} relationship={"description"} withArrow>
        <ToolbarButton
          aria-label={t("toolbarIndentButton")}
          disabled={toolbarDisabled}
          icon={<TextIndentIncreaseLtrRegular />}
          onClick={handleClickIndentIncrease}
        />
      </Tooltip>
      <ToolbarDivider />
      {!isCodeBlock && (
        <Tooltip content={t("toolbarLinkButton")} relationship={"description"} withArrow>
          <ToolbarToggleButton
            aria-label={t("toolbarLinkButton")}
            disabled={toolbarDisabled}
            icon={<LinkRegular />}
            name="format"
            onClick={handleClickLink}
            value="link"
          />
        </Tooltip>
      )}
      <Tooltip content={t("toolbarUndoButton")} relationship={"description"} withArrow>
        <ToolbarButton
          aria-label={t("toolbarUndoButton")}
          disabled={toolbarDisabled}
          icon={<ArrowCounterclockwiseRegular />}
          onClick={handleClickUndo}
        />
      </Tooltip>
      <Tooltip content={t("toolbarRedoButton")} relationship={"description"} withArrow>
        <ToolbarButton
          aria-label={t("toolbarRedoButton")}
          disabled={toolbarDisabled}
          icon={<ArrowClockwiseRegular />}
          onClick={handleClickRedo}
        />
      </Tooltip>
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
    block: toolbarState.blockType === null ? [] : [toolbarState.blockType],
    format: [
      toolbarState.bold ? "bold" : null,
      toolbarState.inlineCode ? "code" : null,
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
function getTextStyleValue(block: ToolbarState["blockType"]): BlockStyleDropdownType {
  if (block === "code") {
    return block;
  }

  if (block === "h1" || block === "h2" || block === "h3" || block === "h4" || block === "h5" || block === "h6") {
    return block;
  }

  return "paragraph";
}
