import { Problem, toProblem } from "@seij/common-types";
import { Meta, StoryObj } from "@storybook/react-vite";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import { useErrorNotifier } from "./ErrorNotifier";

const meta = {
  title: "Utils/ErrorNotifier",
  decorators: [SeijUIProviderDecorator],
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Exemple: Story = {
  render: () => <Page />,
};

const Page = () => {
  const { errorNotifier } = useErrorNotifier();
  return (
    <div>
      <button onClick={() => errorNotifier(toProblem("Error 1"))}>Error single message</button>
      <button
        onClick={() => errorNotifier(new Problem({ type: "TS0123", title: "Error 2", detail: "Details of error" }))}
      >
        Error with detail
      </button>
    </div>
  );
};
