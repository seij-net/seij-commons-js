import { MessageBar } from "@fluentui/react-components";
import { ReactNode } from "react";

export const Todo = ({ children }: { children?: ReactNode | undefined }) => {
  return <MessageBar intent="warning">{children}</MessageBar>;
};
