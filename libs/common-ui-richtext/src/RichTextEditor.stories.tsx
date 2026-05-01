import { Button, Field } from "@fluentui/react-components";
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
  render: (args) => {
    const [value, setValue] = useState(args.value);
    const editorRef = useRef<RichTextEditorHandle>(null);

    return (
      <Field label="Rich text editor">
        <div style={{ display: "flex", gap: 8 }}>
          <RichTextEditor {...args} ref={editorRef} value={value} onChange={setValue} />
          <Button onClick={() => editorRef.current?.focus()}>Focus</Button>
        </div>
        <RawValue value={value} />
      </Field>
    );
  },
};
