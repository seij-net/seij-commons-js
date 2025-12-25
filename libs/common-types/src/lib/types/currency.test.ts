import { toCurrencySymbol } from "./currency";
import { expect, test } from "vitest";
test("EUR to €", () => {
  expect(toCurrencySymbol("EUR")).toBe("€");
});
