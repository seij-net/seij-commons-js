# common-validation

Small validation primitives and constraint types used across Seij applications.

## Concept

The library lets you define field validation rules as data, then evaluate them
the same way in every form. A validation result is `{ valid, error, severity }`
where severity is `BLOCKER` (cannot save) or `WARNING` (show message but allow
save). This keeps UI validation consistent and easy to share.

## Example: fields with rules

```ts
const fields = [
  {
    key: "age",
    label: "Age",
    type: "number",
    rules: [
      { code: "REQUIRED", severity: "BLOCKER" },
      { code: "MIN", value: 10, severity: "BLOCKER" },
      { code: "MIN", value: 18, severity: "WARNING" },
    ],
  },
  {
    key: "registered",
    label: "Registered at",
    type: "localdate",
    rules: [{ code: "TODAY", todayConstraint: "LOWER_OR_EQUALS", severity: "BLOCKER" }],
  },
  {
    key: "recall",
    label: "Recall customer at",
    type: "localdate",
    rules: [{ code: "TODAY", todayConstraint: "GREATER", severity: "BLOCKER" }],
  },
];
```

## Mini guide: validate a form in practice

### 1) Validate a field using its rules

```ts
import {
  valid,
  invalid,
  createComparator,
  createComparatorMessageToken,
  createValidationMessage,
  type RuleConstraintValueRequired,
  type RuleConstraintValueMin,
  type RuleConstraintValueMax,
  type RuleConstraintValueToday,
} from "@seij/common-validation";
import type { LocalDate } from "@seij/common-types";

type NumberRule = RuleConstraintValueRequired<number> | RuleConstraintValueMin<number> | RuleConstraintValueMax<number>;

type DateRule = RuleConstraintValueToday;

function validateNumber(value: number | null | undefined, rules: NumberRule[]) {
  for (const rule of rules) {
    if (rule.code === "REQUIRED" && (value === null || value === undefined)) {
      return invalid(rule.message ?? "Value is required", rule.severity);
    }
    if (rule.code === "MIN" && value !== null && value !== undefined) {
      if (value >= rule.value) continue;
      const msg = createValidationMessage(rule.message, "Value must be >= {1}", String(rule.value));
      return invalid(msg, rule.severity);
    }
    if (rule.code === "MAX" && value !== null && value !== undefined) {
      if (value <= rule.value) continue;
      const msg = createValidationMessage(rule.message, "Value must be <= {1}", String(rule.value));
      return invalid(msg, rule.severity);
    }
  }
  return valid;
}

function validateDate(value: LocalDate | null | undefined, rules: DateRule[], today: LocalDate) {
  for (const rule of rules) {
    if (rule.code === "TODAY" && value) {
      const ok = createComparator(rule.todayConstraint)(value, today);
      if (ok) continue;
      const token = createComparatorMessageToken(rule.todayConstraint);
      const msg = createValidationMessage(rule.message, "Date must be {1} today", token);
      return invalid(msg, rule.severity);
    }
  }
  return valid;
}
```

### 2) Aggregate results to drive the form UI

```ts
import { combineValidationResults } from "@seij/common-validation";

const ageResult = validateNumber(form.age, fields[0].rules);
const registeredResult = validateDate(form.registered, fields[1].rules, today);
const recallResult = validateDate(form.recall, fields[2].rules, today);

const formResult = combineValidationResults([ageResult, registeredResult, recallResult]);
const hasBlockingError = !formResult.valid && formResult.severity === "BLOCKER";
```

Typical UI usage:

- Show `formResult.error` near the field or in a summary.
- Disable submit when `hasBlockingError` is true.
- For `WARNING`, show a message but allow the user to save.
- LocalDate is always `YYYY-MM-DD`, so string comparison is safe. (see @seij/common-types)
