import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { RichTextEditorMarkdown } from "./RichTextEditorMarkdown";

const INITIAL_MARKDOWN = "Initial markdown text";
const EXTERNAL_MARKDOWN = "External markdown text";

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
});
