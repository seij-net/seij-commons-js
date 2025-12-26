import { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import { InputLocalDate, InputLocalDateProps } from "./InputLocalDate";
const meta = {
  title: "Components/localdate/InputLocalDate",
  component: InputLocalDate,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof InputLocalDate>;
export default meta;
type Story = StoryObj<InputLocalDateProps>;

export const Default: Story = {
  render: (args) => <Editor {...args} />,
};
export const Disabled: Story = {
  render: (args) => <Editor {...args} />,
  args: { disabled: true },
};

const Editor = (args: Omit<InputLocalDateProps, "value" | "setValue">) => {
  const [value, setValue] = useState("1976-03-20");
  return (
    <div>
      <div>Value: {value}</div>
      <div>
        <InputLocalDate {...args} value={value} onValueChange={setValue} />
      </div>
    </div>
  );
};
