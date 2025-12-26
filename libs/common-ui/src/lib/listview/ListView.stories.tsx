import { ListView, ListItemData, ListViewProps } from "./ListView";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import { fn } from "storybook/test";

const meta = {
  title: "Composites/ListView",
  component: ListView,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof ListView>;
export default meta;

const sampleData: ListItemData[] = [
  {
    id: "1",
    label: "Item 1",
    description: "Description for item 1",
  },
  {
    id: "2",
    label: "Item 2",
    description: "Description for item 2",
  },
  {
    id: "3",
    label: "Item 3",
    description: "Description for item 3",
  },
];

export const Default: StoryObj<typeof ListView> = {
  render: (args) => <Rendered {...args} />,
  args: {
    navigate: fn(),
    activeId: "1",
    data: sampleData,
  },
};

export const Empty: StoryObj<typeof ListView> = {
  render: (args) => <Rendered {...args} />,
  args: {
    data: [],
    activeId: "",
    navigate: fn(),
  },
};

const Rendered = (args: ListViewProps) => {
  const [searchText, setSearchText] = useState("");
  const filtered = args.data.filter(
    (item) => item.label && item.label.toString().toLowerCase().includes(searchText.toLowerCase()),
  );
  return (
    <ListView
      {...args}
      data={filtered}
      searchText={searchText}
      search={setSearchText}
      pathFactory={(item) => `/item/${item.id}`}
    />
  );
};
