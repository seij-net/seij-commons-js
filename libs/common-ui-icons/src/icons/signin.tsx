import { PersonStarburstFilled, PersonStarburstRegular, bundleIcon } from "@fluentui/react-icons";
import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

const SignInIconBundle = bundleIcon(PersonStarburstFilled, PersonStarburstRegular);

export default function SignInIcon(props: IconProps) {
  return <SignInIconBundle {...toFluentProps(props)} />;
}
