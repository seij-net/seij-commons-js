import { defineExtension, LexicalEditor, safeCast } from "lexical";
import { type ForwardedRef, useImperativeHandle, useRef } from "react";

type EditorRef = {
  current: LexicalEditor | null;
};

/**
 * API exposed to callers through `<RichTextEditor ref={...} />`.
 *
 * The parent component needs a way to say "focus the editor now". Focus is a
 * one-shot command, not a durable React state, so it is exposed as an
 * imperative method.
 */
export interface RichTextEditorRef {
  /** Move focus into the underlying editor. */
  focus: () => void;

  /**
   * Returns the underlying Lexical editor instance.
   *
   * This is an implementation escape hatch, not an application API. It exists
   * because Lexical owns its editor state and DOM reconciliation internally,
   * which makes realistic component tests difficult to write through jsdom
   * events alone. Tests may use this method to drive Lexical through its own
   * `editor.update(...)` API and exercise the real change listener path.
   *
   * Application code must not depend on this method. Using the raw Lexical
   * instance in product code couples the caller to this component's current
   * implementation and bypasses the controlled `value` / `onChange` contract.
   */
  getEditor: () => LexicalEditor | null;
}

/**
 * Config used to connect React's public ref with Lexical's editor instance.
 *
 * React creates the public handle before this module has a Lexical editor
 * instance to call. Lexical only provides that instance later, when it installs
 * the extension and calls `register(editor, config)`.
 *
 * `editorRef` is the shared box between those two moments:
 * - `useEditorRef` creates it while wiring the public React handle.
 * - `EditorRefExtension.register` fills it when Lexical provides the editor.
 */
export type EditorRefExtensionConfig = {
  /**
   * Mutable storage for the Lexical editor instance.
   *
   * This is not exposed to consumers. It exists because the public `focus()`
   * method and the Lexical editor instance are created by different systems at
   * different times.
   */
  editorRef: EditorRef | null;
};

/**
 * Extension that stores the Lexical editor instance as soon as Lexical creates
 * it.
 *
 * Without this bridge, `RichTextEditorRef.focus()` would have no editor to
 * call. The React ref handle can be created during render, but the actual
 * editor instance belongs to Lexical's extension lifecycle.
 */
export const EditorRefExtension = defineExtension({
  name: "seij-editor-ref",
  config: safeCast<EditorRefExtensionConfig>({
    editorRef: null,
  }),
  register: (editor, config) => {
    const { editorRef } = config;

    if (editorRef === null) {
      return () => {};
    }

    // From this point on, the public `focus()` handle has a real editor to use.
    editorRef.current = editor;

    return () => {
      // Clear only the instance registered by this extension run. If React or
      // Lexical has already installed a newer editor, this cleanup must not
      // erase it.
      if (editorRef.current === editor) {
        editorRef.current = null;
      }
    };
  },
});

/**
 * Builds the two-part ref bridge needed by the editor.
 *
 * Why two refs?
 *
 * The forwarded `ref` is owned by the parent and must expose the public API
 * immediately. The private `editorRef` is owned by this component and starts
 * empty because Lexical has not provided its editor instance yet.
 *
 * `useImperativeHandle` exposes a stable public `focus()` method. That method
 * reads `editorRef.current` only when it is called, so it can be created before
 * Lexical finishes registering the extension.
 *
 * The returned `editorRef` must be passed to `EditorRefExtension`, which will
 * fill it with the Lexical editor instance.
 *
 * Usage:
 * ```
 * const editorRef = useEditorRef(ref);
 * ```
 */
export function useEditorRef(ref: ForwardedRef<RichTextEditorRef>) {
  const editorRef = useRef<LexicalEditor | null>(null);

  // Expose commands now; resolve the Lexical editor later when invoked.
  useImperativeHandle(
    ref,
    () => ({
      focus: () => editorRef.current?.focus(),
      getEditor: () => editorRef.current,
    }),
    [],
  );

  return editorRef;
}
