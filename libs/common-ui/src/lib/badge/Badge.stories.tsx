import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
const meta = {
  title: "Components/Badge",
  component: Badge,
  decorators: [SeijUIProviderDecorator],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof Badge>;

export const Gray: Story = {
  args: {
    color: "gray",
    children: <div>Content of the badge</div>,
  },
};
export const Yellow: Story = {
  args: {
    color: "yellow",
    children: <div>Content of the badge</div>,
  },
};
