import ShareExperienceClient from "./ShareExperienceClient";

export const metadata = {
  title: "Hediye Deneyimi | NeAlsam",
  description: "NeAlsam ile hazırlanmış özel hediye deneyimi.",
};

export const dynamic = "force-dynamic";

export default async function ShareExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ShareExperienceClient experienceId={id} />;
}
