export type Long = number;
export type Int = number;
export const NumberFormatInt = new Intl.NumberFormat("fr", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  style: "decimal",
});
