"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useSearchParams } from "next/navigation";
import { noteThemes } from "@/data/noteThemes";
import { noteImageThemes } from "@/data/noteImageThemes";
import NoteDecorations from "@/components/NoteDecorations";

type Experience = {
  id: string;
  concept_key: string;
  concept_title: string;
  person_name: string | null;
  relation: string | null;
  gift_name: string | null;
  tone: string | null;
  generated_text: string;
  created_at: string;
};

type TemplateMode = "classic" | "image";

function getImageTextColor(templateId: string) {
  if (
    templateId.includes("sport") ||
    templateId.includes("gamer") ||
    templateId.includes("moon") ||
    templateId.includes("travel")
  ) {
    return "#1e293b";
  }

  if (
    templateId.includes("coffee") ||
    templateId.includes("cafe") ||
    templateId.includes("book")
  ) {
    return "#5a3524";
  }

  return "#2b1b1b";
}

export default function ShareExperienceClient({
  experienceId,
}: {
  experienceId: string;
}) {
  const searchParams = useSearchParams();

  const [experience, setExperience] = useState<Experience | null>(null);
  const [qrUrl, setQrUrl] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const cardRef = useRef<HTMLDivElement | null>(null);

  const [mode, setMode] = useState<TemplateMode>("image");

  const [themeId, setThemeId] = useState("pink-flowers");
  const [decorType, setDecorType] = useState("auto");
  const [decorColor, setDecorColor] = useState("#F472B6");

  const [templateId, setTemplateId] = useState("peach-blossom");
  const [textColor, setTextColor] = useState("");

  const selectedTheme = useMemo(() => {
    return noteThemes.find((theme) => theme.id === themeId) || noteThemes[0];
  }, [themeId]);

  const selectedTemplate = useMemo(() => {
    return (
      noteImageThemes.find((theme) => theme.id === templateId) ||
      noteImageThemes[0]
    );
  }, [templateId]);

  const groupedImageThemes = useMemo(() => {
    return {
      cute: noteImageThemes.filter((theme) => theme.category === "cute"),
      romantic: noteImageThemes.filter((theme) => theme.category === "romantic"),
      minimal: noteImageThemes.filter((theme) => theme.category === "minimal"),
      unisex: noteImageThemes.filter((theme) => theme.category === "unisex"),
    };
  }, []);

  useEffect(() => {
    const urlMode = searchParams.get("mode");
    const bg = searchParams.get("bg");
    const decor = searchParams.get("decor");
    const color = searchParams.get("color");
    const tpl = searchParams.get("tpl");
    const text = searchParams.get("text");

    if (urlMode === "classic" || urlMode === "image") {
      setMode(urlMode);
    }

    if (bg && noteThemes.some((theme) => theme.id === bg)) {
      setThemeId(bg);
    }

    if (decor) {
      setDecorType(decor);
    }

    if (color) {
      setDecorColor(`#${color.replace("#", "")}`);
    }

    if (tpl && noteImageThemes.some((theme) => theme.id === tpl)) {
      setTemplateId(tpl);
    }

    if (text) {
      setTextColor(`#${text.replace("#", "")}`);
    }
  }, [searchParams]);

  useEffect(() => {
    loadExperience();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienceId]);

  useEffect(() => {
    if (!experience) return;
    generateQr();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, themeId, decorType, decorColor, templateId, textColor, experience]);

  async function loadExperience() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/public-premium-experience/${experienceId}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!data?.ok) {
        setMessage(data?.error || "Deneyim bulunamadı.");
        return;
      }

      setExperience(data.experience);
    } catch {
      setMessage("Deneyim yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }

  async function generateQr() {
    const params = new URLSearchParams({
      mode,
    });

    if (mode === "image") {
      params.set("tpl", templateId);
    } else {
      params.set("bg", themeId);
      params.set("decor", decorType);
      params.set("color", decorColor.replace("#", ""));
    }

    if (textColor) {
      params.set("text", textColor.replace("#", ""));
    }

    const currentUrl = `${window.location.origin}/n/${experienceId}?${params.toString()}`;
    setShareUrl(currentUrl);

    try {
      const qrDataUrl = await QRCode.toDataURL(currentUrl, {
        width: 240,
        margin: 2,
      });

      setQrUrl(qrDataUrl);
    } catch {
      setQrUrl("");
    }
  }

  async function copyShareUrl() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Not linki kopyalandı.");
    } catch {
      alert("Link kopyalanamadı.");
    }
  }

  async function copyText() {
    if (!experience) return;

    try {
      await navigator.clipboard.writeText(experience.generated_text);
      alert("Not metni kopyalandı.");
    } catch {
      alert("Metin kopyalanamadı.");
    }
  }

  async function downloadPdf() {
    if (!cardRef.current) {
      alert("Kart hazırlanamadı.");
      return;
    }

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fff4ef",
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("hediye-notu.pdf");
    } catch {
      alert("PDF oluşturulamadı.");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fff4ef] px-5 py-10 text-[#2b1b1b]">
        <section className="mx-auto max-w-5xl">
          <div className="rounded-[2rem] border border-pink-100 bg-white p-8 text-center shadow-sm">
            <p className="font-black">Kart yükleniyor...</p>
          </div>
        </section>
      </main>
    );
  }

  if (message || !experience) {
    return (
      <main className="min-h-screen bg-[#fff4ef] px-5 py-10 text-[#2b1b1b]">
        <section className="mx-auto max-w-5xl">
          <div className="rounded-[2rem] border border-pink-100 bg-white p-8 text-center shadow-sm">
            <p className="font-black">{message || "Deneyim bulunamadı."}</p>
          </div>
        </section>
      </main>
    );
  }

  const finalTextColor =
    textColor || (mode === "image" ? getImageTextColor(templateId) : "");

  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 py-10 text-[#2b1b1b]">
      <section className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          {mode === "image" ? (
            <article
              ref={cardRef}
              className="relative mx-auto aspect-[4/5] w-full max-w-[620px] overflow-hidden rounded-[2rem] bg-cover bg-center shadow-2xl"
              style={{
                backgroundImage: `url(${selectedTemplate.image})`,
              }}
            >
              <div className="absolute inset-x-[12%] bottom-[13%] top-[23%] flex flex-col items-center justify-center text-center">
                <p
                  className="text-xs font-black uppercase tracking-[0.24em] opacity-80"
                  style={{ color: finalTextColor || undefined }}
                >
                  Özel Mesaj
                </p>

                <h1
                  className="mt-3 text-2xl font-black leading-tight md:text-3xl"
                  style={{ color: finalTextColor || undefined }}
                >
                  {experience.gift_name || "Sana Küçük Bir Sürprizim Var"}
                </h1>

                <p
                  className="mt-3 text-xs font-bold leading-6 md:text-sm"
                  style={{ color: finalTextColor || undefined }}
                >
                  {experience.person_name ? `İçin: ${experience.person_name}` : "Senin için"}
                  {experience.relation ? ` · ${experience.relation}` : ""}
                </p>

                <pre
                  className="mt-5 max-h-[56%] w-full overflow-y-auto whitespace-pre-wrap rounded-[1.4rem] bg-white/55 p-4 text-sm font-semibold leading-7 shadow-sm backdrop-blur-sm md:text-base"
                  style={{ color: finalTextColor || undefined }}
                >
                  {experience.generated_text}
                </pre>
              </div>
            </article>
          ) : (
            <article
              ref={cardRef}
              className={`relative mx-auto aspect-[4/5] w-full max-w-[620px] overflow-hidden rounded-[2rem] border border-white/60 p-8 shadow-2xl ${selectedTheme.cardClass}`}
            >
              <NoteDecorations
                variant={themeId}
                decorType={decorType}
                customColor={decorColor}
              />

              <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
                <p
                  className={`text-xs font-black uppercase tracking-[0.24em] ${selectedTheme.accentClass}`}
                  style={textColor ? { color: textColor } : undefined}
                >
                  Özel Mesaj
                </p>

                <h1
                  className={`mt-3 text-2xl font-black leading-tight md:text-3xl ${selectedTheme.accentClass}`}
                  style={textColor ? { color: textColor } : undefined}
                >
                  {experience.gift_name || "Sana Küçük Bir Sürprizim Var"}
                </h1>

                <p className="mt-3 text-xs font-bold leading-6 text-[#6b4a4a] md:text-sm">
                  {experience.person_name ? `İçin: ${experience.person_name}` : "Senin için"}
                  {experience.relation ? ` · ${experience.relation}` : ""}
                </p>

                <pre
                  className="mt-5 max-h-[56%] w-full overflow-y-auto whitespace-pre-wrap rounded-[1.4rem] bg-white/70 p-4 text-sm font-semibold leading-7 shadow-sm backdrop-blur-sm md:text-base"
                  style={textColor ? { color: textColor } : undefined}
                >
                  {experience.generated_text}
                </pre>
              </div>
            </article>
          )}

          <aside className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-[#2b1b1b]">
              Kart Tasarımı
            </h2>

            <p className="mt-2 text-sm font-semibold leading-6 text-[#6b4a4a]">
              Hazır illüstrasyonlu kart seçebilir veya eski klasik temaları kullanıp rengi/dekoru değiştirebilirsin.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 rounded-[1.5rem] bg-[#fff4ef] p-2">
              <button
                type="button"
                onClick={() => setMode("image")}
                className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                  mode === "image"
                    ? "bg-[#2b1b1b] text-white"
                    : "bg-white text-pink-700"
                }`}
              >
                Hazır Kartlar
              </button>

              <button
                type="button"
                onClick={() => setMode("classic")}
                className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                  mode === "classic"
                    ? "bg-[#2b1b1b] text-white"
                    : "bg-white text-pink-700"
                }`}
              >
                Klasik Temalar
              </button>
            </div>

            {mode === "image" ? (
              <div className="mt-5 grid gap-5">
                {[
                  ["cute", "Cute"],
                  ["romantic", "Romantik"],
                  ["minimal", "Minimal"],
                  ["unisex", "Unisex / Erkek"],
                ].map(([key, label]) => (
                  <div key={key}>
                    <p className="mb-2 text-xs font-black uppercase tracking-wide text-pink-600">
                      {label}
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      {groupedImageThemes[key as keyof typeof groupedImageThemes].map((theme) => (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => setTemplateId(theme.id)}
                          className={`overflow-hidden rounded-2xl border text-left transition ${
                            templateId === theme.id
                              ? "border-[#2b1b1b] shadow-md"
                              : "border-pink-100 hover:border-pink-300"
                          }`}
                        >
                          <div
                            className="aspect-[4/5] bg-cover bg-center"
                            style={{ backgroundImage: `url(${theme.image})` }}
                          />

                          <p className="bg-white px-3 py-2 text-xs font-black text-[#2b1b1b]">
                            {theme.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 grid gap-5">
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-wide text-pink-600">
                    Klasik Tema
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {noteThemes.map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setThemeId(theme.id)}
                        className={`rounded-2xl border p-3 text-left transition ${
                          themeId === theme.id
                            ? "border-[#2b1b1b] bg-[#fff0f7] shadow-sm"
                            : "border-pink-100 bg-white hover:bg-pink-50"
                        }`}
                      >
                        <div className={`h-16 rounded-xl ${theme.cardClass}`} />
                        <p className="mt-2 text-sm font-black text-[#2b1b1b]">
                          {theme.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.5rem] bg-[#fff4ef] p-5">
                  <h3 className="text-sm font-black text-[#2b1b1b]">
                    Klasik Tasarımı Özelleştir
                  </h3>

                  <div className="mt-4 grid gap-4">
                    <label className="grid gap-2 text-xs font-black text-[#6b4a4a]">
                      Dekor Tipi
                      <select
                        value={decorType}
                        onChange={(event) => setDecorType(event.target.value)}
                        className="rounded-2xl border border-pink-100 bg-white px-4 py-3 text-sm font-bold text-[#2b1b1b] outline-none"
                      >
                        <option value="auto">Temaya göre otomatik</option>
                        <option value="flower">Çiçek</option>
                        <option value="heart">Kalp</option>
                        <option value="bow">Kurdele</option>
                        <option value="sparkle">Yıldız / Işıltı</option>
                        <option value="wave">Dalga</option>
                        <option value="geometric">Geometrik</option>
                        <option value="tech">Tech</option>
                        <option value="minimal">Minimal</option>
                      </select>
                    </label>

                    <label className="grid gap-2 text-xs font-black text-[#6b4a4a]">
                      Dekor Rengi
                      <input
                        type="color"
                        value={decorColor}
                        onChange={(event) => setDecorColor(event.target.value)}
                        className="h-12 w-full cursor-pointer rounded-2xl border border-pink-100 bg-white p-1"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 rounded-[1.5rem] bg-[#fff4ef] p-5">
              <h3 className="text-sm font-black text-[#2b1b1b]">
                Yazı Rengi
              </h3>

              <div className="mt-3 grid grid-cols-[1fr_auto] gap-3">
                <input
                  type="color"
                  value={textColor || (mode === "image" ? getImageTextColor(templateId) : "#2b1b1b")}
                  onChange={(event) => setTextColor(event.target.value)}
                  className="h-12 w-full cursor-pointer rounded-2xl border border-pink-100 bg-white p-1"
                />

                <button
                  type="button"
                  onClick={() => setTextColor("")}
                  className="rounded-2xl border border-pink-200 bg-white px-4 text-xs font-black text-pink-700"
                >
                  Sıfırla
                </button>
              </div>
            </div>

            <div className="mt-6 rounded-[1.5rem] bg-[#fff4ef] p-5">
              <p className="text-sm font-black text-pink-700">QR Kod</p>

              {qrUrl && (
                <img
                  src={qrUrl}
                  alt="QR kod"
                  className="mx-auto mt-4 rounded-2xl border border-pink-100 bg-white p-3"
                />
              )}

              <p className="mt-4 break-all rounded-2xl bg-white p-3 text-xs font-semibold leading-6 text-[#6b4a4a]">
                {shareUrl}
              </p>

              <div className="mt-4 grid gap-3">
                <button
                  onClick={copyShareUrl}
                  className="rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-black text-white"
                >
                  Not Linkini Kopyala
                </button>

                <button
                  onClick={copyText}
                  className="rounded-full bg-pink-600 px-5 py-3 text-sm font-black text-white"
                >
                  Metni Kopyala
                </button>

                <button
                  onClick={downloadPdf}
                  className="rounded-full border border-pink-200 bg-white px-5 py-3 text-sm font-black text-pink-700"
                >
                  PDF Olarak İndir
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
