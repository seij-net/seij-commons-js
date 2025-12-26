import { defaultSchema } from "hast-util-sanitize";
import ReactMarkdown, { Options } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

const schema = {
  ...defaultSchema,
  // on autorise className sur <code>/<pre> pour la détection de langue highlight.js
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.["code"] || []), ["className"]],
    pre: [...(defaultSchema.attributes?.["pre"] || []), ["className"]],
    span: [...(defaultSchema.attributes?.["span"] || []), ["className"]],
    a: [
      ...(defaultSchema.attributes?.["a"] || []),
      // autoriser target et rel sûrs pour les liens
      ["target"],
      ["rel"],
    ],
    img: [...(defaultSchema.attributes?.["img"] || []), ["width"], ["height"], ["loading"]],
  },
};

const options: Options = {
  remarkPlugins: [remarkGfm, remarkMath],
  rehypePlugins: [[rehypeSanitize, schema], rehypeKatex, rehypeHighlight],
  components: {
    a: ({ node, ...props }) => <a {...props} target="_blank" rel="nofollow noopener noreferrer" />,
    img: (props) => (
      // si tu utilises Next.js, remplace par <Image ... />
      <img {...props} loading="lazy" />
    ),
  },
};

export function Markdown({ children }: { children: string | null | undefined }) {
  return <ReactMarkdown {...options}>{children}</ReactMarkdown>;
}
