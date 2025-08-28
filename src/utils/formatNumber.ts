export function formatNumber(n: number) {
  try {
    return new Intl.NumberFormat("it-IT", { maximumFractionDigits: 3 }).format(
      n
    );
  } catch {
    return String(n);
  }
}
