export function errorOnDuplicates<T>(items: T[], criterion: (item: T) => string) {
  const seen: Record<string, true> = {};
  for (const item of items) {
    const key = criterion(item);
    if (seen[key]) {
      throw new Error(`Duplicate type code: ${key}`);
    }
    seen[key] = true;
  }
}

/**
 * Tries to find items with the same property value.
 * @param items list of items
 * @param criterion how to extract needed property
 * @param onDuplicate called each time a duplicate is found with current item and previously found item with the same criterion
 */
export function searchOnDuplicates<T>(
  items: T[],
  criterion: (item: T) => string,
  onDuplicate: (curr: T, previous: T) => void,
) {
  const seen: Record<string, T> = {};
  for (const item of items) {
    const key = criterion(item);
    const found = seen[key];
    if (seen[key]) {
      onDuplicate(item, found);
    }
    seen[key] = item;
  }
}
