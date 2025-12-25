
export function createValidationMessage(
  template: string | null | undefined,
  defaultTemplate: string,
  replacer1: string,
): string {
  const msg = template ?? defaultTemplate;
  return msg.replace("{1}", replacer1);
}
