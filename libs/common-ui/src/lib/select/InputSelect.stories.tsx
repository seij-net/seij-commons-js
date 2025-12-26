import { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import { InputSelect, InputSelectOption, InputSelectProps } from "./InputSelect";
const meta = {
  title: "Components/select/InputSelect",
  component: InputSelect,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<InputSelectProps<any>>;
export default meta;
type Story = StoryObj<InputSelectProps<any>>;

const options = [
  {
    code: "jean",
    label: "Jean",
  },
  {
    code: "jeanne",
    label: "Jeanne",
  },
  {
    code: "therese",
    label: "Therese",
  },
];
export const Standard: Story = {
  render: (args) => <Form {...args} />,
  args: { options: options },
};
export const Disabled: Story = {
  render: (args) => <Form {...args} />,
  args: { options: options, disabled: true },
};

function Form<T extends InputSelectOption>({ value, onValueChange, ...otherProps }: InputSelectProps<T>) {
  const [currentValue, setCurrentValue] = useState(value);
  return (
    <div>
      <div>Current value: {currentValue} </div>
      <div>
        <InputSelect {...otherProps} value={currentValue} onValueChange={setCurrentValue} />
      </div>
    </div>
  );
}
