import { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import { InputNumberDec, InputNumberDecProps } from "./InputNumberDec";
const meta = {
  title: "Components/number/InputNumberDec",
  component: InputNumberDec,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof InputNumberDec>;
export default meta;
type Story = StoryObj<typeof InputNumberDec>;

export const Valued: Story = { render: () => <Form value={1234.56} /> };
export const Undefined: Story = { render: () => <Form value={undefined} /> };
export const UnitToto: Story = { render: () => <Form value={1234.56} unit="toto" /> };
export const UnitTotoUndefined: Story = { render: () => <Form value={undefined} unit="toto" /> };
export const AllowNegative: Story = { render: () => <Form value={-12345.56} unit="toto" allowNegative={true} /> };
export const Disabled: Story = {
  render: () => <Form value={-12345.56} disabled={true} unit="toto" allowNegative={true} />,
};

const Form = ({ value, ...otherProps }: InputNumberDecProps) => {
  const [currentValue, setCurrentValue] = useState(value);
  return (
    <div>
      <div>Current value: {currentValue} </div>
      <div>
        <InputNumberDec {...otherProps} value={currentValue} onValueChange={setCurrentValue} />
      </div>
    </div>
  );
};
