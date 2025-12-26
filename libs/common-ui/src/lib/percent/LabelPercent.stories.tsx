import { Meta, StoryObj } from "@storybook/react-vite";
import { LabelPercent } from "./LabelPercent";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
const meta = {
  title: "Components/percent/LabelPercent",
  component: LabelPercent,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof LabelPercent>;
export default meta;
type Story = StoryObj<typeof LabelPercent>;
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
