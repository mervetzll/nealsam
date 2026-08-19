import { Suspense } from "react";
import PublicNoteClient from "./PublicNoteClient";

export const metadata = {
  title: "Özel Not",
  description: "Sana özel hazırlanmış bir hediye notu.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PublicNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={null}>
      <PublicNoteClient experienceId={id} />
    </Suspense>
  );
}
