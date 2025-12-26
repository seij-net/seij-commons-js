import type { Meta, StoryObj } from "@storybook/react-vite";
import { SeijUIProviderDecorator } from "../../../stories/utils/SeijUIProviderDecorator";
import { StoryComponentFrame } from "../../../stories/utils/StoryComponentFrame";
import { Description } from "./Description";
const meta = {
  title: "Components/typography/Description",
  component: Description,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof Description>;
export default meta;
type Story = StoryObj<typeof Description>;

export const Standard: Story = {
  render: () => (
    <StoryComponentFrame title="Standard text">
      <Description value="This is <Description /> and it should be written smaller that other text" />
    </StoryComponentFrame>
  ),
};
export const NoDescription: Story = {
  render: () => (
    <StoryComponentFrame title="No description value and no empty space below">
      <Description value={null} />
    </StoryComponentFrame>
  ),
};
