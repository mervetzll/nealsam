import { readSharedNote } from "@/lib/sharedNote";
import HediyeNotuClient from "./HediyeNotuClient";

export const metadata = {
  title: "Özel Hediye Notu | NeAlsam Hediye",
  description: "NeAlsam Hediye ile oluşturulmuş özel hediye notu.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function HediyeNotuPage({ searchParams }: {
  searchParams: Promise<{ title?: string; note?: string; from?: string }>;
}) {
  const values = await searchParams;
  const params = new URLSearchParams();
  for (const key of ["title", "note", "from"] as const) {
    if (typeof values[key] === "string") params.set(key, values[key]);
  }
  return <HediyeNotuClient legacyNote={readSharedNote(params)} />;
}
