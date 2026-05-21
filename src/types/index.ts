import type { BagSizeId } from "@/features/basket-builder/schemas";
export type { BagSizeId };

export type BasketConfig = {
  selectedProductIds: string[];
  bagLetter: string;
  cardMessage?: string;
  wantBag?: boolean;
  bagSize?: BagSizeId;
};
