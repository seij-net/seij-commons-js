import { NumberFormatPercent0 } from "@seij/common-types";
import { isNil } from "lodash-es";

export function LabelPercentInt({ value }: { value: number }) {
  return <>{isNil(value) ? "" : NumberFormatPercent0.format(value)}</>;
}
