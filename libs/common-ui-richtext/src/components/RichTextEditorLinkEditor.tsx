import { Popover, PopoverSurface } from "@fluentui/react-components";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  type LexicalEditor,
  mergeRegister,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { type MouseEvent, useCallback, useEffect, useState } from "react";
import { LinkEditorForm } from "./LinkEditorForm";

interface LinkSelection {
  rootElement: HTMLElement;
  target: HTMLElement;
  url: string;
}

export function RichTextEditorLinkEditor({ disabled }: { disabled: boolean }) {
  const [editor] = useLexicalComposerContext();
  const [linkSelection, setLinkSelection] = useState<LinkSelection | null>(null);

  const readSelection = useCallback(() => {
    const selection = $getSelection();
    const rootElement = editor.getRootElement();

    if (!$isRangeSelection(selection) || rootElement === null || disabled) {
      setLinkSelection(null);
      return;
    }

    const selectedNode = selection.anchor.getNode();
    let linkNode = $isLinkNode(selectedNode) ? selectedNode : null;
    let parent = selectedNode.getParent();

    while (linkNode === null && parent !== null) {
      if ($isLinkNode(parent)) {
        linkNode = parent;
      }
      parent = parent.getParent();
    }

    const linkElement = linkNode === null ? null : editor.getElementByKey(linkNode.getKey());

    if (linkNode === null || linkElement === null) {
      setLinkSelection(null);
      return;
    }

    setLinkSelection({
      rootElement,
      target: linkElement,
      url: linkNode.getURL(),
    });
  }, [disabled, editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(readSelection);
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          readSelection();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, readSelection]);

  if (linkSelection === null) {
    return null;
  }

  return <LinkEditorPopover disabled={disabled} editor={editor} linkSelection={linkSelection} />;
}

function LinkEditorPopover({
  disabled,
  editor,
  linkSelection,
}: {
  disabled: boolean;
  editor: LexicalEditor;
  linkSelection: LinkSelection;
}) {
  const submitLink = (url: string) => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, url.length > 0 ? url : null);
  };

  const cancelEdit = () => {
    if (linkSelection.url === "https://") {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  };

  const removeLink = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
  };

  const preventSelectionLoss = (event: MouseEvent<HTMLElement>) => {
    // Pressing a popup button makes the browser move the cursor out of the editor
    // before the button action runs. If that happens, Lexical can forget which text was selected.
    // We stop that initial mousedown for buttons, so the link command still applies to the
    // selected editor text. The URL field is allowed through because the user must type in it.
    if (event.target instanceof HTMLInputElement) {
      return;
    }

    event.preventDefault();
  };

  return (
    <Popover
      inline
      mountNode={linkSelection.rootElement}
      open
      positioning={{
        align: "start",
        flipBoundary: linkSelection.rootElement,
        offset: 8,
        overflowBoundary: linkSelection.rootElement,
        position: "below",
        target: linkSelection.target,
      }}
    >
      <PopoverSurface onMouseDown={preventSelectionLoss}>
        <LinkEditorForm
          disabled={disabled}
          onCancel={cancelEdit}
          onRemove={removeLink}
          onSubmit={submitLink}
          url={linkSelection.url}
        />
      </PopoverSurface>
    </Popover>
  );
}
