import { PanelLeftExpandRegular, PanelLeftExpandFilled, bundleIcon } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

const PanelLeftExpandIconBundle = bundleIcon(PanelLeftExpandFilled, PanelLeftExpandRegular);

export default function PanelLeftExpandIcon(props: IconProps) {
  return <PanelLeftExpandIconBundle {...toFluentProps(props)} />;
}
