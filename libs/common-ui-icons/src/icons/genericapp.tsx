import { Chess24Regular } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

export default function Genericapp(props: IconProps) {
  return <Chess24Regular {...toFluentProps(props)} />;
}
