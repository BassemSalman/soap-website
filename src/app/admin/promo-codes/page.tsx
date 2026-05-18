import { getPromoCodes } from "@/features/promo-codes/queries";
import { PromoCodesTable } from "@/components/admin/promo-codes-table";

export const dynamic = "force-dynamic";

export default async function AdminPromoCodesPage() {
  const promoCodes = await getPromoCodes();
  return (
    <PromoCodesTable
      promoCodes={promoCodes as Parameters<typeof PromoCodesTable>[0]["promoCodes"]}
    />
  );
}
