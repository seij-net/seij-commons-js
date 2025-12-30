// icons/add.tsx
import { ChevronRight24Filled } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

export default function ChevronRightFilled(props: IconProps) {
  return <ChevronRight24Filled {...toFluentProps(props)} />;
}
