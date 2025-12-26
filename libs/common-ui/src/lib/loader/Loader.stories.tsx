import { Meta, StoryObj } from "@storybook/react-vite";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import { StoryComponentFrame } from "../../stories/utils/StoryComponentFrame";
import { Loader } from "./Loader";

const meta = {
  title: "Components/Loader",
  component: Loader,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof Loader>;

export default meta;

type Story = StoryObj<typeof Loader>;

export const Loading: Story = {
  args: {
    loading: true,
  },
  render: (args) => (
    <StoryComponentFrame title="Loader (loading: true)">
      <Loader {...args} />
    </StoryComponentFrame>
  ),
};

export const NotLoading: Story = {
  args: {
    loading: false,
  },
  render: (args) => (
    <StoryComponentFrame title="Loader (loading: false)">
      <Loader {...args} />
    </StoryComponentFrame>
  ),
};
