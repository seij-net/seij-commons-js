# common-ui-markdown

Markdown rendering component for Seij UIs, with support for syntax highlighting
and math.

## Usage

```tsx
import { Markdown } from "@seij/common-ui-markdown";
import "@seij/common-ui-markdown/styles";

export function HelpPanel() {
  return <Markdown>{`# Title\n\nSome **markdown** here.`}</Markdown>;
}
```

## What it provides

- `Markdown` React component built on `react-markdown`.
- GitHub-flavored markdown and math support via `remark-gfm` and `remark-math`.
- Syntax highlighting and KaTeX rendering via `rehype-highlight` and `rehype-katex`.
- Safe HTML handling with `rehype-sanitize` (custom schema for code, links, and images).
- Optional style imports for highlight.js and KaTeX via `styles.ts`.

## Supported markdown features

- Headings, emphasis, lists, blockquotes, and tables (GFM).
- Inline code and fenced code blocks with language highlighting.
- Task lists and strikethrough (GFM).
- Links (opened in a new tab) and images (lazy-loaded).
- Inline and block math (KaTeX).
