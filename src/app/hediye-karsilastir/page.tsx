import GiftCompareClient from "./GiftCompareClient";

export const metadata = {
  title: "Hediye Karşılaştırma",
  description:
    "İki hediye arasında kaldıysan kişisellik, risk, anlam ve kullanışlılık açısından karşılaştır.",
};

export default function GiftComparePage() {
  return <GiftCompareClient />;
}
