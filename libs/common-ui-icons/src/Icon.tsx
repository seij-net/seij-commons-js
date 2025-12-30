import { lazy, Suspense } from "react";
import type { IconName } from "./iconNames";
import { iconLoaders } from "./iconLoaders";
import { IconProps } from "./IconProps";

export function Icon({ name, ...iconProps }: { name: IconName; } & IconProps) {
  const LazyIcon = lazy(iconLoaders[name]);
  return (
    <Suspense fallback={<Placeholder {...iconProps} />}>
      <LazyIcon {...iconProps} />
    </Suspense>
  );
}

function Box({ size = 24, children }: { size?: number; children?: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 0,
        flex: "0 0 auto",
      }}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

function Placeholder({ size }: { size?: number }) {
  return (
    <Box size={size}>
      <span style={{ width: "100%", height: "100%", opacity: 0 }} />
    </Box>
  );
}
