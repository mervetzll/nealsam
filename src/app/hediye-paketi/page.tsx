import GiftPackageClient from "./GiftPackageClient";

export const metadata = {
  title: "Hediye Paketi Oluşturucu | NeAlsam Hediye",
  description:
    "Bütçene, kişiye ve hediye tarzına göre hazır hediye paketi oluştur.",
};

export default async function GiftPackagePage({ searchParams }: {
  searchParams: Promise<{ gift?: string | string[]; price?: string | string[] }>;
}) {
  const params = await searchParams;
  const initialGift = typeof params.gift === "string" ? params.gift.trim().slice(0, 160) : "";
  const initialPrice = typeof params.price === "string" ? params.price.trim().slice(0, 60) : "";
  return <GiftPackageClient key={`${initialGift}-${initialPrice}`} initialGift={initialGift} initialPrice={initialPrice} />;
}
