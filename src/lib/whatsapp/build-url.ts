type OrderItem = {
  productName_en: string;
  quantity: number;
  lineTotal: string | number;
};

type OrderSummary = {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  total: string | number;
  deliveryNotes?: string | null;
  items: OrderItem[];
};

export function buildWhatsappUrl(order: OrderSummary): string {
  const number = process.env.WHATSAPP_NUMBER!;
  const lines = [
    `*New Order: ${order.orderNumber}*`,
    `Name: ${order.customerName}`,
    `Phone: ${order.customerPhone}`,
    ``,
    ...order.items.map(
      (i) => `• ${i.productName_en} x${i.quantity} — ${i.lineTotal}`
    ),
    ``,
    `Total: ${order.total}`,
    order.deliveryNotes ? `Notes: ${order.deliveryNotes}` : null,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return `https://wa.me/${number}?text=${encodeURIComponent(lines)}`;
}
