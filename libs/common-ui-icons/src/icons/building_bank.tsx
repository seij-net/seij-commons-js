import { BuildingBankFilled, BuildingBankRegular, bundleIcon } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

const BuildingBankIconBundle = bundleIcon(BuildingBankFilled, BuildingBankRegular);

export default function BuildingBankIcon(props: IconProps) {
  return <BuildingBankIconBundle {...toFluentProps(props)} />;
}
