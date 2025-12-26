import { Meta, StoryObj } from "@storybook/react-vite";
import { InlineEdit } from "./InlineEdit";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import { InputText } from "../text/InputText";
import { useState } from "react";
const meta = {
  title: "Components/InlineEdit",
  component: InlineEdit,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof InlineEdit>;
export default meta;
type Story = StoryObj<typeof InlineEdit>;

export const Default: Story = {
  render: () => <Editor />,
};

const Editor = () => {
  const [value, setValue] = useState<string>("Mega Corp");
  const [tmpValue, setTmpValue] = useState<string>("Mega Corp");
  return (
    <InlineEdit
      editor={<InputText value={tmpValue} onValueChange={setTmpValue} />}
      onEditCancel={async () => true}
      onEditOK={async () => setValue(tmpValue)}
      onEditStart={async () => setTmpValue(value)}
    >
      {value}
    </InlineEdit>
  );
};
