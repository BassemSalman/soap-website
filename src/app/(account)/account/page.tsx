import { requireAuth } from "@/lib/auth/get-session";
import { getOrdersByUser } from "@/features/orders/queries";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsappButton } from "@/components/shared/whatsapp-button";
import { AccountClient } from "@/components/account/account-client";

export default async function AccountPage() {
  const session = await requireAuth();
  const orders = await getOrdersByUser(session.user.id);
  return (
    <>
      <Header />
      <main>
        <AccountClient
          user={{
            id: session.user.id ?? "",
            name: session.user.name ?? null,
            email: session.user.email ?? null,
            image: session.user.image ?? null,
          }}
          orders={orders}
        />
      </main>
      <Footer />
      <WhatsappButton />
    </>
  );
}
