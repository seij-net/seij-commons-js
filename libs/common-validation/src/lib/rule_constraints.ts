import { LocalDate } from "@seij/common-types";

/**
 * Severity of a validation error
 *
 * Blocker means that the value is invalid and the user should not be able to save the form or commit changes.
 * Warning means that the value is problematic and should issue a user warning, but it doesn't mean it is invalid.
 *
 * For example, a date that is too far in the future could be a warning. However, it is not a blocker because the
 * user can still proceed.
 */
export type RuleConstraintValueSeverity = "BLOCKER" | "WARNING";

/**
 * Structure that represents a rule constraint value.
 * The goal is to be able to serialize and deserialize a constraint coming from the backend.
 *
 * @param T type of the value. For example, a number or a LocalDate.
 * @param code code of the constraint.
 * @param severity severity of the validation error, when validation fails, either "BLOCKER" or "WARNING".
 * @param message optional message to display to the user when validation fails.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface RuleConstraintValue<T> {
  code: string;
  severity: RuleConstraintValueSeverity;
  message?: string;
}

/**
 * Rule around "today" date. Tells how a date should be compared to today.
 * For example, if today is 2022-01-01, a constraint with todayConstraint = "LOWER" means that the value must be lower than today.
 */
export interface RuleConstraintValueToday extends RuleConstraintValue<LocalDate> {
  code: "TODAY";
  todayConstraint: ComparisonType;
}

/**
 * Rule that tells that the value must be present.
 * For example, if the value is null or undefined or empty, the constraint will fail.
 */
export interface RuleConstraintValueRequired<T> extends RuleConstraintValue<T> {
  code: "REQUIRED";
}

/**
 * Rule that tells that the value must not be lower than a given value.
 * For example, if the value is 10, the constraint with value = 5 will fail.
 */
export interface RuleConstraintValueMin<T> extends RuleConstraintValue<T> {
  code: "MIN";
  value: T;
}

/**
 * Rule that tells that the value must not be greater than a given value.
 * For example, if the value is 10, the constraint with value = 15 will fail.
 */
export interface RuleConstraintValueMax<T> extends RuleConstraintValue<T> {
  code: "MAX";
  value: T;
}

export type ComparisonType = "LOWER" | "LOWER_OR_EQUALS" | "GREATER" | "GREATER_OR_EQUALS";
