import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";
import { fn } from "storybook/test";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
const meta = {
  title: "Components/buttons/Button",
  component: Button,
  decorators: [SeijUIProviderDecorator],
  parameters: {
    layout: "centered",
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    disabled: false,
    variant: "primary",
    children: "Button",
  },
};

export const Secondary: Story = {
  args: {
    disabled: false,
    variant: "secondary",
    children: "Button",
  },
};

export const DisabledPrimary: Story = {
  args: {
    disabled: true,
    variant: "primary",
    children: "Button",
  },
};

export const DisabledSecondary: Story = {
  args: {
    disabled: true,
    variant: "secondary",
    children: "Button",
  },
};

export const LabelAsComponent: Story = {
  args: {
    disabled: false,
    variant: "primary",
    children: (
      <div>
        <div>Button</div>
        <div>in two lines</div>
      </div>
    ),
  },
};
