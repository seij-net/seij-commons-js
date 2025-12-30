import { IconProps } from "./IconProps";
import { FluentIconsProps } from "@fluentui/react-icons";

export function toFluentProps(props: IconProps): FluentIconsProps {
  const { size = "24", ...restProps } = props;
  return { fontSize: size, ...restProps };
}
