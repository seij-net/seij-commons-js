import { lazy, PropsWithChildren, Suspense } from "react";
import type { IconName } from "./iconNames";
import { iconLoaders } from "./iconLoaders";
import { IconProps } from "./IconProps";

const lazyIconCache: Partial<Record<IconName, ReturnType<typeof lazy>>> = {};

function getLazyIcon(name: IconName) {
  const cached = lazyIconCache[name];
  if (cached) {
    return cached;
  }
  const created = lazy(iconLoaders[name]);
  lazyIconCache[name] = created;
  return created;
}

export function Icon({ name, ...iconProps }: { name: IconName } & IconProps) {
  const LazyIcon = getLazyIcon(name);
  const { size = 20, ...restProps } = iconProps;
  return (
    <Suspense fallback={<Placeholder size={size} {...iconProps} />}>
      <LazyIcon size={size} {...restProps} />
    </Suspense>
  );
}

function Box({ size, children }: { size: number } & PropsWithChildren) {
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

function Placeholder({ size }: { size: number }) {
  return (
    <Box size={size}>
      <span style={{ width: "100%", height: "100%", opacity: 0 }} />
    </Box>
  );
}
