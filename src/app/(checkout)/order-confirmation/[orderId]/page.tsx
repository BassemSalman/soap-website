import { notFound } from "next/navigation";
import { getOrderById } from "@/features/orders/queries";
import { getSession } from "@/lib/auth/get-session";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsappButton } from "@/components/shared/whatsapp-button";
import { OrderConfirmationClient } from "@/components/checkout/order-confirmation-client";

export const metadata = {
  title: "Order Confirmed — Habibti",
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const session = await getSession();
  const order = await getOrderById(orderId, session?.user?.id ?? undefined);

  if (!order) notFound();

  return (
    <>
      <Header />
      <main>
        <OrderConfirmationClient order={order} />
      </main>
      <Footer />
      <WhatsappButton />
    </>
  );
}
