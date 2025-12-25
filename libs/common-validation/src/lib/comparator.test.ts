import { createComparator, createComparatorMessageToken } from "./comparator";
import { ComparisonType } from "@seij/common-validation";


interface TestCase {
  fn: ComparisonType;
  symbol: string;
  a: number;
  b: number;
  expected: boolean;
}

describe("createComparator", () => {
  const testCases: TestCase[] = [
    { fn: "LOWER", symbol: "<", a: 10, b: 20, expected: true },
    { fn: "LOWER", symbol: "<", a: 20, b: 20, expected: false },
    { fn: "LOWER", symbol: "<", a: 21, b: 20, expected: false },

    { fn: "LOWER_OR_EQUALS", symbol: "<=", a: 10, b: 20, expected: true },
    { fn: "LOWER_OR_EQUALS", symbol: "<=", a: 20, b: 20, expected: true },
    { fn: "LOWER_OR_EQUALS", symbol: "<=", a: 21, b: 20, expected: false },

    { fn: "GREATER", symbol: ">", a: 10, b: 20, expected: false },
    { fn: "GREATER", symbol: ">", a: 20, b: 20, expected: false },
    { fn: "GREATER", symbol: ">", a: 21, b: 20, expected: true },

    { fn: "GREATER_OR_EQUALS", symbol: ">=", a: 10, b: 20, expected: false },
    { fn: "GREATER_OR_EQUALS", symbol: ">=", a: 20, b: 20, expected: true },
    { fn: "GREATER_OR_EQUALS", symbol: ">=", a: 21, b: 20, expected: true },
  ];
  testCases.forEach((tc) => {
    it(`${tc.fn} a=${tc.a} b=${tc.b} expect symbol [${tc.symbol}] result=${tc.expected}`, () => {
      expect(createComparator(tc.fn)(tc.a, tc.b)).toBe(tc.expected);
      expect(createComparatorMessageToken(tc.fn)).toBe(tc.symbol);
    });
  });
});
