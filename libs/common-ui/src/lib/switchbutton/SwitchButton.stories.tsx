import { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import { SwitchButton } from "./SwitchButton";

const meta = {
  title: "Components/SwitchButton",
  component: SwitchButton,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof SwitchButton>;
export default meta;

type Story = StoryObj<typeof SwitchButton>;

export const Default: Story = {
  render: (args) => <DemoSwitchButton {...args} />,
  args: {
    value: false,
    label: "Enable feature",
    labelTrue: "Feature enabled",
    labelFalse: "Feature disabled",
  },
};

export const Checked: Story = {
  render: (args) => <DemoSwitchButton {...args} />,
  args: {
    value: true,
    label: "Enable feature",
    labelTrue: "Feature enabled",
    labelFalse: "Feature disabled",
  },
};

export const Disabled: Story = {
  render: (args) => <DemoSwitchButton {...args} />,
  args: {
    value: false,
    label: "Disabled switch",
    disabled: true,
  },
};

export const NoTrueFalseLabels: Story = {
  render: (args) => <DemoSwitchButton {...args} />,
  args: {
    value: false,
    label: "Switch without true/false labels",
  },
};
export const NoLabels: Story = {
  render: (args) => <DemoSwitchButton {...args} />,
  args: {
    value: false,
  },
};
function DemoSwitchButton(props: Omit<React.ComponentProps<typeof SwitchButton>, "onValueChange">) {
  const [value, setValue] = useState(props.value ?? false);
  return (
    <div>
      <div>
        Current value: <b>{value ? "ON" : "OFF"}</b>
      </div>
      <SwitchButton {...props} value={value} onValueChange={setValue} />
    </div>
  );
}
