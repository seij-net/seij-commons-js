import { tokens } from "@fluentui/react-components";
import type { PropsWithChildren } from "react";

export function DsViewFullHeightContainer({ children }: PropsWithChildren) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        maxWidth: "60rem",
        margin: "auto",
        width: "100%",
        boxSizing: "border-box",
        padding: tokens.spacingHorizontalM,
      }}
    >
      {children}
    </div>
  );
}
