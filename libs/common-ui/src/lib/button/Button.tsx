import { Button as FluentButton, ButtonProps } from "@fluentui/react-components";
import { PropsWithChildren } from "react";

export function Button({
  children,
  variant,
  disabled = false,
  onClick,
}: {
  /**
   * Primary for main action buttons (OK, Next, etc.), "secondary" for Cancel, Back and secondary actions
   */
  variant?: "primary" | "secondary";
  /**
   * When it should be disabled, set it to true. If not specified or false, will not be disabled
   */
  disabled?: boolean;
  /**
   * When button is clicked
   */
  onClick: () => void;
} & PropsWithChildren) {
  let mantineVariant: ButtonProps["appearance"] | undefined = undefined;
  if (variant === "secondary") mantineVariant = "secondary";
  else if (variant === "primary") mantineVariant = "primary";
  else mantineVariant = "primary";
  return (
    <FluentButton appearance={mantineVariant} disabled={disabled} onClick={onClick}>
      {children}
    </FluentButton>
  );
}
