import { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import { Tabs, TabsList, TabsPanel, TabsTab } from "./Tabs";

const meta = {
  title: "Composites/Tabs",
  component: Tabs,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof Tabs>;
export default meta;

type Story = StoryObj<typeof DemoTabs>;

export const Default: Story = {
  render: (args) => <DemoTabs {...args} />,
  args: {
    value: "tab1",
  },
};

export const WithThreeTabs: Story = {
  render: (args) => <DemoTabs {...args} />,
  args: {
    value: "tab2",
    tabs: [
      { value: "tab1", label: "Tab 1" },
      { value: "tab2", label: "Tab 2" },
      { value: "tab3", label: "Tab 3" },
    ],
  },
};

function DemoTabs(props: { value?: string; tabs?: { value: string; label: string }[] }) {
  const tabs = props.tabs ?? [
    { value: "tab1", label: "Tab 1" },
    { value: "tab2", label: "Tab 2" },
  ];
  const [currentTab, setCurrentTab] = useState(props.value ?? tabs[0].value);

  return (
    <Tabs value={currentTab} onChange={(t) => setCurrentTab(t ?? "tab1")}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTab key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTab>
        ))}
      </TabsList>
      <div style={{ marginTop: "2em" }}>
        <b>Current tab:</b> {currentTab}
      </div>
      <TabsPanel value="tab1">Panel for tab 1</TabsPanel>
      <TabsPanel value="tab2">Panel for tab 2</TabsPanel>
      <TabsPanel value="tab3">Panel for tab 3</TabsPanel>
    </Tabs>
  );
}
