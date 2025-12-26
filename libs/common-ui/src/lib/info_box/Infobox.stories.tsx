import { Meta, StoryObj } from "@storybook/react-vite";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import { InfoBox } from "./InfoBox";

const meta = {
  title: "Components/InfoBox",
  component: InfoBox,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof InfoBox>;

export default meta;

type Story = StoryObj<typeof InfoBox>;

export const Error: Story = {
  args: {
    intent: "error",
    children: "Error",
  },
};
export const Warning: Story = {
  args: {
    intent: "warning",
    children: "Warning",
  },
};
export const Success: Story = {
  args: {
    intent: "success",
    children: "Success",
  },
};
export const Info: Story = {
  args: {
    intent: "info",
    children: "Info",
  },
};
