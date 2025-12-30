import { BoardFilled, BoardRegular, bundleIcon } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

const DashboardIconBundle = bundleIcon(BoardFilled, BoardRegular);

export default function DashboardIcon(props: IconProps) {
  return <DashboardIconBundle {...toFluentProps(props)} />;
}
