import { SignOutFilled, SignOutRegular, bundleIcon } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

const SignOutIconBundle = bundleIcon(SignOutFilled, SignOutRegular);

export default function SignOutIcon(props: IconProps) {
  return <SignOutIconBundle {...toFluentProps(props)} />;
}
