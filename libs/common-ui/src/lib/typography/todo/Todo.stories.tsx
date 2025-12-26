import { Meta, StoryObj } from "@storybook/react-vite";
import { SeijUIProviderDecorator } from "../../../stories/utils/SeijUIProviderDecorator";
import { Todo } from "./Todo";

const meta = {
  title: "Components/typography/Todo",
  component: Todo,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof Todo>;
export default meta;

type Story = StoryObj<typeof Todo>;

export const Default: Story = {
  args: {
    children: "This feature is not yet implemented.",
  },
};

export const CustomMessage: Story = {
  args: {
    children: "🚧 Work in progress! 🚧",
  },
};
