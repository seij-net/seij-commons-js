import { DismissRegular } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

export default function DismissIcon(props: IconProps) {
  return <DismissRegular {...toFluentProps(props)} />;
}
