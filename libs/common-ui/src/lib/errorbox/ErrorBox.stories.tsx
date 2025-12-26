import { Problem, toProblem } from "@seij/common-types";
import { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import { ErrorBox } from "./ErrorBox";

const meta = {
  title: "Components/ErrorBox",
  component: ErrorBox,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof ErrorBox>;

export default meta;

type Story = StoryObj<typeof ErrorBox>;

export const ErrorProblem: Story = {
  args: {
    error: toProblem("my error"),
  },
};
export const ErrorProblemWithDetails: Story = {
  args: {
    error: new Problem({ type: "TS0111", title: "my error", detail: "this is the detail" }),
  },
};
export const Closable: Story = {
  args: {
    error: new Problem({ type: "TS0111", title: "my error", detail: "this is the detail" }),
    onClose: fn(),
  },
};
export const ErrorUndefined: Story = {
  args: {
    error: null,
  },
};
export const ErrorNull: Story = {
  args: {
    error: null,
  },
};
export const UnknownError: Story = {
  args: {
    error: new Problem({
      title: undefined as unknown as string,
      type: "TS001",
    }),
  },
};
