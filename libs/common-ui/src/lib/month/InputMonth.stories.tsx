import { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import { InputMonth, InputMonthProps } from "./InputMonth";
const meta = {
  title: "Components/month/InputMonth",
  component: InputMonth,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof InputMonth>;
export default meta;
type Story = StoryObj<InputMonthProps>;

export const Default: Story = {
  render: (args) => <Editor {...args} />,
};
export const Disabled: Story = {
  render: (args) => <Editor {...args} />,
  args: { disabled: true },
};

const Editor = (args: Omit<InputMonthProps, "value" | "setValue">) => {
  const [value, setValue] = useState(5);
  return <InputMonth {...args} value={value} onValueChange={setValue} />;
};
