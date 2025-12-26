import { Spinner } from "@fluentui/react-components";

export function Loader({ loading }: { loading: boolean }) {
  if (!loading) return null;
  return <Spinner />;
}
