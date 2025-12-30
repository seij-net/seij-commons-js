import { BookContactsFilled, BookContactsRegular, bundleIcon } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

const CustomersIconBundle = bundleIcon(BookContactsFilled, BookContactsRegular);

export default function CustomersIcon(props: IconProps) {
  return <CustomersIconBundle {...toFluentProps(props)} />;
}
