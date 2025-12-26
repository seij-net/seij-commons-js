import { Meta, StoryObj } from "@storybook/react-vite";
import { LabelMoneyInt } from "./LabelMoneyInt";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
const meta = {
  title: "Components/money/LabelMoneyInt",
  component: LabelMoneyInt,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof LabelMoneyInt>;
export default meta;

type Story = StoryObj<typeof LabelMoneyInt>;

export const Valued: Story = {
  args: { value: 123 },
};
export const ValuedSpecificCurrency: Story = {
  args: { value: 123, currency: "RBL" },
};
export const Undefined: Story = {
  args: { value: undefined },
};
export const PerYearValued: Story = {
  args: { value: 12560, per: "year" },
};
export const PerYearUnvalued: Story = {
  args: { value: undefined, per: "year" },
};
export const PerYearValuedSign: Story = {
  args: { value: 1234, sign: "always" },
};
export const PerYearValuedSignNegativeAuto: Story = {
  args: { value: -1234, sign: "auto" },
};
export const PerYearValuedSignNegative: Story = {
  args: { value: -1234, sign: "always" },
};
export const PerYearZeroDisplay: Story = {
  args: { value: 0 },
};
export const PerYearZeroBlank: Story = {
  args: { value: 0, zeroblank: true },
};
