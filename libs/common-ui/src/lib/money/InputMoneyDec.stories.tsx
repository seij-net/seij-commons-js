import { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import { InputMoneyDec, InputMoneyDecProps } from "./InputMoneyDec";
const meta = {
  title: "Components/money/InputMoneyDec",
  component: InputMoneyDec,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof InputMoneyDec>;
export default meta;
type Story = StoryObj<InputMoneyDecProps>;

export const Default: Story = {
  render: (args) => <Editor {...args} />,
};
export const Disabled: Story = {
  render: (args) => <Editor {...args} />,
  args: { disabled: true },
};

const Editor = (args: Omit<InputMoneyDecProps, "value" | "setValue">) => {
  const [value, setValue] = useState(1234.56);
  return <InputMoneyDec {...args} value={value} onValueChange={setValue} />;
};
