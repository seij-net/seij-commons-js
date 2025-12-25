import { combineValidationResults, invalid, valid, ValidationResult } from "./validation";

describe("combineValidationResults", () => {
  const resultsEmpty: ValidationResult[] = [];
  expect(combineValidationResults(resultsEmpty).valid).toBe(true);

  test("one valid then valid", () => {
    const resultsOne: ValidationResult[] = [valid];
    const validationResult = combineValidationResults(resultsOne);
    expect(validationResult.valid).toBe(true);
  });

  test("one invalid and valid then invalid", () => {
    const resultsOne: ValidationResult[] = [invalid("foo")];
    const validationResult = combineValidationResults(resultsOne);
    expect(validationResult.valid).toBe(false);
    expect(validationResult.error).toBe("foo");
  });

  test("two with at least one invalid then valid", () => {
    const resultsOne: ValidationResult[] = [valid, invalid("foo")];
    const validationResult = combineValidationResults(resultsOne);
    expect(validationResult.valid).toBe(false);
    expect(validationResult.error).toBe("foo");
  });
  test("all valid then valid", () => {
    const resultsOne: ValidationResult[] = [valid, valid];
    const validationResult = combineValidationResults(resultsOne);
    expect(validationResult.valid).toBe(true);
  });
});
