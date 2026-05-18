export function generateOrderNumber(sequence: number): string {
  const year = new Date().getFullYear();
  const padded = String(sequence).padStart(5, "0");
  return `ORD-${year}-${padded}`;
}
