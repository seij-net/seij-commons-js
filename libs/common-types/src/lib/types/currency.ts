import { memoize } from "lodash-es";

/** Le code d'une currency en trois lettres : EUR, USD, etc. */
export type CurrencyCode = string;

function toCurrencySymbolRaw(code: CurrencyCode): string {
  return (
    Intl.NumberFormat(undefined, {
      style: "currency",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currency: code,
    })
      .formatToParts(0)
      .find((x) => x.type === "currency")?.value ?? "N/A"
  );
}
export const toCurrencySymbol: (code: string) => string = memoize(toCurrencySymbolRaw);
