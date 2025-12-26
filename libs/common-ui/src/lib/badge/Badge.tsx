import { Badge as FluentBadge, BadgeProps } from "@fluentui/react-components";
import { PropsWithChildren } from "react";

export function Badge({ color, children }: { color: "yellow" | "gray" } & PropsWithChildren) {
  const finalColor: BadgeProps["color"] = color === "yellow" ? "warning" : color === "gray" ? "informative" : "brand";
  return <FluentBadge color={finalColor}>{children}</FluentBadge>;
}
