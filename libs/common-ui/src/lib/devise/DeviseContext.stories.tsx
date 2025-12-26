import { Meta, StoryObj } from "@storybook/react-vite";
import { useContext } from "react";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import { DeviseContext } from "./DeviseContext";

const meta = {
  title: "Utils/DeviseContext",
  decorators: [SeijUIProviderDecorator],
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Exemple: Story = {
  render: () => <Page />,
};

const Page = () => {
  const devise = useContext(DeviseContext);
  return <div>{devise}</div>;
};
