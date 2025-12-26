import { Meta, StoryObj } from "@storybook/react-vite";
import { SeijUIProviderDecorator } from "../../../stories/utils/SeijUIProviderDecorator";
import { SectionTitle } from "./SectionTitle";

const meta = {
  title: "Components/typography/SectionTitle",
  component: SectionTitle,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof SectionTitle>;
export default meta;

type Story = StoryObj<{ children: React.ReactNode }>;

export const Chained: Story = {
  render: () => (
    <div>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut laoreet cursus, enim erat dictum
        urna.
      </p>
      <SectionTitle>Section 1</SectionTitle>
      <p>
        Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor
        quam.
      </p>
      <SectionTitle>Section 2</SectionTitle>
      <p>Etiam porta sem malesuada magna mollis euismod. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
    </div>
  ),
};
