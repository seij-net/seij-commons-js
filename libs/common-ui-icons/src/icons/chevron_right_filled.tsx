// icons/add.tsx
import { ChevronRightFilled as FluentIcon } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

export default function ChevronRightFilledIcon(props: IconProps) {
  return <FluentIcon {...toFluentProps(props)} />;
}
