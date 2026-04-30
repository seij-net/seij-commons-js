// icons/add.tsx
import { ErrorCircleRegular } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

export default function DeleteIcon(props: IconProps) {
  return <ErrorCircleRegular {...toFluentProps(props)} />;
}
