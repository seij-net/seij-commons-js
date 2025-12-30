// icons/add.tsx
import { AddRegular } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

export default function AddIcon(props: IconProps) {
  return <AddRegular {...toFluentProps(props)} />;
}
