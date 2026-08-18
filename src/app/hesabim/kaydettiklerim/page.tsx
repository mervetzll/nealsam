import KaydettiklerimClient from "./KaydettiklerimClient";

export const metadata = {
  title: "Kaydettiklerim | NeAlsam",
  description: "NeAlsam hesabına kaydettiğin premium hediye deneyimleri.",
};

export const dynamic = "force-dynamic";

export default function KaydettiklerimPage() {
  return <KaydettiklerimClient />;
}
