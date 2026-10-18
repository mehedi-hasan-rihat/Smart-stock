export const CURRENCY = "৳";

export const LOW_STOCK_THRESHOLD = 5;

export function formatPrice(price: string | number): string {
  const num = typeof price === "string" ? Number(price) : price;
  return `${CURRENCY}${num.toFixed(2)}`;
}
