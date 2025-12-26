import { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import { InputMoneyInt, InputMoneyIntProps } from "./InputMoneyInt";
const meta = {
  title: "Components/money/InputMoneyInt",
  component: InputMoneyInt,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof InputMoneyInt>;
export default meta;
type Story = StoryObj<InputMoneyIntProps>;

export const Default: Story = {
  render: (args) => <Editor {...args} />,
};
export const Disabled: Story = {
  render: (args) => <Editor {...args} />,
  args: { disabled: true },
};

const Editor = (args: Omit<InputMoneyIntProps, "value" | "setValue">) => {
  const [value, setValue] = useState(1234);
  return <InputMoneyInt {...args} value={value} onValueChange={setValue} />;
};
