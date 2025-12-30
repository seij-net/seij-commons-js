import { SignOut24Filled, SignOut24Regular, bundleIcon } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

const SignOutIconBundle = bundleIcon(SignOut24Filled, SignOut24Regular);

export default function SignOutIcon(props: IconProps) {
  return <SignOutIconBundle {...toFluentProps(props)} />;
}
