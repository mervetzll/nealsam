import GiftPackageClient from "./GiftPackageClient";

export const metadata = {
  title: "Hediye Paketi Oluşturucu",
  description:
    "Bütçene, kişiye ve hediye tarzına göre hazır hediye paketi oluştur.",
};

export default function GiftPackagePage() {
  return <GiftPackageClient />;
}
