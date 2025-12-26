import { Caption1 } from "@fluentui/react-components";

export function Description({ value }: { value: string | null | undefined }) {
  if (!value) return null;
  return <Caption1>{value}</Caption1>;
}
