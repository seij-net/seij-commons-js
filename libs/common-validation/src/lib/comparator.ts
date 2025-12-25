import { ComparisonType } from "./rule_constraints";

export function createComparator<T>(todayConstraint: ComparisonType | null): (a: T, b: T) => boolean {
  let comparator;
  switch (todayConstraint) {
    case "LOWER":
      comparator = (a: T, b: T) => a < b;
      break;
    case "LOWER_OR_EQUALS":
      comparator = (a: T, b: T) => a <= b;
      break;
    case "GREATER":
      comparator = (a: T, b: T) => a > b;
      break;
    case "GREATER_OR_EQUALS":
      comparator = (a: T, b: T) => a >= b;
      break;
    default:
      throw Error("Unknown comparator type: " + todayConstraint);
  }
  return comparator;
}

export function createComparatorMessageToken(todayConstraint: ComparisonType | null) {
  let comparator;
  switch (todayConstraint) {
    case "LOWER":
      comparator = "<";
      break;
    case "LOWER_OR_EQUALS":
      comparator = "<=";
      break;
    case "GREATER":
      comparator = ">";
      break;
    case "GREATER_OR_EQUALS":
      comparator = ">=";
      break;
    default:
      throw Error("Unknown comparator type: " + todayConstraint);
  }
  return comparator;
}
