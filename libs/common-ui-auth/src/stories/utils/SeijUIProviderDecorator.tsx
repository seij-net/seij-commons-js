import { SeijUIProvider } from "@seij/common-ui";
import { Decorator } from "@storybook/react-vite";

export const SeijUIProviderDecorator: Decorator = (Story) => {
  return (
    <SeijUIProvider>
      <Story />
    </SeijUIProvider>
  );
};
