import { Meta, StoryObj } from "@storybook/react-vite";
import { LabelMoneyDec } from "./LabelMoneyDec";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
const meta = {
  title: "Components/money/LabelMoneyDec",
  component: LabelMoneyDec,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof LabelMoneyDec>;
export default meta;

type Story = StoryObj<typeof LabelMoneyDec>;

export const Valued: Story = {
  args: { value: 123.45 },
};
export const ValuedSpecificCurrency: Story = {
  args: { value: 123.45, currency: "RBL" },
};
export const Undefined: Story = {
  args: { value: undefined },
};

export const PerYearValued: Story = {
  args: { value: 12560.56, per: "year" },
};
export const PerYearUnvalued: Story = {
  args: { value: undefined, per: "year" },
};
export const PerYearValuedSign: Story = {
  args: { value: 1234.56, sign: "always" },
};
export const PerYearValuedSignNegativeAuto: Story = {
  args: { value: -1234.56, sign: "auto" },
};
export const PerYearValuedSignNegative: Story = {
  args: { value: -1234.56, sign: "always" },
};
export const PerYearZeroDisplay: Story = {
  args: { value: 0 },
};
export const PerYearZeroBlank: Story = {
  args: { value: 0, zeroblank: true },
};
