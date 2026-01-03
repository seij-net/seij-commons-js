import { PanelLeftContractRegular, PanelLeftContractFilled, bundleIcon } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

const PanelLeftReduceIconBundle = bundleIcon(PanelLeftContractFilled, PanelLeftContractRegular);

export default function PanelLeftReduceIcon(props: IconProps) {
  return <PanelLeftReduceIconBundle {...toFluentProps(props)} />;
}
