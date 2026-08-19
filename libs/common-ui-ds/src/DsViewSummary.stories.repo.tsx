import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { DsDataFetcherStatus } from "./DsDataFetcher";
import type { DsQuery } from "./DsQuery";

// ---------------------------------------------------------------------------
// Domain model
// ---------------------------------------------------------------------------

export type TaskStatus = "todo" | "inProgress" | "done";

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  finished: boolean;
  createdAt: string; // YYYY-MM-DD
  effort: number | null;
  categoryId: string | null;
  categoryLabel: string | null;
};

export const CATEGORIES = [
  { value: "cat-1", label: "Frontend" },
  { value: "cat-2", label: "Backend" },
  { value: "cat-3", label: "Design" },
];

export const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "À faire" },
  { value: "inProgress", label: "En cours" },
  { value: "done", label: "Terminé" },
];

export const SAMPLE_TASKS: Task[] = [
  {
    id: "1",
    title: "Créer le composant DsViewSummary",
    status: "done",
    finished: true,
    createdAt: "2024-01-10",
    effort: 3.5,
    categoryId: "cat-1",
    categoryLabel: "Frontend",
  },
  {
    id: "2",
    title: "Écrire les tests unitaires",
    status: "inProgress",
    finished: false,
    createdAt: "2024-01-15",
    effort: 2,
    categoryId: "cat-2",
    categoryLabel: "Backend",
  },
  {
    id: "3",
    title: "Revoir la charte graphique",
    status: "todo",
    finished: false,
    createdAt: "2024-01-20",
    effort: null,
    categoryId: "cat-3",
    categoryLabel: "Design",
  },
  {
    id: "4",
    title: "Mettre à jour la documentation",
    status: "todo",
    finished: false,
    createdAt: "2024-01-22",
    effort: 1,
    categoryId: null,
    categoryLabel: null,
  },
  {
    id: "5",
    title: "Optimiser les requêtes SQL",
    status: "inProgress",
    finished: false,
    createdAt: "2024-01-25",
    effort: 5,
    categoryId: "cat-2",
    categoryLabel: "Backend",
  },
  {
    id: "6",
    title: "Mettre en place le CI/CD",
    status: "done",
    finished: true,
    createdAt: "2024-02-01",
    effort: 4,
    categoryId: "cat-2",
    categoryLabel: "Backend",
  },
  {
    id: "7",
    title: "Revoir les maquettes mobile",
    status: "todo",
    finished: false,
    createdAt: "2024-02-03",
    effort: 2,
    categoryId: "cat-3",
    categoryLabel: "Design",
  },
  {
    id: "8",
    title: "Implémenter l'authentification OAuth",
    status: "inProgress",
    finished: false,
    createdAt: "2024-02-05",
    effort: 6,
    categoryId: "cat-2",
    categoryLabel: "Backend",
  },
  {
    id: "9",
    title: "Créer les composants de formulaire",
    status: "done",
    finished: true,
    createdAt: "2024-02-08",
    effort: 3,
    categoryId: "cat-1",
    categoryLabel: "Frontend",
  },
  {
    id: "10",
    title: "Rédiger les specs techniques",
    status: "todo",
    finished: false,
    createdAt: "2024-02-10",
    effort: null,
    categoryId: null,
    categoryLabel: null,
  },
  {
    id: "11",
    title: "Configurer le monitoring",
    status: "todo",
    finished: false,
    createdAt: "2024-02-12",
    effort: 2,
    categoryId: "cat-2",
    categoryLabel: "Backend",
  },
  {
    id: "12",
    title: "Mise en place du design system",
    status: "inProgress",
    finished: false,
    createdAt: "2024-02-15",
    effort: 8,
    categoryId: "cat-3",
    categoryLabel: "Design",
  },
  {
    id: "13",
    title: "Corriger le bug d'affichage Safari",
    status: "done",
    finished: true,
    createdAt: "2024-02-18",
    effort: 0.5,
    categoryId: "cat-1",
    categoryLabel: "Frontend",
  },
  {
    id: "14",
    title: "Ajouter la pagination côté serveur",
    status: "inProgress",
    finished: false,
    createdAt: "2024-02-20",
    effort: 3,
    categoryId: "cat-2",
    categoryLabel: "Backend",
  },
  {
    id: "15",
    title: "Créer les icônes custom",
    status: "todo",
    finished: false,
    createdAt: "2024-02-22",
    effort: 1.5,
    categoryId: "cat-3",
    categoryLabel: "Design",
  },
  {
    id: "16",
    title: "Refactoriser le module de paiement",
    status: "todo",
    finished: false,
    createdAt: "2024-02-25",
    effort: 5,
    categoryId: "cat-2",
    categoryLabel: "Backend",
  },
  {
    id: "17",
    title: "Tests de performance",
    status: "done",
    finished: true,
    createdAt: "2024-03-01",
    effort: 2,
    categoryId: "cat-2",
    categoryLabel: "Backend",
  },
  {
    id: "18",
    title: "Intégrer la map interactive",
    status: "inProgress",
    finished: false,
    createdAt: "2024-03-03",
    effort: 4,
    categoryId: "cat-1",
    categoryLabel: "Frontend",
  },
  {
    id: "19",
    title: "Mettre à jour les dépendances npm",
    status: "done",
    finished: true,
    createdAt: "2024-03-05",
    effort: 1,
    categoryId: null,
    categoryLabel: null,
  },
  {
    id: "20",
    title: "Créer le tableau de bord admin",
    status: "todo",
    finished: false,
    createdAt: "2024-03-08",
    effort: 7,
    categoryId: "cat-1",
    categoryLabel: "Frontend",
  },
  {
    id: "21",
    title: "Rédiger la politique de confidentialité",
    status: "todo",
    finished: false,
    createdAt: "2024-03-10",
    effort: null,
    categoryId: null,
    categoryLabel: null,
  },
  {
    id: "22",
    title: "Implémenter la recherche full-text",
    status: "inProgress",
    finished: false,
    createdAt: "2024-03-12",
    effort: 4,
    categoryId: "cat-2",
    categoryLabel: "Backend",
  },
  {
    id: "23",
    title: "Corriger les erreurs de traduction",
    status: "done",
    finished: true,
    createdAt: "2024-03-15",
    effort: 1,
    categoryId: "cat-1",
    categoryLabel: "Frontend",
  },
  {
    id: "24",
    title: "Optimiser les images",
    status: "todo",
    finished: false,
    createdAt: "2024-03-18",
    effort: 2,
    categoryId: "cat-3",
    categoryLabel: "Design",
  },
  {
    id: "25",
    title: "Mettre en place les feature flags",
    status: "inProgress",
    finished: false,
    createdAt: "2024-03-20",
    effort: 3,
    categoryId: "cat-2",
    categoryLabel: "Backend",
  },
  {
    id: "26",
    title: "Créer le système de notifications",
    status: "todo",
    finished: false,
    createdAt: "2024-03-22",
    effort: 5,
    categoryId: "cat-1",
    categoryLabel: "Frontend",
  },
  {
    id: "27",
    title: "Revoir l'architecture des microservices",
    status: "done",
    finished: true,
    createdAt: "2024-03-25",
    effort: 6,
    categoryId: "cat-2",
    categoryLabel: "Backend",
  },
  {
    id: "28",
    title: "Ajouter le mode sombre",
    status: "inProgress",
    finished: false,
    createdAt: "2024-03-28",
    effort: 2,
    categoryId: "cat-3",
    categoryLabel: "Design",
  },
  {
    id: "29",
    title: "Implémenter l'export PDF",
    status: "todo",
    finished: false,
    createdAt: "2024-04-01",
    effort: 3,
    categoryId: "cat-1",
    categoryLabel: "Frontend",
  },
  {
    id: "30",
    title: "Configurer les alertes Grafana",
    status: "todo",
    finished: false,
    createdAt: "2024-04-03",
    effort: 1,
    categoryId: "cat-2",
    categoryLabel: "Backend",
  },
  {
    id: "31",
    title: "Créer les maquettes onboarding",
    status: "done",
    finished: true,
    createdAt: "2024-04-05",
    effort: 3,
    categoryId: "cat-3",
    categoryLabel: "Design",
  },
  {
    id: "32",
    title: "Implémenter le panier d'achat",
    status: "inProgress",
    finished: false,
    createdAt: "2024-04-08",
    effort: 5,
    categoryId: "cat-1",
    categoryLabel: "Frontend",
  },
  {
    id: "33",
    title: "Corriger le bug de session expirée",
    status: "done",
    finished: true,
    createdAt: "2024-04-10",
    effort: 0.5,
    categoryId: "cat-2",
    categoryLabel: "Backend",
  },
  {
    id: "34",
    title: "Mettre en place le cache Redis",
    status: "todo",
    finished: false,
    createdAt: "2024-04-12",
    effort: 4,
    categoryId: "cat-2",
    categoryLabel: "Backend",
  },
  {
    id: "35",
    title: "Révision du système de droits",
    status: "inProgress",
    finished: false,
    createdAt: "2024-04-15",
    effort: 6,
    categoryId: "cat-2",
    categoryLabel: "Backend",
  },
  {
    id: "36",
    title: "Créer les animations de transition",
    status: "todo",
    finished: false,
    createdAt: "2024-04-18",
    effort: 2,
    categoryId: "cat-3",
    categoryLabel: "Design",
  },
  {
    id: "37",
    title: "Intégrer Stripe",
    status: "done",
    finished: true,
    createdAt: "2024-04-20",
    effort: 4,
    categoryId: "cat-2",
    categoryLabel: "Backend",
  },
  {
    id: "38",
    title: "Ajouter les raccourcis clavier",
    status: "todo",
    finished: false,
    createdAt: "2024-04-22",
    effort: 1.5,
    categoryId: "cat-1",
    categoryLabel: "Frontend",
  },
  {
    id: "39",
    title: "Créer le rapport mensuel automatique",
    status: "inProgress",
    finished: false,
    createdAt: "2024-04-25",
    effort: 3,
    categoryId: "cat-2",
    categoryLabel: "Backend",
  },
  {
    id: "40",
    title: "Mettre à jour le guide de style",
    status: "todo",
    finished: false,
    createdAt: "2024-04-28",
    effort: null,
    categoryId: "cat-3",
    categoryLabel: "Design",
  },
  {
    id: "41",
    title: "Implémenter le drag & drop",
    status: "done",
    finished: true,
    createdAt: "2024-05-01",
    effort: 3,
    categoryId: "cat-1",
    categoryLabel: "Frontend",
  },
  {
    id: "42",
    title: "Corriger les fuites mémoire",
    status: "inProgress",
    finished: false,
    createdAt: "2024-05-03",
    effort: 4,
    categoryId: "cat-2",
    categoryLabel: "Backend",
  },
  {
    id: "43",
    title: "Ajouter les tests d'accessibilité",
    status: "todo",
    finished: false,
    createdAt: "2024-05-05",
    effort: 2,
    categoryId: "cat-1",
    categoryLabel: "Frontend",
  },
  {
    id: "44",
    title: "Créer le composant de calendrier",
    status: "inProgress",
    finished: false,
    createdAt: "2024-05-08",
    effort: 5,
    categoryId: "cat-1",
    categoryLabel: "Frontend",
  },
  {
    id: "45",
    title: "Rédiger les release notes v2.0",
    status: "todo",
    finished: false,
    createdAt: "2024-05-10",
    effort: 1,
    categoryId: null,
    categoryLabel: null,
  },
  {
    id: "46",
    title: "Implémenter la 2FA",
    status: "done",
    finished: true,
    createdAt: "2024-05-12",
    effort: 4,
    categoryId: "cat-2",
    categoryLabel: "Backend",
  },
  {
    id: "47",
    title: "Refactoriser les composants legacy",
    status: "inProgress",
    finished: false,
    createdAt: "2024-05-15",
    effort: 8,
    categoryId: "cat-1",
    categoryLabel: "Frontend",
  },
  {
    id: "48",
    title: "Créer les tokens de design",
    status: "done",
    finished: true,
    createdAt: "2024-05-18",
    effort: 2,
    categoryId: "cat-3",
    categoryLabel: "Design",
  },
  {
    id: "49",
    title: "Ajouter le support multilingue",
    status: "todo",
    finished: false,
    createdAt: "2024-05-20",
    effort: 6,
    categoryId: "cat-1",
    categoryLabel: "Frontend",
  },
  {
    id: "50",
    title: "Déployer en production",
    status: "todo",
    finished: false,
    createdAt: "2024-05-22",
    effort: 1,
    categoryId: null,
    categoryLabel: null,
  },
];

// ---------------------------------------------------------------------------
// Repository — its own types, unaware of DsQuery
// ---------------------------------------------------------------------------

type RepoFilter = {
  field: string;
  condition: string;
  values: string[];
};

type RepoQuery = {
  search?: string;
  filters: { operator: "and" | "or"; items: RepoFilter[] };
  sorting: { id: string; desc: boolean }[];
  pagination: { limit: number; offset: number };
};

type RepoSearchResult = {
  items: Task[];
  total: number;
};

class TaskRepository {
  constructor(private readonly tasks: Task[]) {}

  search(query: RepoQuery): RepoSearchResult {
    let result = this.tasks;

    if (query.search) {
      const s = query.search.toLowerCase();
      result = result.filter(
        (t) => t.title.toLowerCase().includes(s) || (t.categoryLabel ?? "").toLowerCase().includes(s),
      );
    }

    const { operator, items: filters } = query.filters;
    if (filters.length > 0) {
      result = result.filter((item) => {
        const matches = filters.map((f) => this.matchesFilter(item, f));
        return operator === "and" ? matches.every(Boolean) : matches.some(Boolean);
      });
    }

    if (query.sorting.length > 0) {
      const { id, desc } = query.sorting[0];
      result = [...result].sort((a, b) => {
        const av = (a as Record<string, unknown>)[id];
        const bv = (b as Record<string, unknown>)[id];
        if (av == null && bv == null) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return desc ? -cmp : cmp;
      });
    }

    const total = result.length;
    const { limit, offset } = query.pagination;
    const items = result.slice(offset, offset + limit);
    return { items, total };
  }

  private matchesFilter(item: Task, f: RepoFilter): boolean {
    const { field, condition, values } = f;
    switch (field) {
      case "title": {
        const val = item.title;
        if (condition === "empty") return val === "";
        if (condition === "notEmpty") return val !== "";
        if (condition === "contains") return val.toLowerCase().includes((values[0] ?? "").toLowerCase());
        if (condition === "eq") return val === values[0];
        return true;
      }
      case "status": {
        if (condition === "anyOf") return values.includes(item.status);
        if (condition === "noneOf") return !values.includes(item.status);
        return true;
      }
      case "finished": {
        if (condition === "eq") return item.finished === (values[0] === "true");
        return true;
      }
      case "createdAt": {
        const val = item.createdAt;
        if (condition === "eq") return val === values[0];
        if (condition === "lt") return val < (values[0] ?? "");
        if (condition === "gt") return val > (values[0] ?? "");
        if (condition === "between") return val >= (values[0] ?? "") && val <= (values[1] ?? "");
        return true;
      }
      case "effort": {
        const val = item.effort;
        if (condition === "empty") return val == null;
        if (condition === "notEmpty") return val != null;
        if (val == null) return false;
        const n = parseFloat(values[0] ?? "0");
        const n2 = parseFloat(values[1] ?? "0");
        if (condition === "eq") return val === n;
        if (condition === "gt") return val > n;
        if (condition === "gte") return val >= n;
        if (condition === "lt") return val < n;
        if (condition === "lte") return val <= n;
        if (condition === "between") return val >= n && val <= n2;
        return true;
      }
      case "categoryId": {
        const val = item.categoryId;
        if (condition === "empty") return val == null || val === "";
        if (condition === "notEmpty") return val != null && val !== "";
        if (condition === "anyOf") return val != null && values.includes(val);
        if (condition === "noneOf") return val == null || !values.includes(val);
        return true;
      }
      default:
        return true;
    }
  }
}

// ---------------------------------------------------------------------------
// Traduction DsQuery → RepoQuery
// ---------------------------------------------------------------------------

function dsQueryToRepoQuery(query: DsQuery): RepoQuery {
  return {
    search: query.search,
    sorting: query.sorting,
    pagination: query.pagination,
    filters: {
      operator: query.filters.operator,
      items: query.filters.items.map((f) => {
        const values: string[] =
          "values" in f
            ? f.values
            : "value" in f && f.value != null
              ? "valueTo" in f && f.valueTo != null
                ? [String(f.value), String(f.valueTo)]
                : [String(f.value)]
              : [];
        return { field: f.field, condition: f.condition, values };
      }),
    },
  };
}

// ---------------------------------------------------------------------------
// Sources exposées aux stories
// ---------------------------------------------------------------------------

const taskRepository = new TaskRepository(SAMPLE_TASKS);

export function useFetchTasks(query: DsQuery): DsDataFetcherStatus<Task> {
  const { limit } = query.pagination;

  const result = useInfiniteQuery({
    queryKey: ["tasks", { search: query.search, sorting: query.sorting, filters: query.filters, limit }],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => {
      const repoQuery = dsQueryToRepoQuery({ ...query, pagination: { limit, offset: pageParam } });
      return Promise.resolve(taskRepository.search(repoQuery));
    },
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const nextOffset = lastPageParam + limit;
      return nextOffset < lastPage.total ? nextOffset : undefined;
    },
  });

  const items = useMemo(() => result.data?.pages.flatMap((page) => page.items) ?? [], [result.data]);

  return {
    items,
    total: result.data?.pages[0]?.total ?? 0,
    fetchNextPage: result.fetchNextPage,
    hasNextPage: result.hasNextPage,
    isFetchingNextPage: result.isFetchingNextPage,
    isPending: result.isPending,
    error: result.error ?? undefined,
  };
}

export function emptySource(_query: DsQuery): DsDataFetcherStatus<Task> {
  return {
    items: [],
    total: 0,
    isPending: false,
    error: undefined,
    hasNextPage: false,
    isFetchingNextPage: false,
    fetchNextPage: () => {},
  };
}

export function loadingSource(_query: DsQuery): DsDataFetcherStatus<Task> {
  return {
    items: [],
    total: 0,
    isPending: true,
    error: undefined,
    hasNextPage: false,
    isFetchingNextPage: false,
    fetchNextPage: () => {},
  };
}

export function errorSource(error: Error) {
  return (_query: DsQuery): DsDataFetcherStatus<Task> => ({
    items: [],
    total: 0,
    isPending: false,
    error,
    hasNextPage: false,
    isFetchingNextPage: false,
    fetchNextPage: () => {},
  });
}
