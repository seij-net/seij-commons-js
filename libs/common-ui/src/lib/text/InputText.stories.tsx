import { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import { InputText, InputTextProps } from "./InputText";

const meta = {
  title: "Components/text/InputText",
  component: InputText,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<InputTextProps>;
export default meta;
type Story = StoryObj<InputTextProps>;

export const Standard: Story = {
  render: (args) => <Form {...args} />,
  args: { value: "Hello everybody" },
};
export const Disabled: Story = {
  render: (args) => <Form {...args} />,
  args: { value: "Hello everybody", disabled: true },
};
export const Empty: Story = {
  render: (args) => <Form {...args} />,
  args: { value: "" },
};
export const Undefined: Story = {
  render: (args) => <Form {...args} />,
  args: { value: "" },
};
function Form({ value, onValueChange, ...otherProps }: InputTextProps) {
  const [currentValue, setCurrentValue] = useState(value);
  return (
    <div>
      <div>Current value: {currentValue} </div>
      <div>
        <InputText {...otherProps} value={currentValue} onValueChange={setCurrentValue} />
      </div>
    </div>
  );
}
