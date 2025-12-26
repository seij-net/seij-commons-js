// i18n/locale.ts
export type Locale = string;

const SUPPORTED = ["fr", "en"] as const;
const FALLBACK: Locale = "en";

export function normalize(loc?: string): Locale {
  if (!loc) return FALLBACK;
  // garde "fr-CA" mais tombe sur "fr" si non supporté
  const lc = loc.toLowerCase();
  const base = lc.split("-")[0];
  return SUPPORTED.includes(lc as any) ? (lc as Locale) : SUPPORTED.includes(base as any) ? (base as Locale) : FALLBACK;
}

// Client-only helpers
function fromHtmlLang(): string | undefined {
  return typeof document !== "undefined" ? document.documentElement.lang : undefined;
}
function fromNavigator(): string | undefined {
  if (typeof navigator === "undefined") return undefined;
  return navigator.languages?.[0] || navigator.language;
}
function fromStorage(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem("locale") || undefined;
}
function fromQuery(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return new URLSearchParams(window.location.search).get("lang") || undefined;
}

export function detectClientLocale(): Locale {
  return normalize(
    fromQuery() ||
      fromStorage() ||
      // fromHtmlLang() ||
      fromNavigator(),
  );
}

// SSR-side (ex: Next.js route handler / Node middleware)
export function detectServerLocale(opts: {
  queryLang?: string | null;
  cookieLang?: string | null;
  acceptLanguage?: string | null;
}): Locale {
  const fromAL = opts.acceptLanguage?.split(",")?.[0]; // ex: "fr-CA,fr;q=0.9,en;q=0.8"
  return normalize(opts.queryLang || opts.cookieLang || fromAL);
}

// Persister le choix utilisateur (client)
export function setUserLocale(loc: string) {
  const n = normalize(loc);
  if (typeof document !== "undefined") document.documentElement.lang = n;
  if (typeof window !== "undefined") localStorage.setItem("locale", n);
  return n;
}
