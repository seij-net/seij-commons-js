/**
 * Augmentation partagée par toutes les vues bâties sur TanStack Table.
 *
 * Elle vit dans son propre module parce qu'une augmentation ne peut être déclarée
 * qu'une seule fois : deux vues qui répéteraient ce bloc feraient échouer la
 * compilation sur un identifiant dupliqué.
 */
import type { RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
    navigable?: boolean;
  }
}

export {};
