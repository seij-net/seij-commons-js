import { Button, tokens } from "@fluentui/react-components";
import { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";
import { RichTextEditor, RichTextEditorHandle } from "./RichTextEditor";
import { SeijUIProvider } from "@seij/common-ui";

const meta = {
  title: "Components/RichTextEditor",
  component: RichTextEditor,
  parameters: {
    layout: "centered",
  },
  args: {
    value: "Editable text",
    disabled: false,
  },
  decorators: [
    (Story) => (
      <SeijUIProvider>
        <Story />
      </SeijUIProvider>
    ),
  ],
} satisfies Meta<typeof RichTextEditor>;

export default meta;

type Story = StoryObj<typeof RichTextEditor>;

function RawValue({ value }: { value: string }) {
  return <pre style={{ margin: "12px 0 0", whiteSpace: "pre-wrap" }}>{value}</pre>;
}

export const Basic: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <>
        <RichTextEditor {...args} value={value} onChange={setValue} />
        <RawValue value={value} />
      </>
    );
  },
};

export const WithFocusHandle: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    const editorRef = useRef<RichTextEditorHandle>(null);

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
          <RawValue value={value} />
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
          <RichTextEditor {...args} ref={editorRef} value={value} onChange={setValue} />
        </div>
      </div>
    );
  },
};
