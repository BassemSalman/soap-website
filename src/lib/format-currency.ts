export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-LB", {
    style: "currency",
    currency: "LBP",
    minimumFractionDigits: 0,
  }).format(num);
}
