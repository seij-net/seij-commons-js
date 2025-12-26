import { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import { InputDurationMonths } from "./InputDurationMonths";
const meta = {
  title: "Components/month/InputDurationMonths",
  component: InputDurationMonths,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof InputDurationMonths>;
export default meta;
type Story = StoryObj<typeof InputDurationMonths>;

export const Default: Story = {
  render: (args) => <Editor {...args} />,
};
export const Disabled: Story = {
  render: (args) => <Editor {...args} />,
  args: { disabled: true },
};

const Editor = (args: Omit<typeof InputDurationMonths, "value" | "setValue">) => {
  const [value, setValue] = useState(10);
  return <InputDurationMonths {...args} value={value} onValueChange={setValue} />;
};
