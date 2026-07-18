import Navbar from "@/components/Navbar";


const avoidOptionsByInterest: Record<string, string[]> = {
  Kahve: [
    "Kırılabilir olmasın",
    "Koku seçimi gerektirmesin",
    "Kişiye özel olmasın",
    "Son dakika uygun olsun",
    "Fark etmez",
  ],
  Kitap: [
    "Dijital hediye olmasın",
    "Kişiye özel olmasın",
    "Son dakika uygun olsun",
    "Fark etmez",
  ],
  Makyaj: [
    "Renk/ton seçimi gerektirmesin",
    "Koku seçimi gerektirmesin",
    "Son dakika uygun olsun",
    "Fark etmez",
  ],
  "Cilt bakımı": [
    "Koku seçimi gerektirmesin",
    "Son dakika uygun olsun",
    "Fark etmez",
  ],
  Teknoloji: [
    "Elektronik olmasın",
    "Dijital hediye olmasın",
    "Kişiye özel olmasın",
    "Son dakika uygun olsun",
    "Fark etmez",
  ],
  Oyun: [
    "Dijital hediye olmasın",
    "Elektronik olmasın",
    "Son dakika uygun olsun",
    "Fark etmez",
  ],
  Spor: [
    "Beden/numara riski olmasın",
    "Son dakika uygun olsun",
    "Fark etmez",
  ],
  Moda: [
    "Beden/numara riski olmasın",
    "Renk/ton seçimi gerektirmesin",
    "Kişiye özel olmasın",
    "Son dakika uygun olsun",
    "Fark etmez",
  ],
  Takı: [
    "Beden/numara riski olmasın",
    "Kişiye özel olmasın",
    "Çok romantik olmasın",
    "Son dakika uygun olsun",
    "Fark etmez",
  ],
  "Ev dekorasyonu": [
    "Kırılabilir olmasın",
    "Koku seçimi gerektirmesin",
    "Kişiye özel olmasın",
    "Son dakika uygun olsun",
    "Fark etmez",
  ],
  Seyahat: [
    "Beden/numara riski olmasın",
    "Kırılabilir olmasın",
    "Kişiye özel olmasın",
    "Son dakika uygun olsun",
    "Fark etmez",
  ],
  Müzik: [
    "Dijital hediye olmasın",
    "Kişiye özel olmasın",
    "Çok romantik olmasın",
    "Son dakika uygun olsun",
    "Fark etmez",
  ],
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fff7f3] text-[#2b1b1b]">
      <section className="mx-auto max-w-6xl px-6 py-8">
      <Navbar />

        <div className="grid min-h-[80vh] items-center gap-12 py-16 md:grid-cols-2">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#b83280] shadow-sm">
              Yapay zekâlı hediye fikri ve not asistanı
            </p>

            <h1 className="text-5xl font-extrabold leading-tight md:text-6xl">
              Hediyeyi sen al, hikâyesini biz yazalım.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#6b4b4b]">
              NeAlsam ürün satmaz; sana internette arayabileceğin hediye
              fikirleri verir, hediyenin yanına koyacağın kişisel notu,
              hikâyeyi ve yaratıcı sunumu hazırlar.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="/hediye-bul"
                className="rounded-full bg-[#b83280] px-8 py-4 text-center text-base font-bold text-white shadow-lg"
              >
                Hediye Bulmaya Başla
              </a>

              <a
                href="/deneyim"
                className="rounded-full border border-[#e8c4d8] bg-white px-8 py-4 text-center text-base font-bold text-[#b83280]"
              >
                Deneyim Modu Seç
              </a>
            </div>

            <p className="mt-6 text-sm text-[#8b6f6f]">
              Ürün yönlendirme · Kişisel not · Hediye deneyimi
            </p>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-2xl">
            <p className="mb-4 inline-flex rounded-full bg-[#fff0f7] px-4 py-2 text-sm font-bold text-[#b83280]">
              NeAlsam ne yapar?
            </p>

            <h2 className="text-3xl font-extrabold">
              Ürünü değil, doğru fikri ve sunumu bulur.
            </h2>

            <p className="mt-4 leading-7 text-[#6b4b4b]">
              Klasik hediye önerici ile bütçene ve kişiye göre ürün fikirleri
              bulabilir; Deneyim Modları ile hediyenin yanına özel not, hikâye,
              bilmece veya mektup hazırlayabilirsin.
            </p>

            <div className="mt-6 grid gap-3">
              <a
                href="/hediye-bul"
                className="rounded-full bg-[#b83280] px-6 py-4 text-center font-bold text-white"
              >
                Klasik hediye önericiyi aç
              </a>

              <a
                href="/deneyim"
                className="rounded-full border border-[#e8c4d8] bg-white px-6 py-4 text-center font-bold text-[#b83280]"
              >
                Deneyim modlarını aç
              </a>
            </div>
          </div>
        </div>

        <section id="how-it-works" className="py-16">
          <div className="rounded-[2rem] bg-white p-8 shadow-sm">
            <div className="mb-8 text-center">
              <p className="text-sm font-bold text-[#b83280]">
                Nasıl çalışır?
              </p>

              <h2 className="mt-2 text-4xl font-extrabold">
                Ürün değil, hediye deneyimi oluşturur.
              </h2>

              <p className="mx-auto mt-3 max-w-3xl text-[#6b4b4b]">
                NeAlsam kullanıcıyı internetteki ürünlere yönlendirir. Asıl
                farkı ise hediyenin yanına koyulacak notu, hikâyeyi ve sunum
                fikrini kişiselleştirmesidir.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-4">
              <div className="rounded-3xl bg-[#fff7f3] p-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#b83280] text-lg font-extrabold text-white">
                  1
                </div>

                <h3 className="text-xl font-extrabold">Kişiyi anlat</h3>

                <p className="mt-3 text-sm leading-6 text-[#6b4b4b]">
                  Kime hediye alınacağını, bütçeyi, özel günü ve kişinin tarzını
                  seçersin.
                </p>
              </div>

              <div className="rounded-3xl bg-[#fff7f3] p-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#b83280] text-lg font-extrabold text-white">
                  2
                </div>

                <h3 className="text-xl font-extrabold">Fikirleri gör</h3>

                <p className="mt-3 text-sm leading-6 text-[#6b4b4b]">
                  Sistem sana uygun hediye fikirleri ve arama linkleri verir.
                </p>
              </div>

              <div className="rounded-3xl bg-[#fff7f3] p-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#b83280] text-lg font-extrabold text-white">
                  3
                </div>

                <h3 className="text-xl font-extrabold">Notu oluştur</h3>

                <p className="mt-3 text-sm leading-6 text-[#6b4b4b]">
                  Hediyenin yanına koyacağın kişisel not, mektup, hikâye veya
                  bilmece hazırlanır.
                </p>
              </div>

              <div className="rounded-3xl bg-[#fff7f3] p-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#b83280] text-lg font-extrabold text-white">
                  4
                </div>

                <h3 className="text-xl font-extrabold">Sen satın al</h3>

                <p className="mt-3 text-sm leading-6 text-[#6b4b4b]">
                  Ürünü dış siteden sen alırsın. NeAlsam sadece fikri, notu ve
                  deneyimi hazırlar.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="modules" className="py-16">
          <div className="mb-8 text-center">
            <p className="text-sm font-bold text-[#b83280]">
              Deneyim modları
            </p>

            <h2 className="mt-2 text-4xl font-extrabold">
              Hediyeyi daha kişisel hale getir.
            </h2>

            <p className="mx-auto mt-3 max-w-3xl text-[#6b4b4b]">
              Anıdan hikâye, nefret ettiği şeylerden çözüm, oyun karakterinden
              hediye fikri veya hediye avı planı oluşturabilirsin.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Hediye Notu",
                href: "/deneyim?mode=not",
                desc: "Seçtiğin hediyenin yanına kısa, uzun veya komik not oluştur.",
              },
              {
                title: "Kader Bağları",
                href: "/deneyim?mode=kader",
                desc: "Ortak bir anıdan hikâye ve hediye fikri üret.",
              },
              {
                title: "Anti-Hediye",
                href: "/deneyim?mode=anti",
                desc: "Nefret ettiği şeylerden yaratıcı çözüm hediyesi bul.",
              },
              {
                title: "RPG Karakter",
                href: "/deneyim?mode=rpg",
                desc: "Kişiyi oyun karakteri gibi analiz edip ekipman öner.",
              },
              {
                title: "Hediye Avı",
                href: "/deneyim?mode=av",
                desc: "Hediyeyi bilmece ve görevlerle mini oyuna çevir.",
              },
              {
                title: "Gizemli Hediye",
                href: "/deneyim?mode=gizemli",
                desc: "Hediyeyi gizle, sadece şiirsel ipucu göster.",
              },
              {
                title: "Gelecekteki Ben",
                href: "/deneyim?mode=gelecek",
                desc: "20 yıl sonraki halinden gelmiş gibi mektup yaz.",
              },
            ].map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <p className="text-sm font-bold text-[#b83280]">
                  Deneyim modu
                </p>

                <h3 className="mt-2 text-2xl font-extrabold">{item.title}</h3>

                <p className="mt-3 text-sm leading-6 text-[#6b4b4b]">
                  {item.desc}
                </p>
              </a>
            ))}
          </div>
        </section>

        <section id="packages" className="py-16">
          <div className="rounded-[2rem] bg-white p-8 shadow-sm">
            <div className="mb-8 text-center">
              <p className="text-sm font-bold text-[#b83280]">Paketler</p>

              <h2 className="mt-2 text-4xl font-extrabold">
                Biz ürünü değil, notu ve fikri sunarız.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div className="rounded-3xl border border-[#f0d7df] bg-[#fffaf7] p-6">
                <p className="text-sm font-bold text-[#b83280]">Ücretsiz</p>
                <h3 className="mt-2 text-2xl font-extrabold">Hediye Fikri</h3>
                <p className="mt-3 text-sm leading-6 text-[#6b4b4b]">
                  Hediye önerileri ve arama linkleri.
                </p>
              </div>

              <div className="rounded-3xl border-2 border-[#b83280] bg-white p-6 shadow-md">
                <p className="text-sm font-bold text-[#b83280]">Premium</p>
                <h3 className="mt-2 text-2xl font-extrabold">Not Paketi</h3>
                <p className="mt-3 text-sm leading-6 text-[#6b4b4b]">
                  Kopyalanabilir, indirilebilir, yazdırılabilir kişisel notlar.
                </p>
              </div>

              <div className="rounded-3xl border border-[#f0d7df] bg-[#fffaf7] p-6">
                <p className="text-sm font-bold text-[#b83280]">Özel</p>
                <h3 className="mt-2 text-2xl font-extrabold">
                  Deneyim Paketi
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#6b4b4b]">
                  Hediye avı, Kader Bağları hikâyesi ve gizemli ipuçları.
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
