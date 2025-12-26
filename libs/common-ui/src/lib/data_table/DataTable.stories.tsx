import type { Meta, StoryObj } from "@storybook/react-vite";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import {
  DataTable,
  DataTableBody,
  DataTableCaption,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
} from "./DataTable";
const meta = {
  title: "Components/DataTable",
  component: DataTable,
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
} satisfies Meta<typeof DataTable>;

export default meta;

type Story = StoryObj<typeof DataTable>;

export const Standard: Story = {
  args: {
    children: [
      <DataTableHead key="1">
        <DataTableRow>
          <DataTableHeaderCell>Simple text</DataTableHeaderCell>
          <DataTableHeaderCell variant="date">Date</DataTableHeaderCell>
          <DataTableHeaderCell variant="number">Unit Price</DataTableHeaderCell>
        </DataTableRow>
      </DataTableHead>,
      <DataTableBody key="2">
        <DataTableRow>
          <DataTableCell>Label 1</DataTableCell>
          <DataTableCell variant="date">01/01/2001</DataTableCell>
          <DataTableCell variant="number">111</DataTableCell>
        </DataTableRow>
        <DataTableRow>
          <DataTableCell>Label 2</DataTableCell>
          <DataTableCell variant="date">01/01/2002</DataTableCell>
          <DataTableCell variant="number">222</DataTableCell>
        </DataTableRow>
        <DataTableRow>
          <DataTableCell>Label 3</DataTableCell>
          <DataTableCell variant="date">01/01/2003</DataTableCell>
          <DataTableCell variant="number">333</DataTableCell>
        </DataTableRow>
      </DataTableBody>,
      <DataTableCaption key="3">Caption text under the table</DataTableCaption>,
    ],
  },
};
export const CustomWidths: Story = {
  render: (args) => {
    return (
      <>
        <DataTable>
          <DataTableHead key="1">
            <DataTableRow>
              <DataTableHeaderCell className={"column_label"}>Simple text red</DataTableHeaderCell>
              <DataTableHeaderCell className={"column_date"} variant="date">
                Date
              </DataTableHeaderCell>
              <DataTableHeaderCell className={"column_price"} variant="number">
                Unit Price
              </DataTableHeaderCell>
            </DataTableRow>
          </DataTableHead>
          <DataTableBody key="2">
            <DataTableRow>
              <DataTableCell>Label 1</DataTableCell>
              <DataTableCell variant="date">01/01/2001</DataTableCell>
              <DataTableCell variant="number">111</DataTableCell>
            </DataTableRow>
            <DataTableRow>
              <DataTableCell>Label 2</DataTableCell>
              <DataTableCell variant="date">01/01/2002</DataTableCell>
              <DataTableCell className={"cell_important"} variant="number">
                yellow 222
              </DataTableCell>
            </DataTableRow>
            <DataTableRow>
              <DataTableCell>Label 3</DataTableCell>
              <DataTableCell variant="date">01/01/2003</DataTableCell>
              <DataTableCell variant="number">333</DataTableCell>
            </DataTableRow>
          </DataTableBody>
          <DataTableCaption key="3" className="table_caption">
            Caption text under the table in blue
          </DataTableCaption>
        </DataTable>
      </>
    );
  },
};
