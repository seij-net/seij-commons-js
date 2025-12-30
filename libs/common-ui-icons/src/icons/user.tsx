// icons/add.tsx
import { PersonRegular } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

export default function UserIcon(props: IconProps) {
  return <PersonRegular {...toFluentProps(props)} />;
}
