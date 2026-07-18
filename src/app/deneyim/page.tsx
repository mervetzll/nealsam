import Navbar from "@/components/Navbar";
import ExperienceModes from "@/components/ExperienceModes";

export default function DeneyimPage() {
  return (
    <main className="min-h-screen bg-[#fff7f3] text-[#2b1b1b]">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 pb-4 pt-6 text-center">
        <p className="mb-3 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#b83280] shadow-sm">
          Deneyim Modları
        </p>

        <h1 className="text-5xl font-extrabold leading-tight md:text-6xl">
          Hediyenin ürün kısmı sende, hikâyesi bizde.
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#6b4b4b]">
          İstersen bir hediye fikri bul, istersen hediyenin yanına
          koyacağın notu, QR kodlu mesajı, mektubu, hikâyeyi veya bilmece
          akışını oluştur. QR kodu hediyenin yanına ekleyerek notunu dijital
          bir sürprize dönüştürebilirsin.
          Ürünü biz satmayız; fikri ve sunumu kişiselleştiririz.
        </p>
      </section>

      <ExperienceModes />
    </main>
  );
}
