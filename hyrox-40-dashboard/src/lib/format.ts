export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function pct(value: number, max = 100) {
  return Math.max(0, Math.min(100, Math.round((value / max) * 100)));
}

export function formatNumber(value?: number, suffix = "") {
  if (typeof value !== "number" || Number.isNaN(value)) return "--";
  return `${Intl.NumberFormat("en-IN", { maximumFractionDigits: value % 1 ? 1 : 0 }).format(value)}${suffix}`;
}
