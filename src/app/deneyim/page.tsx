import ExperienceHub from "@/components/ExperienceHub";

export const metadata = {
  title: "Hediye Notu ve QR Sürpriz",
  description: "Hediyene özel not yaz, QR mesaj hazırla veya ipucu kartlarıyla bir hediye avı planla.",
};

export default async function DeneyimPage({ searchParams }: {
  searchParams: Promise<{ gift?: string | string[]; concept?: string | string[] }>;
}) {
  const params = await searchParams;
  const gift = typeof params.gift === "string" ? params.gift.trim().slice(0, 160) : "";
  const concept = typeof params.concept === "string" ? params.concept : "";
  return <main className="min-h-screen bg-[#fff7f3] text-[#2b1b1b] pb-10"><ExperienceHub key={`${gift}-${concept}`} gift={gift} hasConcept={Boolean(concept)} /></main>;
}
