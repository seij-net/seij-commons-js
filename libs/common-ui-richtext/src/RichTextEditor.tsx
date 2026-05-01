import { Input } from "@fluentui/react-components";
import { ChangeEventHandler, ForwardedRef, forwardRef, useImperativeHandle, useRef } from "react";

export interface RichTextEditorHandle {
  focus: () => void;
}

export interface RichTextEditorProps {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}

export const RichTextEditor = forwardRef(function RichTextEditor(
  props: RichTextEditorProps,
  ref: ForwardedRef<RichTextEditorHandle>,
) {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => inputRef.current?.focus(),
    }),
    [],
  );

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    props.onChange(event.currentTarget.value);
  };

  return <Input ref={inputRef} value={props.value} disabled={props.disabled} onChange={handleChange} />;
});
