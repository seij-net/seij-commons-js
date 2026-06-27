import { Meta, StoryObj } from "@storybook/react-vite";
import { SeijUIProvider } from "@seij/common-ui";
import { Caption1, makeStyles, tokens } from "@fluentui/react-components";
import { DsViewSummary } from "./DsViewSummary";
import {
  Task,
  STATUS_OPTIONS,
  CATEGORIES,
  useFetchTasks,
  emptySource,
  loadingSource,
  errorSource,
} from "./DsViewSummary.stories.repo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createLocalStorageQueryStorage } from "./DsQueryStorage";

// ---------------------------------------------------------------------------
// QueryClient
// ---------------------------------------------------------------------------

const queryClient = new QueryClient();

function WithQueryClient({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

// ---------------------------------------------------------------------------
// UI
// ---------------------------------------------------------------------------

function useCategoryOptions({ search, selectedValues }: { search: string; limit: number; selectedValues: string[] }) {
  const filtered = CATEGORIES.filter((c) => c.label.toLowerCase().includes(search.toLowerCase()));
  return {
    options: filtered,
    selectedLabels: CATEGORIES.filter((c) => selectedValues.includes(c.value)),
    isPending: false,
  };
}

const useSlotStyles = makeStyles({
  meta: { color: tokens.colorNeutralForeground3 },
});

function TaskSummaryCell({ item }: { item: Task }) {
  const styles = useSlotStyles();
  return (
    <>
      <div>{item.title}</div>
      {item.categoryLabel && <Caption1 className={styles.meta}>{item.categoryLabel}</Caption1>}
    </>
  );
}

function TaskMetaCell({ item }: { item: Task }) {
  const styles = useSlotStyles();
  const statusLabel = STATUS_OPTIONS.find((s) => s.value === item.status)?.label ?? item.status;
  return (
    <div style={{ textAlign: "right" }}>
      <div className={styles.meta}>{statusLabel}</div>
      {item.effort != null && <Caption1 className={styles.meta}>{item.effort}j</Caption1>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared config
// ---------------------------------------------------------------------------

const sortableConfig = [
  { id: "title", label: "Titre" },
  { id: "status", label: "Statut" },
  { id: "createdAt", label: "Date de création" },
  { id: "effort", label: "Effort" },
];

const filterableConfig = [
  { id: "title", label: "Titre", type: "text" as const },
  {
    id: "status",
    label: "Statut",
    type: "select" as const,
    conditions: ["anyOf", "noneOf"] as const,
    options: STATUS_OPTIONS,
  },
  { id: "finished", label: "Terminé", type: "boolean" as const },
  { id: "createdAt", label: "Date de création", type: "localdate" as const },
  { id: "effort", label: "Effort (j)", type: "decimal" as const, optional: true },
  {
    id: "categoryId",
    label: "Catégorie",
    type: "ref" as const,
    conditions: ["anyOf", "noneOf", "empty", "notEmpty"] as const,
    useOptions: useCategoryOptions,
  },
];

const contentSlots = [{ id: "summary", cell: ({ item }: { item: Task }) => <TaskSummaryCell item={item} /> }];

const contentSlotsWithMeta = [
  { id: "summary", cell: ({ item }: { item: Task }) => <TaskSummaryCell item={item} /> },
  { id: "meta", cell: ({ item }: { item: Task }) => <TaskMetaCell item={item} /> },
];

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: "DS/DsViewSummary",
  component: DsViewSummary,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story: React.ComponentType) => (
      <WithQueryClient>
        <SeijUIProvider>
          <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <Story />
          </div>
        </SeijUIProvider>
      </WithQueryClient>
    ),
  ],
} satisfies Meta<typeof DsViewSummary>;

export default meta;

type Story = StoryObj<typeof DsViewSummary>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  render: () => (
    <DsViewSummary
      source={useFetchTasks}
      emptyMessage="Aucune tâche."
      onNavigateItem={(id) => alert(`Navigate to task ${id}`)}
      contentSlots={contentSlots}
    />
  ),
};

export const Empty: Story = {
  render: () => <DsViewSummary source={emptySource} emptyMessage="Aucune tâche." contentSlots={contentSlots} />,
};

export const Loading: Story = {
  render: () => <DsViewSummary source={loadingSource} emptyMessage="Aucune tâche." contentSlots={contentSlots} />,
};

export const WithError: Story = {
  render: () => (
    <DsViewSummary
      source={errorSource(new Error("Erreur de chargement des tâches"))}
      emptyMessage="Aucune tâche."
      contentSlots={contentSlots}
    />
  ),
};

export const WithSorting: Story = {
  render: () => (
    <DsViewSummary
      source={useFetchTasks}
      emptyMessage="Aucune tâche."
      sortable={sortableConfig}
      contentSlots={contentSlotsWithMeta}
    />
  ),
};

export const WithFilters: Story = {
  render: () => (
    <DsViewSummary
      source={useFetchTasks}
      emptyMessage="Aucune tâche."
      sortable={sortableConfig}
      filterable={filterableConfig}
      queryStorage={createLocalStorageQueryStorage("story-with-filters")}
      contentSlots={contentSlotsWithMeta}
    />
  ),
};

export const WithQueryDefaults: Story = {
  render: () => (
    <DsViewSummary
      source={useFetchTasks}
      emptyMessage="Aucune tâche."
      sortable={sortableConfig}
      filterable={filterableConfig}
      queryStorage={createLocalStorageQueryStorage("story-with-query-defaults")}
      queryDefaults={{
        sorting: [{ id: "createdAt", desc: true }],
        filters: {
          operator: "and",
          items: [
            {
              id: "default-status",
              type: "select",
              field: "status",
              condition: "noneOf",
              values: ["done"],
            },
          ],
        },
      }}
      contentSlots={contentSlotsWithMeta}
    />
  ),
};

export const MultipleSlots: Story = {
  render: () => (
    <DsViewSummary
      source={useFetchTasks}
      emptyMessage="Aucune tâche."
      sortable={sortableConfig}
      filterable={filterableConfig}
      queryStorage={createLocalStorageQueryStorage("story-multiple-slots")}
      onNavigateItem={(id) => alert(`Navigate to task ${id}`)}
      contentSlots={[
        { id: "summary", cell: ({ item }: { item: Task }) => <TaskSummaryCell item={item} /> },
        {
          id: "meta",
          navigable: false,
          cell: ({ item }: { item: Task }) => <TaskMetaCell item={item} />,
        },
      ]}
    />
  ),
};
