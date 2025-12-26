import { Meta, StoryObj } from "@storybook/react-vite";
import { LabelLocalDate } from "./LabelLocalDate";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
const meta = {
  title: "Components/localdate/LabelLocalDate",
  component: LabelLocalDate,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof LabelLocalDate>;
export default meta;
type Story = StoryObj<typeof LabelLocalDate>;
export const LocalDate: Story = {
  args: { value: "2025-12-25" },
};
export const Empty: Story = {
  args: { value: "" },
};
export const Undefined: Story = {
  args: { value: undefined },
};
export const Invalid: Story = {
  args: { value: "2025-88-99" },
};
