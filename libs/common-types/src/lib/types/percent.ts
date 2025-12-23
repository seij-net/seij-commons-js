export type Percent = number;
export type Rate = number;

export const NumberFormatPercent = new Intl.NumberFormat("fr", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  style: "percent",
});
export const NumberFormatPercent6 = new Intl.NumberFormat("fr", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
  style: "percent",
});
export const NumberFormatPercent0 = new Intl.NumberFormat("fr", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  style: "percent",
});
