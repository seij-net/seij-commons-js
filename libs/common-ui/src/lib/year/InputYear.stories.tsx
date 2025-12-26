import { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import { InputYear, InputYearProps } from "./InputYear";
const meta = {
  title: "Components/year/InputYear",
  component: InputYear,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof InputYear>;
export default meta;
type Story = StoryObj<InputYearProps>;

export const Default: Story = {
  render: (args) => <Editor {...args} />,
};
export const Disabled: Story = {
  render: (args) => <Editor {...args} />,
  args: { disabled: true },
};

const Editor = (args: Omit<InputYearProps, "value" | "setValue">) => {
  const [value, setValue] = useState(5);
  return <InputYear {...args} value={value} onValueChange={setValue} />;
};
