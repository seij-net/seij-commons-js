import { Button, tokens } from "@fluentui/react-components";
import { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";
import { RichTextEditorJson, RichTextEditorRef } from "@seij/common-ui-richtext";
import { SeijUIProvider } from "@seij/common-ui";
import type { SerializedEditorState, SerializedParagraphNode, SerializedTextNode } from "lexical";

type RichTextStoryNode = SerializedParagraphNode | SerializedTextNode;

const INITIAL_TEXT_NODE: SerializedTextNode = {
  detail: 0,
  format: 0,
  mode: "normal",
  style: "",
  text: "Editable text",
  type: "text",
  version: 1,
};

const INITIAL_PARAGRAPH_NODE: SerializedParagraphNode = {
  children: [INITIAL_TEXT_NODE],
  direction: "ltr",
  format: "",
  indent: 0,
  type: "paragraph",
  version: 1,
  textFormat: 0,
  textStyle: "",
};

const INITIAL_JSON_VALUE: SerializedEditorState<RichTextStoryNode> = {
  root: {
    children: [INITIAL_PARAGRAPH_NODE],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
};

const meta = {
  title: "Components/RichTextEditorJson",
  component: RichTextEditorJson,
  parameters: {
    layout: "centered",
  },
  args: {
    value: INITIAL_JSON_VALUE,
    disabled: false,
  },
  decorators: [
    (Story) => (
      <SeijUIProvider>
        <Story />
      </SeijUIProvider>
    ),
  ],
} satisfies Meta<typeof RichTextEditorJson>;

export default meta;

type Story = StoryObj<typeof RichTextEditorJson>;

function RawValue({ value }: { value: string }) {
  return <pre style={{ margin: "12px 0 0", whiteSpace: "pre-wrap" }}>{value}</pre>;
}

export const Basic: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);
    const [saved, setSaved] = useState(args.value);

    return (
      <>
        <Button onClick={() => setSaved(value)}>Save</Button>
        <Button onClick={() => setValue(saved)}>Load</Button>
        <RichTextEditorJson {...args} value={value} onChange={setValue} />
        <RawValue value={JSON.stringify(value, null, 2)} />
      </>
    );
  },
};

export const JsonValue: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    const [saved, setSaved] = useState(args.value);
    const [debug, setDebug] = useState(false);
    const editorRef = useRef<RichTextEditorRef>(null);

    return (
      <div
        style={{
          display: "flex",
          width: "100vw",
          height: "100vh",
          minHeight: 0,
          overflow: "hidden",
          backgroundColor: tokens.colorNeutralBackground1,
        }}
      >
        <div
          style={{
            width: 360,
            minWidth: 280,
            maxWidth: "40vw",
            minHeight: 0,
            overflow: "auto",
            borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
            boxSizing: "border-box",
            padding: tokens.spacingHorizontalM,
          }}
        >
          <Button onClick={() => editorRef.current?.focus()}>Focus</Button>
          <Button onClick={() => setSaved(value)}>Save</Button>
          <Button onClick={() => setValue(saved)}>Load</Button>
          <Button onClick={() => setDebug(!debug)}>Display tree</Button>
          <RawValue value={JSON.stringify(value, null, 2)} />
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            overflow: "auto",
            boxSizing: "border-box",
            padding: tokens.spacingHorizontalM,
          }}
        >
          <RichTextEditorJson {...args} debug={debug} ref={editorRef} value={value} onChange={setValue} />
        </div>
      </div>
    );
  },
};
