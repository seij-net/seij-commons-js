import { createCSV } from "./createcsv";
import { CSVColumnDefinition } from "./types";

type ItemSample = {
  a: number;
  b: string;
  c: number;
};

const definitions: CSVColumnDefinition<ItemSample>[] = [
  {
    code: "a",
    render: (item) => "" + item.a * 10,
    label: "Column A",
  },
  {
    code: "unnamed",
    render: (item) => item.b,
  },
  {
    code: "total",
    render: (item) => "" + (item.a * 10 + item.c),
  },
];

const items: ItemSample[] = [
  { a: 2, b: "testB", c: 3 },
  { a: 1, b: 'testB "2"', c: 4 },
];

const expected = `"Column A","unnamed","total"\r
"20","testB","23"\r
"10","testB \"\"2\"\"","14"`

describe("createCSV", () => {
  it("generates sample", () => {
    expect(createCSV<ItemSample>(definitions, items)).toBe(expected);
  });
});
