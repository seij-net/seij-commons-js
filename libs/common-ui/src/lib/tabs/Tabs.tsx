import { Tab, TabList as TabListFluent } from "@fluentui/react-components";
import React, { ReactNode, useContext } from "react";

const TabsContext = React.createContext<{ currentTab: string | null; onChange: (value: string | null) => void }>({
  currentTab: null,
  onChange: () => {
    // Volontairement vide
  },
});

export const Tabs = ({
  value,
  children,
  onChange,
}: {
  value: string | null;
  children: ReactNode | ReactNode[];
  onChange: (value: string | null) => void;
}) => {
  return (
    <div>
      <TabsContext.Provider value={{ currentTab: value, onChange: onChange }}>{children}</TabsContext.Provider>
    </div>
  );
};

export const TabsList = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const currentTab = useContext(TabsContext);
  return (
    <TabListFluent
      selectedValue={currentTab.currentTab}
      onTabSelect={(e, data) => currentTab.onChange(data.value as string | null)}
      vertical={false}
    >
      {children}
    </TabListFluent>
  );
};

export const TabsTab = ({ value, children }: { value: string; children: ReactNode | ReactNode[] }) => {
  return <Tab value={value}>{children}</Tab>;
};

export const TabsPanel = ({ value, children }: { value: string; children: ReactNode | ReactNode[] }) => {
  const currentTab = useContext(TabsContext);
  if (currentTab.currentTab !== value) return null;
  return <div>{children}</div>;
};
