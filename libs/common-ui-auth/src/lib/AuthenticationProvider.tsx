import { PropsWithChildren } from "react";
import { AuthProvider } from "react-oidc-context";
import { AuthenticationConfig } from "./authentication";

export const AuthenticationProvider = ({ children, ...props }: AuthenticationConfig & PropsWithChildren) => {
  return <AuthProvider {...props}>{children}</AuthProvider>;
};
