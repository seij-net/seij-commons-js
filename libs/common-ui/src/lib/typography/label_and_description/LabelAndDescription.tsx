import { Body1 } from "@fluentui/react-components";
import { Description } from "../description/Description";

export function LabelAndDescription({
  label,
  description,
}: {
  label: string | null | undefined;
  description: string | null | undefined;
}) {
  return (
    <div>
      <div>
        <Body1>{label}</Body1>
      </div>
      <div>
        <Description value={description} />
      </div>
    </div>
  );
}
