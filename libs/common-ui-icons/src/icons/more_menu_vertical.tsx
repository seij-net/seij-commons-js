// icons/add.tsx
import { MoreVertical24Filled } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

export default function MoreMenuVerticalIcon(props: IconProps) {
  return <MoreVertical24Filled {...toFluentProps(props)} />;
}
