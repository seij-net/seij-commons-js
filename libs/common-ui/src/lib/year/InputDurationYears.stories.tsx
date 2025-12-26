import { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import { InputDurationYears } from "./InputDurationYears";
const meta = {
  title: "Components/year/InputDurationYears",
  component: InputDurationYears,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof InputDurationYears>;
export default meta;
type Story = StoryObj<typeof InputDurationYears>;

export const Default: Story = {
  render: (args) => <Editor {...args} />,
};
export const Disabled: Story = {
  render: (args) => <Editor {...args} />,
  args: { disabled: true },
};

const Editor = (args: Omit<typeof InputDurationYears, "value" | "setValue">) => {
  const [value, setValue] = useState(10);
  return <InputDurationYears {...args} value={value} onValueChange={setValue} />;
};
