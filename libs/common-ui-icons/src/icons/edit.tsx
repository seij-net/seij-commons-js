import { EditRegular } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

export default function EditIcon(props: IconProps) {
  return <EditRegular {...toFluentProps(props)} />;
}
