import type { JSX } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

export default function OnChangeJsonPlugin({ onChange }: { onChange: (value: string) => void }): JSX.Element {
  const [editor] = useLexicalComposerContext();
  return <OnChangePlugin onChange={(state, editor, tags) => {
    onChange(JSON.stringify(state.toJSON()))
  }} ignoreSelectionChange={true} />;
}
