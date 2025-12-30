import { BookContacts24Filled, BookContacts24Regular, bundleIcon } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

const CustomersIconBundle = bundleIcon(BookContacts24Filled, BookContacts24Regular);

export default function CustomersIcon(props: IconProps) {
  return <CustomersIconBundle {...toFluentProps(props)} />;
}
