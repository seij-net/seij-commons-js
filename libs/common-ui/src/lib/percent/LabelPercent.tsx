import { NumberFormatPercent } from "@seij/common-types";
import { isNil } from "lodash-es";

import { FC } from "react";

export const LabelPercent: FC<{ value: number }> = ({ value }) => {
  return <>{isNil(value) ? "" : NumberFormatPercent.format(value)}</>;
};
export const LabelRate = LabelPercent;
