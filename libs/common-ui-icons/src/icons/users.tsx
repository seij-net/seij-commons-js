import { People24Filled, People24Regular, bundleIcon } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

const UsersIconBundle = bundleIcon(People24Filled, People24Regular);

export default function UsersIcon(props: IconProps) {
  return <UsersIconBundle {...toFluentProps(props)} />;
}
