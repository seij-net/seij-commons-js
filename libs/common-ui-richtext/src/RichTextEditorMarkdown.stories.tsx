import { Button, tokens } from "@fluentui/react-components";
import { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";
import { RichTextEditorRef } from "./RichTextEditorJson";
import { SeijUIProvider } from "@seij/common-ui";
import { RichTextEditorMarkdown } from "./RichTextEditorMarkdown";

const SAMPLE_MARKDOWN = `
# Main title

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae pellentesque leo. Nulla feugiat suscipit sem, eu pretium urna sagittis tempor. Vestibulum lorem leo, aliquam laoreet interdum vitae, tempus nec risus. Quisque sit amet tortor sem. In fringilla libero fringilla nunc auctor, sed viverra augue ullamcorper. Morbi venenatis blandit egestas. Cras cursus elit eros, ut posuere lectus ultrices et. Mauris mattis sed eros eu bibendum. Proin enim dolor, aliquam eget elementum vitae, vulputate vel purus. Etiam id interdum neque. Sed id felis sed turpis placerat molestie. Aenean pretium sed tortor eu porta. Curabitur imperdiet eleifend ipsum ut molestie. Nam ut viverra ex, eu aliquet ipsum. Praesent lorem sapien, pellentesque nec luctus sed, semper in sapien.

Phasellus vulputate est ac tincidunt molestie. Integer non velit consequat, scelerisque neque sed, hendrerit urna. Vestibulum ullamcorper tortor at urna dictum, sit amet bibendum ante accumsan. Donec a viverra metus. Nullam velit nunc, auctor ac fermentum ut, semper nec tortor. Cras ornare tellus vitae sem consectetur, sit amet tempor dolor tempus. Nulla viverra diam urna, id ullamcorper lectus dignissim nec. Vivamus purus sapien, rhoncus vitae mi quis, pretium posuere tellus.

Praesent eget viverra ex, in auctor nunc. Sed a purus vel mi mattis mattis vel non elit. Etiam sit amet fermentum mauris, dictum tincidunt justo. Morbi egestas, felis et laoreet condimentum, erat mi pharetra est, vitae auctor felis est vitae magna. Ut bibendum convallis libero, quis tempus massa consectetur eget. Vivamus ac facilisis diam. Phasellus ornare lacus nisl, at imperdiet ante lobortis vel. Vestibulum sodales velit tincidunt augue hendrerit, et ultricies nulla vestibulum. Praesent id congue augue, id bibendum diam. In rutrum mi nisl, et hendrerit nulla gravida id. Proin sem libero, efficitur eleifend viverra in, imperdiet eget nisi.

This is some text<br />
With carriage return


## Emphasis

Emphasis, aka italics, with *asterisks* or _underscores_.

Strong emphasis, aka bold, with **asterisks** or __underscores__.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~

**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_

~~Strikethrough~~

## Lists

1. First ordered list item
2. Another item
  * Unordered sub-list.
1. Actual numbers don't matter, just that it's a number
  1. Ordered sub-list
4. And another item.

   You can have properly indented paragraphs within list items. Notice the blank line above, and the leading spaces (at least one, but we'll use three here to also align the raw Markdown).

   To have a line break without a paragraph, you will need to use two trailing spaces.
   Note that this line is separate, but within the same paragraph.
  (This is contrary to the typical GFM line break behaviour, where trailing spaces are not required.)

* Unordered list can use asterisks
- Or minuses
+ Or pluses

1. Make my changes
    1. Fix bug
    2. Improve formatting
        - Make the headings bigger
2. Push my commits to GitHub
3. Open a pull request
    * Describe my changes
    * Mention all the members of my team
        * Ask for feedback

+ Create a list by starting a line with \`+\`, \`-\`, or \`*\`
+ Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ Very easy!

`;

const meta = {
  title: "Components/RichTextEditorMarkdown",
  component: RichTextEditorMarkdown,
  parameters: {
    layout: "centered",
  },
  args: {
    value: SAMPLE_MARKDOWN,
    disabled: false,
  },
  decorators: [
    (Story) => (
      <SeijUIProvider>
        <Story />
      </SeijUIProvider>
    ),
  ],
} satisfies Meta<typeof RichTextEditorMarkdown>;

export default meta;

type Story = StoryObj<typeof RichTextEditorMarkdown>;

function RawValue({ value }: { value: string }) {
  return <pre style={{ margin: "12px 0 0", whiteSpace: "pre-wrap" }}>{value}</pre>;
}

export const MarkdownValue: Story = {
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
          <RichTextEditorMarkdown {...args} debug={debug} ref={editorRef} value={value} onChange={setValue} />
        </div>
      </div>
    );
  },
};
