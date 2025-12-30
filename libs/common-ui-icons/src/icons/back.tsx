import { ArrowLeftFilled } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

export default function BackIcon(props: IconProps) {
  return <ArrowLeftFilled {...toFluentProps(props)} />;
}
