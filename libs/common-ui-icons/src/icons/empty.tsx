import { CalendarEmpty24Filled, CalendarEmpty24Regular, bundleIcon } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

const EmptyIconBundle = bundleIcon(CalendarEmpty24Filled, CalendarEmpty24Regular);

export default function EmptyIcon(props: IconProps) {
  return <EmptyIconBundle {...toFluentProps(props)} />;
}
