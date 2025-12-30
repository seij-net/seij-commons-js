import { BuildingBank24Filled, BuildingBank24Regular, bundleIcon } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

const BuildingBankIconBundle = bundleIcon(BuildingBank24Filled, BuildingBank24Regular);

export default function BuildingBankIcon(props: IconProps) {
  return <BuildingBankIconBundle {...toFluentProps(props)} />;
}
