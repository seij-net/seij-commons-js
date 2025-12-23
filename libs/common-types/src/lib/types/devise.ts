/**
 * Formattage d'un nombre avec une unité
 * @param currency code devise ISO. Si le code devise n'est pas reconnu il est renvoyé tel quel comme symbole
 * @param format la fonction de formattage Intl à appliquer
 * @param value la valeur à afficher
 * @param sign affichage du signe, auto uniquement si négatif, always tout le temps
 */
export const format = (
  value: number,
  format: Intl.NumberFormat,
  currency: string,
  sign: "auto" | "always" = "auto",
): string => {
  const displaySign = (sign === "auto" ? value < 0 : sign === "always") && value !== 0;
  const signSymbol = displaySign ? (value < 0 ? "-\u00A0" : value > 0 ? "+\u00A0" : "") : "";
  return signSymbol + format.format(Math.abs(value)) + "\u00A0" + currency;
};

/**
 * Permet de créer une unité à partir d'une chaine d'unités fournies
 * @param userCurrency unité fournie par l'utilisateur
 * @param per division de l'unité (ex: /mois, /an, etc.)
 * @param contextCurrency si le contexte de l'application fournit une unité, elle sera utilisée
 * @param defaultCurrency si aucune unité n'est fournie, l'unité par défaut sera utilisée
 * @returns
 */
export function createCurrency(
  userCurrency: string | undefined,
  per: string | undefined,
  contextCurrency: string | undefined,
  defaultCurrency: string,
) {
  const currency = userCurrency ?? contextCurrency ?? defaultCurrency;
  if (per) {
    return `${currency}\u00A0/\u00A0${per}`;
  }
  return currency;
}
