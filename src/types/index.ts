export type { Locale } from "@/lib/i18n/config";

export type BasketConfig = {
  selectedProductIds: string[];
  bagLetter: string;
  cardMessage?: string;
};
