import { naturalize } from "./search";
describe("naturalise", () => {
  test("remove accents", () => {
    expect(naturalize("ééé")).toBe("eee");
  });
  test("to lowercase", () => {
    expect(naturalize("Méchant test")).toBe("mechant test");
  });
});
