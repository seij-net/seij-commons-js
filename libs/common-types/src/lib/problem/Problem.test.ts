import { Problem, ProblemJson, toProblem } from "./Problem";
describe("toProblem", () => {
  test("null input then problem is null", () => {
    expect(toProblem(null)).toBeNull();
  });
  test("undefined input then problem is null", () => {
    expect(toProblem(undefined)).toBeNull();
  });
  test("problem input then problem is the same", () => {
    // Volontairement on ne met pas "type"
    const problem = { title: "mon probleme" } as ProblemJson;
    const pb = new Problem(problem);
    expect(toProblem(pb)).toEqual(pb);
  });
  test("error input then problem is created", () => {
    const pb = new Error("mon message");
    expect(toProblem(pb)?.title).toBe("mon message");
  });
  test("error subclass input then problem is the same", () => {
    const pb = new TypeError("mon message");
    expect(toProblem(pb)?.title).toBe("mon message");
  });
  test("DOMException input then problem is the same", () => {
    const pb = new DOMException("mon message");
    expect(toProblem(pb)?.title).toBe("mon message");
  });
  test("error string input then problem is the same", () => {
    expect(toProblem("mon message")?.title).toBe("mon message");
  });
  test("error any input then problem has same message", () => {
    const toto = { toto: "tutu " };
    const str = "" + toto;
    expect(toProblem(toto)?.title).toBe(str);
  });
});
