/**
 * The problem in Chrome is that when it detects special names in labels
 * or titles or names or placeholders near a form field (rules changes)
 * it proposes to autofill or autocomplete the form field, which is
 * an heresy for ERP systems.
 *
 * This methods tends to obfuscate a label as a string so the browser doesn't
 * recognise it.
 *
 * We try to do that preserving accessibility by introducing special invisible
 * characters in the text at random places.
 *
 * @param str string to obfuscate
 * @returns obfuscated string
 */
export function obfuscateLabel(str: string) {
  const obfuscators = [
    "\u200B", // zero-width space
    "\u200C", // zero-width non-joiner
    "\u200D", // zero-width joiner
    "\u2060", // word joiner
  ];

  let result = "";

  for (let i = 0; i < str.length; i++) {
    result += str[i];

    // 50 % de chance d'ajouter un obfuscateur après chaque caractère
    if (Math.random() < 0.5) {
      const char = obfuscators[Math.floor(Math.random() * obfuscators.length)];
      result += char;
    }
  }

  return result;
}
