import { toCurrencySymbol } from "./currency";
import { describe, expect, test } from "vitest";
test("EUR to €", () => {
  expect(toCurrencySymbol("EUR")).toBe("€");
});
