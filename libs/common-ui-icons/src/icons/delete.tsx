// icons/add.tsx
import { Add24Regular } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

export default function DeleteIcon(props: IconProps) {
  return <Add24Regular {...toFluentProps(props)} />;
}
