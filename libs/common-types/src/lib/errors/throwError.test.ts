import { toProblem } from "../problem/Problem";
import { throwError } from "./throwError";
describe("throwError", () => {
  test("should throw error", () => {
    const a = null;
    try {
      const toto = a ?? throwError("Error should be thrown");
      expect(toto).not.toBeNull();
    } catch (e) {
      expect(toProblem(e)?.title).toBe("Error should be thrown");
    }
  });
});
