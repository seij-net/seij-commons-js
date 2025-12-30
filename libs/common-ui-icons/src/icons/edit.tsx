import { Edit24Regular } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

export default function EditIcon(props: IconProps) {
  return <Edit24Regular {...toFluentProps(props)} />;
}
