import { Popover, PopoverSurface } from "@fluentui/react-components";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalSubscription } from "@lexical/react/useLexicalSubscription";
import {
  $findMatchingParent,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  type LexicalEditor,
  mergeRegister,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { type MouseEvent } from "react";
import { LinkEditorForm } from "./LinkEditorForm";

interface LinkSelection {
  linkHTMLElement: HTMLElement;
  url: string;
}

export function LinkEditorPlugin({ disabled }: { disabled: boolean }) {
  const [editor] = useLexicalComposerContext();
  const linkSelection = useLexicalSubscription(computeLinkSelectionSubscription);
  const rootElement = editor.getRootElement();

  if (disabled || linkSelection === null) {
    return null;
  }

  const handleSubmit = (url: string) => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, url.length > 0 ? url : null);
  };

  const handleCancel = () => {
    if (linkSelection.url === "https://") {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  };

  const handleRemove = () => {
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
      mountNode={rootElement}
      open
      positioning={{
        align: "start",
        flipBoundary: rootElement,
        offset: 8,
        overflowBoundary: rootElement,
        position: "below",
        target: linkSelection.linkHTMLElement,
      }}
    >
      <PopoverSurface onMouseDown={preventSelectionLoss}>
        <LinkEditorForm
          disabled={disabled}
          onCancel={handleCancel}
          onRemove={handleRemove}
          onSubmit={handleSubmit}
          url={linkSelection.url}
        />
      </PopoverSurface>
    </Popover>
  );
}

function computeLinkSelectionSubscription(editor: LexicalEditor) {
  return {
    initialValueFn: () => editor.getEditorState().read(() => $computeLinkSelection(editor)),
    subscribe: (callback: (value: LinkSelection | null) => void) =>
      mergeRegister(
        editor.registerUpdateListener(({ editorState }) => {
          callback(editorState.read(() => $computeLinkSelection(editor)));
        }),
        editor.registerCommand(
          SELECTION_CHANGE_COMMAND,
          () => {
            callback($computeLinkSelection(editor));
            return false;
          },
          COMMAND_PRIORITY_LOW,
        ),
      ),
  };
}

function $computeLinkSelection(editor: LexicalEditor): LinkSelection | null {
  const selection = $getSelection();

  if (!$isRangeSelection(selection)) {
    return null;
  }

  const selectedNode = selection.anchor.getNode();
  const linkNode = $isLinkNode(selectedNode) ? selectedNode : $findMatchingParent(selectedNode, $isLinkNode);

  const linkElement = linkNode === null ? null : editor.getElementByKey(linkNode.getKey());

  if (linkNode === null || linkElement === null) {
    return null;
  }

  return {
    linkHTMLElement: linkElement,
    url: linkNode.getURL(),
  };
}
