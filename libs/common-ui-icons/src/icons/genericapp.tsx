import { ChessRegular } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

export default function Genericapp(props: IconProps) {
  return <ChessRegular {...toFluentProps(props)} />;
}
