"use client";

import Navbar from "@/components/Navbar";
import { getSmartStoreLinks, makeSmartStoreUrl } from "@/utils/storeRouter";

import { useMemo, useState } from "react";
import { gifts } from "@/data/gifts";
import { questions } from "@/data/questions";
import {
  getGiftResults,
  getPriceText,
  getRiskLabel,
  makeSearchUrl,
  getSpecialStoreLinks,
  makeSpecialStoreUrl,
} from "@/utils/giftAlgorithm";


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



const occasionOptionsByRecipient: Record<string, string[]> = {
  Sevgilim: [
    "Doğum günü",
    "Yıl dönümü",
    "Sevgililer Günü",
    "Yılbaşı",
    "Bayram",
    "Mezuniyet",
    "Yeni iş",
    "Tebrik etmek için",
    "Moral vermek için",
    "İçimden geldi",
  ],

  Annem: [
    "Doğum günü",
    "Anneler Günü",
    "Yılbaşı",
    "Bayram",
    "Teşekkür etmek için",
    "Geçmiş olsun",
    "Tebrik etmek için",
    "Moral vermek için",
    "Ev ziyareti",
    "Yeni ev",
    "Mezuniyet",
    "Yeni iş",
    "İçimden geldi",
  ],

  Babam: [
    "Doğum günü",
    "Babalar Günü",
    "Yılbaşı",
    "Bayram",
    "Teşekkür etmek için",
    "Geçmiş olsun",
    "Tebrik etmek için",
    "Moral vermek için",
    "Ev ziyareti",
    "Yeni ev",
    "Mezuniyet",
    "Yeni iş",
    "İçimden geldi",
  ],

  Arkadaşım: [
    "Doğum günü",
    "Yılbaşı",
    "Bayram",
    "Mezuniyet",
    "Yeni iş",
    "Tebrik etmek için",
    "Moral vermek için",
    "Geçmiş olsun",
    "Ev ziyareti",
    "Yeni ev",
    "Terfi",
    "İçimden geldi",
  ],

  Kardeşim: [
    "Doğum günü",
    "Yılbaşı",
    "Bayram",
    "Mezuniyet",
    "Yeni iş",
    "Tebrik etmek için",
    "Moral vermek için",
    "Geçmiş olsun",
    "İçimden geldi",
  ],

  Öğretmenim: [
    "Öğretmenler Günü",
    "Doğum günü",
    "Yılbaşı",
    "Bayram",
    "Teşekkür etmek için",
    "Mezuniyet",
    "Tebrik etmek için",
    "İçimden geldi",
  ],

  "İş arkadaşım": [
    "Doğum günü",
    "Yılbaşı",
    "Bayram",
    "Yeni iş",
    "Terfi",
    "Tebrik etmek için",
    "Teşekkür etmek için",
    "Moral vermek için",
    "Geçmiş olsun",
    "İçimden geldi",
  ],

  Diğer: [
    "Doğum günü",
    "Yılbaşı",
    "Bayram",
    "Mezuniyet",
    "Yeni iş",
    "Teşekkür etmek için",
    "Geçmiş olsun",
    "Tebrik etmek için",
    "Moral vermek için",
    "Ev ziyareti",
    "Yeni ev",
    "Terfi",
    "İçimden geldi",
  ],
};

export default function Home() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[][]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [blockedTitles, setBlockedTitles] = useState<string[]>([]);
  const [favoriteTitles, setFavoriteTitles] = useState<string[]>([]);

  const currentQuestion = questions[step];

  function getVisibleOptions() {
    if (step === 2) {
      const selectedRecipient = answers[0]?.[0];

      if (!selectedRecipient) {
        return currentQuestion.options;
      }

      const relatedOccasions = occasionOptionsByRecipient[selectedRecipient];

      if (!relatedOccasions) {
        return currentQuestion.options;
      }

      return currentQuestion.options.filter((option) =>
        relatedOccasions.includes(option)
      );
    }

    if (step === 6) {
      const selectedInterests = answers[3] || [];

      if (selectedInterests.length === 0) {
        return ["Son dakika uygun olsun", "Fark etmez"];
      }

      const optionSet = new Set<string>();

      selectedInterests.forEach((interest) => {
        const relatedOptions = avoidOptionsByInterest[interest] || [];
        relatedOptions.forEach((option) => optionSet.add(option));
      });

      optionSet.add("Son dakika uygun olsun");
      optionSet.add("Fark etmez");

      return currentQuestion.options.filter((option) => optionSet.has(option));
    }

    return currentQuestion.options;
  }

  const visibleOptions = getVisibleOptions();



  const results = useMemo(
    () => getGiftResults(answers, blockedTitles),
    [answers, blockedTitles]
  );

  function handleSingleAnswer(option: string) {
    const newAnswers = answers.slice(0, step);
    newAnswers[step] = [option];

    setAnswers(newAnswers);

    if (step === questions.length - 1) {
      setShowResults(true);
    } else {
      setStep(step + 1);
      setSelectedOptions([]);
    }
  }

  function toggleMultipleOption(option: string) {
    if (option === "Fark etmez") {
      setSelectedOptions(["Fark etmez"]);
      return;
    }

    const withoutNoMatter = selectedOptions.filter(
      (item) => item !== "Fark etmez"
    );

    if (withoutNoMatter.includes(option)) {
      setSelectedOptions(withoutNoMatter.filter((item) => item !== option));
    } else {
      setSelectedOptions([...withoutNoMatter, option]);
    }
  }

  function goNextFromMultiple() {
    if (selectedOptions.length === 0) {
      alert("En az bir seçenek seçmelisin.");
      return;
    }

    const newAnswers = answers.slice(0, step);
    newAnswers[step] = selectedOptions;

    setAnswers(newAnswers);

    if (step === questions.length - 1) {
      setShowResults(true);
    } else {
      setStep(step + 1);
      setSelectedOptions([]);
    }
  }

  function goBack() {
    if (step === 0) return;

    const previousStep = step - 1;
    setStep(previousStep);

    const previousAnswer = answers[previousStep] || [];
    setSelectedOptions(previousAnswer);
  }

  function resetQuiz() {
    setStep(0);
    setAnswers([]);
    setSelectedOptions([]);
    setShowResults(false);
    setBlockedTitles([]);
    setFavoriteTitles([]);
  }

  function startQuiz() {
    resetQuiz();

    setTimeout(() => {
      document.getElementById("quiz")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 50);
  }

  function scrollToPopular() {
    document.getElementById("popular")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  function removeGift(title: string) {
    setBlockedTitles((prev) => [...prev, title]);
  }

  function toggleFavorite(title: string) {
    setFavoriteTitles((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  }

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
              <button
                onClick={startQuiz}
                className="rounded-full bg-[#b83280] px-8 py-4 text-base font-bold text-white shadow-lg"
              >
                Hediye Bulmaya Başla
              </button>

              <a
                href="/deneyim"
                className="rounded-full border border-[#e8c4d8] bg-white px-8 py-4 text-base font-bold text-[#b83280]"
              >
                Deneyim Modu Seç
              </a>

              <button
                onClick={scrollToPopular}
                className="rounded-full border border-[#e8c4d8] bg-white px-8 py-4 text-base font-bold text-[#b83280]"
              >
                Popüler Hediyeler
              </button>
            </div>

            <p className="mt-6 text-sm text-[#8b6f6f]">
              Ürün yönlendirme · Kişisel not · Hediye deneyimi
            </p>

            {answers.flat().length > 0 && (
              <div className="mt-8 rounded-3xl bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-[#b83280]">Seçimlerin</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {answers.flat().map((answer) => (
                    <span
                      key={answer}
                      className="rounded-full bg-[#fff0f7] px-3 py-2 text-sm font-semibold text-[#6b4b4b]"
                    >
                      {answer}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div id="quiz" className="rounded-[2rem] bg-white p-6 shadow-2xl">
            {!showResults ? (
              <div className="rounded-[1.5rem] bg-[#fff0f7] p-6">
                <p className="text-sm font-bold text-[#b83280]">
                  Soru {step + 1} / {questions.length}
                </p>

                <h2 className="mt-3 text-3xl font-extrabold">
                  {currentQuestion.title}
                </h2>

                {currentQuestion.multiple && (
                  <p className="mt-2 text-sm font-medium text-[#8b6f6f]">
                    Birden fazla seçenek seçebilirsin.
                  </p>
                )}

                <div className="mt-6 grid gap-3">
                  {visibleOptions.map((option) => {
                    const isSelected = selectedOptions.includes(option);

                    return (
                      <button
                        key={option}
                        onClick={() =>
                          currentQuestion.multiple
                            ? toggleMultipleOption(option)
                            : handleSingleAnswer(option)
                        }
                        className={`rounded-2xl px-5 py-4 text-left font-semibold shadow-sm transition ${
                          isSelected
                            ? "bg-[#b83280] text-white"
                            : "bg-white text-[#2b1b1b] hover:bg-[#b83280] hover:text-white"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {currentQuestion.multiple && (
                  <button
                    onClick={goNextFromMultiple}
                    className="mt-5 w-full rounded-full bg-[#b83280] px-6 py-4 font-bold text-white"
                  >
                    Devam et
                  </button>
                )}

                {step > 0 && (
                  <button
                    onClick={goBack}
                    className="mt-5 text-sm font-bold text-[#b83280]"
                  >
                    ← Geri dön
                  </button>
                )}
              </div>
            ) : (
              <div className="rounded-[1.5rem] bg-[#fff0f7] p-6">
                <p className="text-sm font-bold text-[#b83280]">
                  Sana özel sonuçlar
                </p>

                <h2 className="mt-3 text-3xl font-extrabold">
                  En uygun 10 hediye
                </h2>

                {results.length === 0 ? (
                  <div className="mt-6 rounded-2xl bg-white p-6">
                    <h3 className="text-xl font-extrabold">
                      Bu seçimlere uygun hediye kalmadı.
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-[#6b4b4b]">
                      Çok fazla filtre seçilmiş olabilir. Yeniden deneyebilir
                      veya bazı “istemiyorum” seçeneklerini azaltabilirsin.
                    </p>

                    <button
                      onClick={resetQuiz}
                      className="mt-5 rounded-full bg-[#b83280] px-6 py-3 text-sm font-bold text-white"
                    >
                      Yeniden hediye bul
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 grid max-h-[70vh] gap-4 overflow-y-auto pr-2">
                    {results.map((gift, index) => (
                      <div key={gift.title} className="rounded-2xl bg-white p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="mb-2 inline-flex rounded-full bg-[#b83280] px-3 py-1 text-xs font-bold text-white">
                              %{gift.matchPercent} uygun
                            </p>

                            <h3 className="text-xl font-extrabold">
                              {index + 1}. {gift.title}
                            </h3>
                          </div>

                          <span className="rounded-full bg-[#fff0f7] px-3 py-1 text-xs font-bold text-[#b83280]">
                            {getPriceText(gift)}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-[#fff7f3] px-3 py-1 text-xs font-bold text-[#b83280]">
                            {gift.category}
                          </span>

                          <span className="rounded-full bg-[#fff7f3] px-3 py-1 text-xs font-bold text-[#b83280]">
                            {gift.subCategory}
                          </span>

                          <span className="rounded-full bg-[#fff7f3] px-3 py-1 text-xs font-bold text-[#b83280]">
                            {getRiskLabel(gift.riskLevel)}
                          </span>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-[#6b4b4b]">
                          {gift.reason}
                        </p>

                        <div className="mt-4 rounded-xl bg-[#fff7f3] p-3">
                          <p className="text-xs font-bold text-[#b83280]">
                            Hediye notu
                          </p>

                          <p className="mt-1 text-sm text-[#6b4b4b]">
                            “{gift.note}”
                          </p>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {[...gift.interests, ...gift.styles]
                            .slice(0, 5)
                            .map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-[#fff0f7] px-3 py-1 text-xs font-semibold text-[#b83280]"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>

                        <div className="mt-5 grid gap-2 sm:grid-cols-4">
                          <a
                            href={makeSearchUrl("google", gift.searchQuery)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-[#b83280] px-4 py-3 text-center text-sm font-bold text-white"
                          >
                            Google
                          </a>

                          <a
                            href={makeSearchUrl("trendyol", gift.searchQuery)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-white px-4 py-3 text-center text-sm font-bold text-[#b83280]"
                          >
                            Trendyol
                          </a>

                          <a
                            href={makeSearchUrl("amazon", gift.searchQuery)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-white px-4 py-3 text-center text-sm font-bold text-[#b83280]"
                          >
                            Amazon
                          </a>

                          <a
                            href={makeSearchUrl("hepsiburada", gift.searchQuery)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-white px-4 py-3 text-center text-sm font-bold text-[#b83280]"
                          >
                            Hepsiburada
                          </a>

                          {getSmartStoreLinks(gift).length > 0 && (
                            <div className="mt-4 rounded-2xl bg-[#fff7f3] p-4">
                              <p className="mb-3 text-sm font-extrabold text-[#2b1b1b]">
                                En iyi mağazalar
                              </p>

                              <div className="flex flex-wrap gap-2">
                                {getSmartStoreLinks(gift).map((store) => (
                                  <a
                                    key={store.platform}
                                    href={makeSmartStoreUrl(
                                      store.platform,
                                      store.query
                                    )}
                                    target="_blank"
                                    rel="noreferrer"
                                    title={store.reason}
                                    className="rounded-full border border-[#e8c4d8] bg-white px-4 py-2 text-xs font-bold text-[#b83280] transition hover:bg-[#fff0f7]"
                                  >
                                    {store.label}
                                  </a>
                                ))}
                              </div>

                              <p className="mt-3 text-xs leading-5 text-[#8b6f6f]">
                                Bu mağazalar hediye türüne göre otomatik seçilir.
                              </p>
                            </div>
                          )}

                        </div>

                        <div className="mt-3 grid gap-2 sm:grid-cols-5">
                          <a
                            href={makeSearchUrl(
                              "google",
                              `ucuz ${gift.searchQuery}`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full border border-[#e8c4d8] px-4 py-3 text-center text-xs font-bold text-[#b83280]"
                          >
                            Daha ucuz ara
                          </a>

                          <a
                            href={makeSearchUrl(
                              "google",
                              `kişiye özel ${gift.searchQuery}`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full border border-[#e8c4d8] px-4 py-3 text-center text-xs font-bold text-[#b83280]"
                          >
                            Daha özel ara
                          </a>

                          <button
                            onClick={() => toggleFavorite(gift.title)}
                            className={`rounded-full border px-4 py-3 text-xs font-bold ${
                              favoriteTitles.includes(gift.title)
                                ? "border-[#b83280] bg-[#b83280] text-white"
                                : "border-[#e8c4d8] text-[#b83280]"
                            }`}
                          >
                            {favoriteTitles.includes(gift.title)
                              ? "Favoride"
                              : "Favoriye ekle"}
                          </button>

                          <button
                            onClick={() => removeGift(gift.title)}
                            className="rounded-full border border-[#e8c4d8] px-4 py-3 text-xs font-bold text-[#b83280]"
                          >
                            Bunu istemiyorum
                          </button>

                          <a
                            href={`/deneyim?mode=not&gift=${encodeURIComponent(
                              gift.title
                            )}`}
                            className="rounded-full bg-[#b83280] px-4 py-3 text-center text-xs font-bold text-white"
                          >
                            Bu hediyeye not oluştur
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {favoriteTitles.length > 0 && (
                  <div className="mt-6 rounded-2xl bg-white p-5">
                    <p className="text-sm font-bold text-[#b83280]">
                      Seçtiğin favoriler
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {favoriteTitles.map((title) => (
                        <span
                          key={title}
                          className="rounded-full bg-[#fff0f7] px-3 py-2 text-xs font-bold text-[#b83280]"
                        >
                          {title}
                        </span>
                      ))}
                    </div>

                    <p className="mt-3 text-xs leading-5 text-[#6b4b4b]">
                      Bu favoriler arasından birini seçip yanına özel not
                      oluşturabilirsin.
                    </p>
                  </div>
                )}

                <button
                  onClick={resetQuiz}
                  className="mt-6 w-full rounded-full bg-white px-6 py-4 font-bold text-[#b83280]"
                >
                  Yeniden hediye bul
                </button>
              </div>
            )}
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
                NeAlsam, kullanıcıyı internetteki ürünlere yönlendirir. Asıl farkı
                ise hediyenin yanına koyulacak notu, hikâyeyi ve sunum fikrini
                kişiselleştirmesidir.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-4">
              <div className="rounded-3xl bg-[#fff7f3] p-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#b83280] text-lg font-extrabold text-white">
                  1
                </div>

                <h3 className="text-xl font-extrabold">
                  Kişiyi anlat
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#6b4b4b]">
                  Kime hediye alınacağını, bütçeyi, özel günü ve kişinin tarzını
                  seçersin.
                </p>
              </div>

              <div className="rounded-3xl bg-[#fff7f3] p-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#b83280] text-lg font-extrabold text-white">
                  2
                </div>

                <h3 className="text-xl font-extrabold">
                  Fikirleri gör
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#6b4b4b]">
                  Sistem sana uygun hediye fikirleri ve Google, Trendyol, Amazon,
                  Hepsiburada arama linkleri verir.
                </p>
              </div>

              <div className="rounded-3xl bg-[#fff7f3] p-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#b83280] text-lg font-extrabold text-white">
                  3
                </div>

                <h3 className="text-xl font-extrabold">
                  Notu oluştur
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#6b4b4b]">
                  Hediyenin yanına koyacağın kişisel not, mektup, hikâye veya
                  bilmece metni hazırlanır.
                </p>
              </div>

              <div className="rounded-3xl bg-[#fff7f3] p-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#b83280] text-lg font-extrabold text-white">
                  4
                </div>

                <h3 className="text-xl font-extrabold">
                  Sen satın al
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#6b4b4b]">
                  Ürünü dış siteden sen alırsın. NeAlsam sadece fikri, notu ve
                  deneyimi hazırlar.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="popular" className="py-16">
          <div className="mb-8">
            <p className="text-sm font-bold text-[#b83280]">
              Popüler Hediyeler
            </p>

            <h2 className="mt-2 text-4xl font-extrabold">
              En çok önerilen hediye fikirleri
            </h2>

            <p className="mt-3 max-w-2xl text-[#6b4b4b]">
              Kararsız kaldıysan, farklı kişilere uygun en sevilen hediye
              fikirlerinden başlayabilirsin.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {gifts.slice(0, 6).map((gift) => (
              <div key={gift.title} className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-[#b83280]">
                  {gift.category} · {getPriceText(gift)}
                </p>

                <h3 className="mt-2 text-xl font-extrabold">{gift.title}</h3>

                <p className="mt-3 text-sm leading-6 text-[#6b4b4b]">
                  {gift.reason}
                </p>

                <a
                  href={makeSearchUrl("google", gift.searchQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-block rounded-full bg-[#b83280] px-5 py-3 text-sm font-bold text-white"
                >
                  Benzer ürünleri gör
                </a>
              </div>
            ))}
          </div>
        </section>

        <section id="blog" className="py-16">
          <div className="rounded-[2rem] bg-white p-8 shadow-sm">
            <p className="text-sm font-bold text-[#b83280]">Blog fikirleri</p>

            <h2 className="mt-2 text-3xl font-extrabold">
              Yakında hediye rehberleri de burada olacak
            </h2>

            <p className="mt-3 text-[#6b4b4b]">
              Erkek arkadaşa hediye, anneye doğum günü hediyesi, 500 TL altı
              hediye fikirleri gibi Google’dan trafik getirecek yazıları sonra
              ekleyeceğiz.
            </p>
          </div>
        </section>
              </section>
    </main>
  );
}
