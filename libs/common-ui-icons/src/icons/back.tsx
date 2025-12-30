import { ArrowLeft24Filled } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

export default function BackIcon(props: IconProps) {
  return <ArrowLeft24Filled {...toFluentProps(props)} />;
}
