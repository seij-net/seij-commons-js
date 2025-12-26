import { Meta, StoryObj } from "@storybook/react-vite";
import { Markdown } from "./Markdown";
const meta = {
  title: "Components/Markdown",
  component: Markdown,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Markdown>;

export default meta;

type Story = StoryObj<typeof Markdown>;

const markdownSample = `
# Markdown Component Demo

This is a **Markdown** story covering various features.

## Links

- [Storybook](https://storybook.js.org)
- [GitHub](https://github.com)

## Lists

- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2

## Table

| Name    | Value | Description         |
| ------- | ----- | ------------------- |
| Alpha   | 1     | First item          |
| Beta    | 2     | Second item         |
| Gamma   | 3     | Third item          |

## Code

Inline code: \`const x = 42;\`

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Blockquote

> This is a blockquote.
> It can span multiple lines.

## Math

Inline math: $E = mc^2$

Block math:

$$
\\int_{a}^{b} x^2 dx = \\frac{b^3 - a^3}{3}
$$

## Image

![Storybook Logo](https://storybook.js.org/images/icon-storybook.svg)

---

Enjoy exploring **Markdown**!
`;

export const FullSpectrum: Story = {
  args: {
    children: markdownSample,
  },
};
