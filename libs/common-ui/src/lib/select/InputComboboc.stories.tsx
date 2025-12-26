import { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import { InputCombobox, InputComboboxProps } from "./InputCombobox";
const meta = {
  title: "Components/select/InputCombobox",
  component: InputCombobox,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof InputCombobox>;
export default meta;
type Story = StoryObj<InputComboboxProps<unknown>>;

export const Default: Story = {
  render: (args) => <Editor {...args} />,
};
export const Disabled: Story = {
  render: (args) => <Editor {...args} />,
  args: { disabled: true },
};
export const CustomNoOptionsMessage: Story = {
  render: (args) => <Editor {...args} />,
  args: { noOptionsMessage: "👻 No result found 👻" },
};
export const Placeholder: Story = {
  render: (args) => <Editor {...args} />,
  args: { placeholder: "😼 select 😼" },
};

const options = [
  {
    id: "1",
    label: "Jean Dupond",
  },
  {
    id: "2",
    label: "Jean Durand",
  },
  {
    id: "3",
    label: "Stéphane Daïzarède",
  },
  {
    id: "4",
    label: "Thomas Tocolis",
  },
];

const Editor = (args: InputComboboxProps<unknown>) => {
  const [query, setQuery] = useState("");
  const [selection, setSelection] = useState("");
  const optionsOK = options.map((it) => ({ code: it.id, label: it.label }));
  return (
    <div>
      <div>
        Selected: id=<code>{selection}</code> label=<code>{options.find((it) => it.id === selection)?.label}</code>
      </div>
      <div>
        <InputCombobox
          {...args}
          searchQuery={query}
          onValueChange={setSelection}
          onValueChangeQuery={setQuery}
          options={optionsOK}
          placeholder={args.placeholder}
          disabled={args.disabled ?? false}
        />
      </div>
    </div>
  );
};
