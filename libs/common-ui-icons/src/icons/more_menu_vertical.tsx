// icons/add.tsx
import { MoreVerticalFilled } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

export default function MoreMenuVerticalIcon(props: IconProps) {
  return <MoreVerticalFilled {...toFluentProps(props)} />;
}
