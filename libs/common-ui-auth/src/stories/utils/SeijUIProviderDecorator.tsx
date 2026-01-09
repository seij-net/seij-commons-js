import { SeijUIProvider } from "@seij/common-ui";
import { StoryFn } from "@storybook/react-vite";

export function SeijUIProviderDecorator(Story: StoryFn) {
  return (
    <SeijUIProvider>
      <Story />
    </SeijUIProvider>
  );
}
