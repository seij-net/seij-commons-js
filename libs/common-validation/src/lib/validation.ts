import { defaultTo, find } from "lodash-es";
import { RuleConstraintValueSeverity } from "./rule_constraints";

/**
 * Structure that represents the result of a validation.
 * @param valid true if the value is valid, false otherwise
 * @param error the error message if the value is invalid, null otherwise
 * @param severity the severity of the error, either "BLOCKER" or "WARNING". If the value is valid, this is ignored.
 */
export type ValidationResult = {
  valid: boolean;
  error: string | null;
  severity: RuleConstraintValueSeverity;
};

/**
 * Single instance of ValidationResult that represents a valid value.
 */
export const valid: ValidationResult = { valid: true, error: null, severity: "WARNING" };

/**
 * Creates an invalid ValidationResult.
 * @param message Error or warning message.
 * @param severity Severity of the error. Defaults to "BLOCKER".
 */
export const invalid = (message: string, severity?: RuleConstraintValueSeverity): ValidationResult => ({
  valid: false,
  error: message,
  severity: defaultTo(severity, "BLOCKER")
});

/**
 * Creates an invalid ValidationResult with severity "WARNING".
 * @param message Error or warning message.
 */
export const invalidWarning = (message: string): ValidationResult => ({
  valid: false,
  error: message,
  severity: "WARNING"
});


/**
 *
 * Combines multiple ValidationResult into a single one.
 *
 * When combining ValidationResult, the first error encountered is returned.
 * When there are no errors, the ValidationResult returned is valid.
 *
 */
export const combineValidationResults = (results: ValidationResult[]): ValidationResult => {
  return defaultTo(
    find(results, (it) => !it.valid),
    valid
  );
};

