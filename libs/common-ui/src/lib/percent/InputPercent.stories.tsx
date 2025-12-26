import { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import { InputPercent, InputPercentProps } from "./InputPercent";
const meta = {
  title: "Components/percent/InputPercent",
  component: InputPercent,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof InputPercent>;
export default meta;
type Story = StoryObj<InputPercentProps>;

export const Default: Story = {
  render: (args) => <Editor {...args} />,
};
export const Disabled: Story = {
  render: (args) => <Editor {...args} />,
  args: { disabled: true },
};

const Editor = (args: Omit<InputPercentProps, "value" | "setValue">) => {
  const [value, setValue] = useState(0.1223);
  return <InputPercent {...args} value={value} onValueChange={setValue} />;
};
