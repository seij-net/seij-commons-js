// icons/add.tsx
import { Board24Filled, Board24Regular, bundleIcon } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

const DashboardIconBundle = bundleIcon(Board24Filled, Board24Regular);

export default function DashboardIcon(props: IconProps) {
  return <DashboardIconBundle {...toFluentProps(props)} />;
}
