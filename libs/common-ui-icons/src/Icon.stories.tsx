import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "./Icon";
import { iconPreload } from "./iconPreload";

iconPreload(["add", "delete", "search" , "user", "dismiss"])

const meta = {
  title: "Icons",
  component: Icon,
  decorators: [
    (Story, context) => {
      return (
        <div>
          <div>{context.args.name}</div>
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof Icon>;

export const Add: Story = {
  args: {
    name: "add",
  },
};
export const Delete: Story = {
  args: {
    name: "delete",
  },
};

export const Search: Story = {
  args: {
    name: "search",
  },
};
export const User: Story = {
  args: {
    name: "user",
  },
};
export const Dismiss: Story = {
  args: {
    name: "dismiss",
  },
};

export const Edit: Story = {
  args: {
    name: "edit"
  }
}
