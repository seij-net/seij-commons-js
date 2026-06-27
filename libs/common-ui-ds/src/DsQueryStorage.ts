import type { DsQuerySnapshot, DsQueryStorage } from "./DsQuery";

type StoredData = {
  version?: number;
  current?: DsQuerySnapshot;
  saved?: Array<{ name: string; query: DsQuerySnapshot }>;
};

export function createLocalStorageQueryStorage(key: string, options?: { version?: number }): DsQueryStorage {
  const storageKey = `ds-query:${key}`;
  const version = options?.version;

  function load(): StoredData {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as StoredData) : {};
    } catch {
      return {};
    }
  }

  function persist(data: StoredData): void {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch {
      // localStorage unavailable (private mode, quota exceeded, etc.)
    }
  }

  return {
    loadQuery(): DsQuerySnapshot | null {
      const data = load();
      if (version !== undefined && data.version !== version) return null;
      return data.current ?? null;
    },
    saveQuery(snapshot: DsQuerySnapshot): void {
      persist({ ...load(), version, current: snapshot });
    },
    listSavedQueries() {
      return load().saved ?? [];
    },
    saveNamedQuery(name: string, query: DsQuerySnapshot): void {
      const data = load();
      const saved = (data.saved ?? []).filter((q) => q.name !== name);
      persist({ ...data, saved: [...saved, { name, query }] });
    },
    deleteNamedQuery(name: string): void {
      const data = load();
      persist({
        ...data,
        saved: (data.saved ?? []).filter((q) => q.name !== name),
      });
    },
  };
}
