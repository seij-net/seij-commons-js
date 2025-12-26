import { ReactNode } from "react";

/**
 * Footer d'une vue, à utiliser uniquement dans ViewLayout
 * @param param0
 * @returns
 */
export function ViewFooter({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
