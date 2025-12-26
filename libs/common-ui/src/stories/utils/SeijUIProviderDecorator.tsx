import { SeijUIProvider } from "../../init/SeijUIProvider";

export function SeijUIProviderDecorator(Story: any) {
  return (
    <SeijUIProvider>
      <Story />
    </SeijUIProvider>
  );
}
