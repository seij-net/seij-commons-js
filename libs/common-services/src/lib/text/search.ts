import { isEmpty, isNil, isString } from "lodash-es";

export function searchFilter<T extends Record<string, any>>(
  data: T[] | null | undefined,
  searchString: string,
  criterions: { property: keyof T; mode?: "text" | "exact" }[],
): T[] {
  if (!data) return [];
  if (isEmpty(data)) return [];
  if (isEmpty(searchString)) return data;
  return data.filter((it) => {
    for (const criterion of criterions) {
      const value = it[criterion.property];
      if (isNil(value)) return false;
      if (isEmpty(value)) return false;
      const valueAsString = isString(value) ? value : value.toString();
      const mode = criterion.mode ?? "text";
      if (mode === "exact") {
        if (valueAsString === searchString) return true;
      } else if (mode === "text") {
        if (naturalize(valueAsString).includes(searchString)) return true;
      }
    }
    return false;
  });
}
/**
 * Normalize diatrical marks for search and puts everything in lowercase
 * @param text input text
 * @returns normalized text
 */
export function naturalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}
