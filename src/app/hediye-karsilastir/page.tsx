import GiftCompareClient from "./GiftCompareClient";

export const metadata = {
  title: "Hediye Karşılaştırma | NeAlsam Hediye",
  description:
    "İki hediye arasında kaldıysan kişisellik, risk, anlam ve kullanışlılık açısından karşılaştır.",
};

export default async function GiftComparePage({ searchParams }: {
  searchParams: Promise<{ gift?: string | string[]; price?: string | string[] }>;
}) {
  const params = await searchParams;
  const initialGift = typeof params.gift === "string" ? params.gift.trim().slice(0, 160) : "";
  const initialPrice = typeof params.price === "string" ? params.price.trim().slice(0, 60) : "";
  return <GiftCompareClient key={`${initialGift}-${initialPrice}`} initialGift={initialGift}  />;
}
