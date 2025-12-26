import { Meta, StoryObj } from "@storybook/react-vite";
import { LabelPercentInt } from "./LabelPercentInt";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
const meta = {
  title: "Components/percent/LabelPercentInt",
  component: LabelPercentInt,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof LabelPercentInt>;
export default meta;
type Story = StoryObj<typeof LabelPercentInt>;
export const Valued: Story = {
  args: {
    value: 0.123456,
  },
};
export const Zero: Story = {
  args: {
    value: 0.0,
  },
};
