import { CalendarEmptyFilled, CalendarEmptyRegular, bundleIcon } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

const EmptyIconBundle = bundleIcon(CalendarEmptyFilled, CalendarEmptyRegular);

export default function EmptyIcon(props: IconProps) {
  return <EmptyIconBundle {...toFluentProps(props)} />;
}
