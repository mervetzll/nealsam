import { Suspense } from "react";
import UnbrandedNoteClient from "./UnbrandedNoteClient";

export const metadata = {
  title: "Özel Not",
  description: "Sana özel hazırlanmış bir not.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={null}>
      <UnbrandedNoteClient experienceId={id} />
    </Suspense>
  );
}
