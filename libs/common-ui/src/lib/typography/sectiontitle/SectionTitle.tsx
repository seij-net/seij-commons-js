import { ReactNode } from "react";

export function SectionTitle(props: { children: ReactNode | ReactNode[] }) {
  return <h4>{props.children}</h4>;
}
