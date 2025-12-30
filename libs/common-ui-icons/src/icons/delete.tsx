// icons/add.tsx
import { DeleteRegular } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

export default function DeleteIcon(props: IconProps) {
  return <DeleteRegular {...toFluentProps(props)} />;
}
