import { MessageBar, MessageBarBody } from "@fluentui/react-components";
import { ReactNode } from "react";

export function InfoBox({
  children,
  intent,
  className,
}: {
  children: ReactNode;
  intent: "info" | "warning" | "error" | "success";
  className?: string;
}) {
  return (
    <MessageBar intent={intent} className={className}>
      <MessageBarBody>{children}</MessageBarBody>
    </MessageBar>
  );
}
