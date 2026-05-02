import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRef, useState } from "react";
import { describe, expect, it } from "vitest";
import { RichTextEditorMarkdown } from "./RichTextEditorMarkdown";
import { $createParagraphNode, $createTextNode, $getRoot } from "lexical";
import { type RichTextEditorRef } from "./extensions/EditorRefExtension";

const INITIAL_MARKDOWN = "Initial markdown text";
const EXTERNAL_MARKDOWN = "External markdown text";
const USER_MARKDOWN = "User markdown text";

function ControlledMarkdownEditor() {
  const [value, setValue] = useState(INITIAL_MARKDOWN);

  return (
    <>
      <button type="button" data-testid="load-external-markdown" onClick={() => setValue(EXTERNAL_MARKDOWN)}>
        Load external value
      </button>
      <RichTextEditorMarkdown value={value} disabled={false} onChange={setValue} />
    </>
  );
}

function ControlledMarkdownEditorWithSiblingField() {
  const editorRef = useRef<RichTextEditorRef>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: INITIAL_MARKDOWN,
  });

  const editMarkdown = () => {
    editorRef.current?.getEditor()?.update(() => {
      const root = $getRoot();
      root.clear();
      root.append($createParagraphNode().append($createTextNode(USER_MARKDOWN)));
    });
  };

  return (
    <>
      <input
        aria-label="Title"
        value={formData.title}
        onChange={(event) =>
          setFormData({
            ...formData,
            title: event.target.value,
          })
        }
      />
      <button type="button" data-testid="edit-markdown" onClick={editMarkdown}>
        Edit markdown
      </button>
      <RichTextEditorMarkdown
        ref={editorRef}
        value={formData.description}
        disabled={false}
        onChange={(description) =>
          setFormData({
            ...formData,
            description,
          })
        }
      />
      <output aria-label="Form data">{JSON.stringify(formData)}</output>
    </>
  );
}

describe("RichTextEditorMarkdown", () => {
  it("renders the initial markdown value", async () => {
    render(<ControlledMarkdownEditor />);

    expect(await screen.findByText(INITIAL_MARKDOWN)).toBeTruthy();
  });

  it("applies a markdown value coming from props", async () => {
    render(<ControlledMarkdownEditor />);

    fireEvent.click(screen.getByTestId("load-external-markdown"));

    expect(await screen.findByText(EXTERNAL_MARKDOWN)).toBeTruthy();
  });

  /**
   * Test pour le bug qui a fait perdre des champs du formulaire.
   *
   * Cas qui a casse:
   * - Le formulaire contient un titre et une description markdown.
   * - On met `title = "A"`.
   * - React redessine le formulaire.
   * - Ensuite on change la description markdown.
   * - Le markdown ne doit pas appeler l'ancienne fonction `onChange`.
   * - Sinon cette ancienne fonction repart avec l'ancien formulaire vide.
   * - Resultat du bug: `description` est changee, mais `title` disparait.
   *
   * Ce test controle que, apres le changement markdown, on garde bien:
   * - le titre saisi avant;
   * - la nouvelle description markdown.
   */
  it("uses the latest onChange callback after a parent rerender", async () => {
    render(<ControlledMarkdownEditorWithSiblingField />);

    expect(await screen.findByText(INITIAL_MARKDOWN)).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "A" },
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("edit-markdown"));
    });

    await waitFor(() => {
      expect(screen.getByLabelText("Form data").textContent).toBe(
        JSON.stringify({
          title: "A",
          description: USER_MARKDOWN,
        }),
      );
    });
  });
});
