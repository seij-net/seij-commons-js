import { IconProps } from "./IconProps";
import { FluentIconsProps } from "@fluentui/react-icons";

export function toFluentProps(props: IconProps): FluentIconsProps {
  const { size, ...restProps } = props;
  return { fontSize: size, ...restProps };
}
