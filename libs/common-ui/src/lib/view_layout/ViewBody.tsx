import { ReactNode } from "react";

/**
 * Corps principal d'une vue, à mettre uniquement dans ViewLayout
 */
export function ViewBody({ children }: { children: ReactNode | ReactNode[] }) {
  return <div>{children}</div>;
}
