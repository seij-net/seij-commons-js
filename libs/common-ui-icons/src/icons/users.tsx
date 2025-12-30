import { PeopleFilled, PeopleRegular, bundleIcon } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

const UsersIconBundle = bundleIcon(PeopleFilled, PeopleRegular);

export default function UsersIcon(props: IconProps) {
  return <UsersIconBundle {...toFluentProps(props)} />;
}
