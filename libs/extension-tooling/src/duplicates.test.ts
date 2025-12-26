import { errorOnDuplicates, searchOnDuplicates } from "./duplicates";

describe("searchOnDuplicates", () => {
  it("shall give an empty list", () => {
    const items = [{ code: "A" }, { code: "B" }, { code: "C" }];
    const duplicates: Array<{ curr: { code: string }; prev: { code: string } }> = [];

    searchOnDuplicates(
      items,
      (item) => item.code,
      (curr, prev) => {
        duplicates.push({ curr, prev });
      },
    );

    expect(duplicates).toEqual([]);
  });

  it("shall detect duplicates", () => {
    const a1 = { code: "A" };
    const a2 = { code: "A" };
    const b1 = { code: "B" };
    const a3 = { code: "A" };
    const duplicates: Array<{ curr: { code: string }; prev: { code: string } }> = [];

    searchOnDuplicates(
      [a1, b1, a2, a3],
      (item) => item.code,
      (curr, prev) => {
        duplicates.push({ curr, prev });
      },
    );

    expect(duplicates).toEqual([
      { curr: a2, prev: a1 },
      { curr: a3, prev: a2 },
    ]);
  });
});

describe("errorOnDuplicates", () => {
  it("shall give an empty list", () => {
    const items = [{ code: "A" }, { code: "B" }, { code: "C" }];

    expect(() => errorOnDuplicates(items, (item) => item.code)).not.toThrow();
  });

  it("shall throw an error with the key", () => {
    const items = [{ code: "A" }, { code: "B" }, { code: "A" }];

    expect(() => errorOnDuplicates(items, (item) => item.code)).toThrow("Duplicate type code: A");
  });
});
