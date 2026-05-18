export function formatCurrency(
  amount: number | string,
  locale: "en" | "ar" = "en"
): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat(locale === "ar" ? "ar-LB" : "en-LB", {
    style: "currency",
    currency: "LBP",
    minimumFractionDigits: 0,
  }).format(num);
}
