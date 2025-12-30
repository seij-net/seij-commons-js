import { PersonStarburst24Filled, PersonStarburst24Regular, bundleIcon } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

const SignInIconBundle = bundleIcon(PersonStarburst24Filled, PersonStarburst24Regular);

export default function SignInIcon(props: IconProps) {
  return <SignInIconBundle {...toFluentProps(props)} />;
}
