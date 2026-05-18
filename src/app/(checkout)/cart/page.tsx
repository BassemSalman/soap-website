import { requireAuth } from "@/lib/auth/get-session";
import { getCart } from "@/features/cart/queries";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsappButton } from "@/components/shared/whatsapp-button";
import { CartClient } from "@/components/cart/cart-client";

export const metadata = {
  title: "Your Bag — Habibti",
};

export default async function CartPage() {
  const session = await requireAuth();
  const cart = await getCart(session.user.id!);
  return (
    <>
      <Header />
      <main>
        <CartClient cart={cart} />
      </main>
      <Footer />
      <WhatsappButton />
    </>
  );
}
