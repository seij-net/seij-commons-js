// i18n.ts (contrat maison)
export type Messages = Record<string, string>;
export type Formats = {
  localdate: {
    placeholder: string;
    inputmask: string;
  };
  date: Record<string, Intl.DateTimeFormatOptions>;
  number: Record<string, Intl.NumberFormatOptions>;
  list: Record<string, Intl.ListFormatOptions>;
};

export interface I18n {
  t(id: string, values?: Record<string, unknown>): string; // ICU-style
  rich(id: string, values?: Record<string, unknown | ((chunks: string) => React.ReactNode)>): React.ReactNode;
  formatDate(d: Date | number, style?: string): string;
  formatNumber(n: number, style?: string): string;
  formatList(items: string[], style?: string): string;
  formatRelative(d: Date | number): string;
  localDatePlaceholder(): string;
  localDateInputMask(): string;
  localDateFormattedToISO: (str: string) => string;
  localDateISOToFormattedInput: (str: string) => string;
  monthList(): { code: number; label: string }[];
  getLocale(): string;
}
