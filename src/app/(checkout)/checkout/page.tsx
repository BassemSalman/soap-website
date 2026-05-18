import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/get-session";
import { getCart } from "@/features/cart/queries";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CheckoutClient } from "@/components/checkout/checkout-client";

export const metadata = {
  title: "Checkout — Habibti",
};

export default async function CheckoutPage() {
  const session = await requireAuth();
  const cart = await getCart(session.user.id!);

  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  return (
    <>
      <Header />
      <main>
        <CheckoutClient
          cart={cart}
          userEmail={session.user.email!}
          userName={session.user.name ?? ""}
        />
      </main>
      <Footer />
    </>
  );
}
