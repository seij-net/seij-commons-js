import type { Meta, StoryObj } from "@storybook/react-vite";
import { LabelAndDescription } from "./LabelAndDescription";
import { SeijUIProviderDecorator } from "../../../stories/utils/SeijUIProviderDecorator";
import { StoryComponentFrame } from "../../../stories/utils/StoryComponentFrame";
const meta = {
  title: "Components/typography/LabelAndDescription",
  component: LabelAndDescription,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof LabelAndDescription>;
export default meta;
type Story = StoryObj<typeof LabelAndDescription>;

export const Standard: Story = {
  render: () => (
    <StoryComponentFrame title="Standard text and description">
      <LabelAndDescription
        label="This is <LabelAndDescription />"
        description="and description should be written smaller that other text"
      />
    </StoryComponentFrame>
  ),
};
export const NoDescription: Story = {
  render: () => (
    <StoryComponentFrame title="No description value and no empty space below">
      <LabelAndDescription label={"Label is not empty"} description={null} />
    </StoryComponentFrame>
  ),
};

export const NoLabelNoDescription: Story = {
  render: () => (
    <StoryComponentFrame title="No label and no description value and no empty space below">
      <LabelAndDescription label={null} description={null} />
    </StoryComponentFrame>
  ),
};
