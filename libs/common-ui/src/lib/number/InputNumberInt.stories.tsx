import { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import { InputNumberInt, InputNumberIntProps } from "./InputNumberInt";
const meta = {
  title: "Components/number/InputNumberInt",
  component: InputNumberInt,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof InputNumberInt>;
export default meta;
type Story = StoryObj<typeof InputNumberInt>;

export const Valued: Story = { render: () => <Form value={1234} /> };
export const Undefined: Story = { render: () => <Form value={undefined} /> };
export const UnitToto: Story = { render: () => <Form value={1234} unit="toto" /> };
export const UnitTotoUndefined: Story = { render: () => <Form value={undefined} unit="toto" /> };
export const AllowNegative: Story = { render: () => <Form value={-12345} unit="toto" allowNegative={true} /> };
export const Disabled: Story = {
  render: () => <Form value={-12345} disabled={true} unit="toto" allowNegative={true} />,
};

const Form = ({ value, ...otherProps }: InputNumberIntProps) => {
  const [currentValue, setCurrentValue] = useState(value);
  return (
    <div>
      <div>Current value: {currentValue} </div>
      <div>
        <InputNumberInt {...otherProps} value={currentValue} onValueChange={setCurrentValue} />
      </div>
    </div>
  );
};
