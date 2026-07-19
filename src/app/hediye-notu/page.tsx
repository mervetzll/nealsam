type PageProps = {
  searchParams: Promise<{
    title?: string;
    note?: string;
    from?: string;
  }>;
};

export const metadata = {
  title: "Özel Hediye Notu | NeAlsam Hediye",
  description: "NeAlsam Hediye ile oluşturulmuş özel hediye notu.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function HediyeNotuPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const title = params.title || "Sana özel bir not var";
  const note = params.note || "Bu hediye senin için özel olarak hazırlandı.";
  const from = params.from || "NeAlsam Hediye";

  return (
    <main className="min-h-screen bg-[#fff7f3] px-6 py-16 text-[#2b1b1b]">
      <section className="mx-auto max-w-2xl rounded-[2rem] bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#b83280]">
          NeAlsam Hediye
        </p>

        <h1 className="mt-5 text-4xl font-extrabold">{title}</h1>

        <div className="mt-8 rounded-[2rem] bg-[#fff0f7] p-7">
          <p className="text-xl leading-9 text-[#2b1b1b]">{note}</p>
        </div>

        <p className="mt-8 text-sm font-bold text-[#b83280]">
          {from}
        </p>
      </section>
    </main>
  );
}
