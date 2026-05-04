import { Button, Field, Input, makeStyles, Textarea, tokens } from "@fluentui/react-components";
import { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";
import { RichTextEditorJson, RichTextEditorRef } from "@seij/common-ui-richtext";
import { SeijUIProvider } from "@seij/common-ui";
import type { SerializedEditorState, SerializedParagraphNode, SerializedTextNode } from "lexical";

type RichTextStoryNode = SerializedParagraphNode | SerializedTextNode;

const useIntegrationStyles = makeStyles({
  page: {
    backgroundColor: tokens.colorNeutralBackground1,
    boxSizing: "border-box",
    minHeight: "100vh",
    overflow: "auto",
    padding: tokens.spacingHorizontalL,
    width: "100vw",
  },
  pageEditor: {
    maxHeight: "calc(100vh - 88px)",
  },
  formPage: {
    backgroundColor: tokens.colorNeutralBackground1,
    boxSizing: "border-box",
    minHeight: "100vh",
    padding: tokens.spacingHorizontalL,
    width: "100vw",
  },
  form: {
    display: "grid",
    gap: tokens.spacingVerticalM,
    maxWidth: "760px",
  },
  formEditor: {
    maxHeight: "160px",
  },
});

const meta = {
  title: "Components/RichTextEditorJson",
  component: RichTextEditorJson,
  parameters: {
    layout: "centered",
  },
  args: {
    value: createStateSimpleText(),
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

export const SimplePageIntegration: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => {
    const styles = useIntegrationStyles();
    const initialJson = createStateLongFormIntegration();
    const [value, setValue] = useState(initialJson);
    const [saved, setSaved] = useState(initialJson);
    const [debug, setDebug] = useState(false);
    const editorRef = useRef<RichTextEditorRef>(null);

    return (
      <div className={styles.page}>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            gap: tokens.spacingHorizontalS,
            marginBottom: tokens.spacingVerticalM,
          }}
        >
          <Button onClick={() => editorRef.current?.focus()}>Focus</Button>
          <Button onClick={() => setSaved(value)}>Save</Button>
          <Button onClick={() => setValue(saved)}>Load</Button>
          <Button onClick={() => setDebug(!debug)}>Display tree</Button>
        </div>
        <RichTextEditorJson
          {...args}
          classNames={{ editor: styles.pageEditor }}
          debug={debug}
          ref={editorRef}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

export const FormIntegration: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => {
    const styles = useIntegrationStyles();
    const [value, setValue] = useState(createStateLongFormIntegration());

    return (
      <div className={styles.formPage}>
        <form className={styles.form}>
          <Field label="Title">
            <Input />
          </Field>
          <Field label="Summary">
            <Textarea resize="vertical" />
          </Field>
          <Field label="Description">
            <RichTextEditorJson
              {...args}
              classNames={{ editor: styles.formEditor }}
              value={value}
              onChange={setValue}
            />
          </Field>
          <RawValue value={JSON.stringify(value, null, 2)} />
        </form>
      </div>
    );
  },
};

function createStateSimpleText() {
  const INITIAL_PARAGRAPH_NODE: SerializedParagraphNode = {
    children: [createTextNode("Editable text")],
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
  return INITIAL_JSON_VALUE;
}

function createStateLongFormIntegration() {
  const LONG_JSON_VALUE: SerializedEditorState = {
    root: {
      children: Array.from(
        { length: 18 },
        (_, index): SerializedParagraphNode => ({
          children: [
            createTextNode(
              `Paragraph ${index + 1}. This content is intentionally long enough to show the editor growing until its container limit is reached. The toolbar must stay visible while the editable area scrolls.`,
            ),
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "paragraph",
          version: 1,
          textFormat: 0,
          textStyle: "",
        }),
      ),
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  };
  return LONG_JSON_VALUE;
}

function createTextNode(text: string): SerializedTextNode {
  return {
    detail: 0,
    format: 0,
    mode: "normal",
    style: "",
    text: text,
    type: "text",
    version: 1,
  };
}
