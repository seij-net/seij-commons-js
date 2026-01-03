import { toCurrencySymbol } from "@seij/common-types";

export function toCurrencySymbolSafe(code: string | null | undefined): string | undefined {
  if (code === null) return undefined;
  if (code === undefined) return code;
  if (code.length == 0) return code;
  if (code.length != 3) return code;
  try {
    return toCurrencySymbol(code);
  } catch (_) {
    return code;
  }
}
