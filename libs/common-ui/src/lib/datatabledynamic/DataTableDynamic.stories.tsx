import type { Meta, StoryObj } from "@storybook/react-vite";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import { DataTableDynamic, DataTableDynamicColumn } from "./DataTableDynamic";
import { fn } from "storybook/test";
const meta = {
  title: "Components/DataTableDynamic",
  component: DataTableDynamic,
  decorators: [
    SeijUIProviderDecorator,
    (Story) => {
      const style = document.createElement("style");
      style.textContent = `
    .column_label { color:red !important; }
    .column_date { width:5em; }
    .column_price { width:5em; }
    .cell_important { background-color: yellow;}
    .table_caption { color: blue; font-style: italic; text-align: center;}
    `;
      document.head.appendChild(style);
      return (
        <>
          <Story />
        </>
      );
    },
  ],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof DataTableDynamic>;

export default meta;

type Story = StoryObj<typeof DataTableDynamic>;

export const CustomWidths: Story = {
  render: (args) => {
    const columns: DataTableDynamicColumn<MyData>[] = [
      {
        code: "id",
        label: "Identifier",
        render: (it) => it.id,
      },
      {
        code: "label",
        label: "Label",
        style: { width: "10em" },
        render: (it) => it.label,
      },
      {
        code: "price",
        label: "Price",
        style: { width: "10em", textAlign: "right" },
        render: (it) => it.price,
      },
    ];
    const data: MyData[] = [
      {
        id: "1",
        label: "Numéro 1",
        price: 1111,
      },
      {
        id: "2",
        label: "Numéro 2",
        price: 2222,
      },
    ];
    return <DataTableDynamic columns={columns} data={data} onClickRow={fn()} />;
  },
};

interface MyData {
  id: string;
  price: number;
  label: string;
}
