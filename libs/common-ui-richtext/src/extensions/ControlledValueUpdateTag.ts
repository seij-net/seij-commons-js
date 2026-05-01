/**
 * This tag means: "this update comes from props.value".
 *
 * It is not a user edit.
 *
 * If an onChange extension does not ignore this tag, this happens:
 * 1. React sends props.value to Lexical.
 * 2. Lexical updates its internal state.
 * 3. onChange fires for the value React just sent.
 *
 * That is wrong. It can loop, and even when it does not loop it reports a fake
 * user change.
 *
 * The tag is not JSON-specific. Any controlled value format has the same
 * problem.
 */
export const CONTROLLED_VALUE_UPDATE_TAG = "seij-controlled-value";
