import type { Meta, StoryObj } from "@storybook/react-vite";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import { ButtonBar } from "./ButtonBar";
import { Button } from "../button/Button";
import { fn } from "storybook/test";
const meta = {
  title: "Components/buttons/ButtonBar",
  component: ButtonBar,
  decorators: [
    SeijUIProviderDecorator,
    (Story) => (
      <div style={{ width: "60em" }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ButtonBar>;

export default meta;

type Story = StoryObj<typeof ButtonBar>;

export const Standard: Story = {
  args: {
    children: [
      <Button key="b1" disabled={false} onClick={fn()}>
        Button 1
      </Button>,
      <Button key="b2" disabled={true} onClick={fn()}>
        Button 2
      </Button>,
      <Button key="b3" disabled={true} onClick={fn()}>
        Button 2
      </Button>,
    ],
  },
};

export const TableBottomActions: Story = {
  args: {
    variant: "table_bottom_actions",
    children: [
      <Button key="b1" disabled={false} onClick={fn()}>
        Button 1
      </Button>,
      <Button key="b2" disabled={true} onClick={fn()}>
        Button 2
      </Button>,
      <Button key="b3" disabled={true} onClick={fn()}>
        Button 2
      </Button>,
    ],
  },
};
