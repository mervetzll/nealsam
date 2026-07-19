"use client";

import Navbar from "@/components/Navbar";
import QRCode from "qrcode";
import { openGiftCardPrint, type GiftCardTheme } from "@/lib/giftCard";
import {
  PLAN_LIMITS,
  PLAN_NAMES,
  getUsedCount,
  normalizePlan,
  type PlanId,
} from "@/lib/plans";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const cardThemes: {
  id: GiftCardTheme;
  title: string;
}[] = [
  { id: "romantic", title: "Romantik" },
  { id: "minimal", title: "Minimal" },
  { id: "elegant", title: "Zarif" },
  { id: "fun", title: "Eğlenceli" },
  { id: "dark", title: "Premium" },
];

const planDetails: Record<
  PlanId,
  {
    qrLimit: string;
    renewalText: string;
    features: string[];
  }
> = {
  free: {
    qrLimit: "Sınırlı QR demo",
    renewalText: "Yenilenme yok",
    features: ["Temel hediye fikri", "Basit not önerisi", "İnternette arama linkleri"],
  },
  note: {
    qrLimit: "Ayda 30 QR mesaj",
    renewalText: "Her ay otomatik yenilenir",
    features: ["Premium notlar", "QR kodlu mesaj", "WhatsApp metni", "Kart olarak indir"],
  },
  experience: {
    qrLimit: "Ayda 20 QR mesaj",
    renewalText: "Her ay otomatik yenilenir",
    features: ["Hediye Avı", "Kader Bağları", "Gizemli Hediye", "Gelecekteki Ben"],
  },
  basic: {
    qrLimit: "Ayda 3 hediye hakkı",
    renewalText: "Tek seferlik veya aylık kullanılabilir",
    features: ["Mini hediye önerileri", "Kısa not önerisi", "Ürün arama yönlendirmesi"],
  },
  plus: {
    qrLimit: "Ayda 10 hediye hakkı",
    renewalText: "Tek seferlik veya aylık kullanılabilir",
    features: ["Detaylı hediye önerileri", "Kişisel not", "Sunum önerisi", "Alternatif fikirler"],
  },
  premium: {
    qrLimit: "Ayda 100 QR mesaj",
    renewalText: "Her ay otomatik yenilenir",
    features: ["Tüm not özellikleri", "Tüm deneyim özellikleri", "Premium kart tasarımı", "Basılabilir kart"],
  },
};

type DemoUser = {
  name: string;
  email: string;
  emailVerified?: boolean;
  createdAt: string;
};

type SavedContent = {
  id: number;
  mode: string;
  title: string;
  note: string;
  description: string;
  plan: string;
  createdAt: string;
  favorite?: boolean;
};

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState<DemoUser | null>(null);
  const [plan, setPlan] = useState<PlanId>("free");
  const [usedCount, setUsedCount] = useState(0);
  const [savedContents, setSavedContents] = useState<SavedContent[]>([]);
  const [qrMap, setQrMap] = useState<Record<number, string>>({});
  const [filter, setFilter] = useState<"all" | "favorite" | "not" | "experience">("all");
  const [savedCardTheme, setSavedCardTheme] = useState<GiftCardTheme>("romantic");

  useEffect(() => {
    const savedUser = localStorage.getItem("nealsam_user");
    const savedPlan = normalizePlan(localStorage.getItem("nealsam_plan"));

    if (!savedUser) {
      router.push("/giris");
      return;
    }

    const savedItems = JSON.parse(
      localStorage.getItem("nealsam_saved_contents") || "[]"
    );

    setUser(JSON.parse(savedUser));
    setPlan(savedPlan);
    setUsedCount(getUsedCount(savedPlan));
    setSavedContents(savedItems);
  }, [router]);

  const limit = PLAN_LIMITS[plan];
  const remaining = Math.max(limit - usedCount, 0);

  const filteredContents = useMemo(() => {
    if (filter === "favorite") {
      return savedContents.filter((item) => item.favorite);
    }

    if (filter === "not") {
      return savedContents.filter((item) => item.mode === "not");
    }

    if (filter === "experience") {
      return savedContents.filter((item) => item.mode !== "not");
    }

    return savedContents;
  }, [filter, savedContents]);

  function syncSavedContents(nextItems: SavedContent[]) {
    setSavedContents(nextItems);
    localStorage.setItem("nealsam_saved_contents", JSON.stringify(nextItems));
  }

  function logout() {
    localStorage.removeItem("nealsam_user");
    alert("Çıkış yapıldı.");
    router.push("/");
  }

  function cancelPlan() {
    localStorage.setItem("nealsam_plan", "free");
    setPlan("free");
    setUsedCount(getUsedCount("free"));
    alert("Demo abonelik iptal edildi. Ücretsiz plana döndün.");
  }

  function clearSavedContents() {
    localStorage.removeItem("nealsam_saved_contents");
    setSavedContents([]);
    setQrMap({});
    alert("Kayıtlı içerikler temizlendi.");
  }

  function deleteSavedContent(id: number) {
    const updated = savedContents.filter((item) => item.id !== id);
    syncSavedContents(updated);

    setQrMap((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }

  function toggleFavorite(id: number) {
    const updated = savedContents.map((item) =>
      item.id === id ? { ...item, favorite: !item.favorite } : item
    );

    syncSavedContents(updated);
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
    alert("Not kopyalandı.");
  }

  async function createQrForSaved(item: SavedContent) {
    const qrText = ["NeAlsam Kayıtlı Not", "", item.title, "", item.note].join("\n");

    const dataUrl = await QRCode.toDataURL(qrText, {
      width: 320,
      margin: 2,
    });

    setQrMap((prev) => ({
      ...prev,
      [item.id]: dataUrl,
    }));
  }

  function downloadSavedQr(item: SavedContent) {
    const dataUrl = qrMap[item.id];

    if (!dataUrl) return;

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `nealsam-kayitli-not-${item.id}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function downloadSavedCard(item: SavedContent) {
    openGiftCardPrint({
      title: item.title,
      note: item.note,
      qrDataUrl: qrMap[item.id],
      theme: savedCardTheme,
    });
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#fff7f3] text-[#2b1b1b]">
        <Navbar />
        <div className="mx-auto max-w-5xl px-6">Yönlendiriliyor...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff7f3] text-[#2b1b1b]">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="mb-4 inline-flex rounded-full bg-[#fff0f7] px-4 py-2 text-sm font-bold text-[#b83280]">
            Hesabım
          </p>

          <h1 className="text-4xl font-black">Merhaba, {user.name}</h1>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-[#fff7f3] p-5">
              <p className="text-sm font-bold text-[#b83280]">E-posta</p>
              <p className="mt-2 font-semibold">{user.email}</p>

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                  user.emailVerified
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {user.emailVerified ? "E-posta doğrulandı" : "E-posta doğrulanmadı"}
              </span>
            </div>

            <div className="rounded-2xl bg-[#fff7f3] p-5">
              <p className="text-sm font-bold text-[#b83280]">Aktif paket</p>
              <p className="mt-2 font-semibold">{PLAN_NAMES[plan]}</p>
            </div>

            <div className="rounded-2xl bg-[#fff7f3] p-5">
              <p className="text-sm font-bold text-[#b83280]">Kalan içerik hakkı</p>
              <p className="mt-2 text-2xl font-black">
                {remaining} / {limit}
              </p>
            </div>

            <div className="rounded-2xl bg-[#fff7f3] p-5">
              <p className="text-sm font-bold text-[#b83280]">QR hakkı</p>
              <p className="mt-2 font-semibold">{planDetails[plan].qrLimit}</p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-[#f0d7df] bg-[#fff0f7] p-6">
            <p className="text-sm font-bold text-[#b83280]">Kullanım hakların</p>

            <h2 className="mt-2 text-2xl font-black">{PLAN_NAMES[plan]}</h2>

            <p className="mt-2 text-sm leading-6 text-[#6b4b4b]">
              {planDetails[plan].renewalText}
            </p>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {planDetails[plan].features.map((feature) => (
                <div
                  key={feature}
                  className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold"
                >
                  ✓ {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/deneyim?mode=not"
              className="rounded-full bg-[#b83280] px-5 py-3 text-sm font-bold text-white"
            >
              Not oluştur
            </a>

            <a
              href="/paketler"
              className="rounded-full bg-[#fff0f7] px-5 py-3 text-sm font-bold text-[#b83280]"
            >
              Paketleri yönet
            </a>

            {plan !== "free" && (
              <button
                onClick={cancelPlan}
                className="rounded-full border border-[#e8c4d8] bg-white px-5 py-3 text-sm font-bold text-[#b83280]"
              >
                Aboneliği iptal et
              </button>
            )}

            <button
              onClick={logout}
              className="rounded-full border border-[#e8c4d8] bg-white px-5 py-3 text-sm font-bold text-[#b83280]"
            >
              Çıkış yap
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold text-[#b83280]">
                Kayıtlı içeriklerim
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Daha önce oluşturduğun notlar
              </h2>
            </div>

            {savedContents.length > 0 && (
              <button
                onClick={clearSavedContents}
                className="rounded-full border border-[#e8c4d8] bg-white px-5 py-3 text-sm font-bold text-[#b83280]"
              >
                Kayıtları temizle
              </button>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {[
              ["all", "Tümü"],
              ["favorite", "Favoriler"],
              ["not", "Notlar"],
              ["experience", "Deneyimler"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilter(value as typeof filter)}
                className={`rounded-full px-4 py-2 text-xs font-bold ${
                  filter === value
                    ? "bg-[#b83280] text-white"
                    : "bg-[#fff0f7] text-[#b83280]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-2xl bg-[#fff7f3] p-4">
            <p className="text-sm font-bold text-[#b83280]">
              Kayıtlı kart tasarımı
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {cardThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSavedCardTheme(theme.id)}
                  className={`rounded-full px-4 py-2 text-xs font-bold ${
                    savedCardTheme === theme.id
                      ? "bg-[#b83280] text-white"
                      : "bg-white text-[#b83280] ring-1 ring-[#e8c4d8]"
                  }`}
                >
                  {theme.title}
                </button>
              ))}
            </div>
          </div>

          {filteredContents.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-[#fff7f3] p-5 text-sm leading-6 text-[#6b4b4b]">
              Bu filtrede kayıtlı içerik yok.
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {filteredContents.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#f0d7df] bg-[#fff7f3] p-5"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-[#b83280]">
                        {item.mode} · {item.plan}
                      </p>

                      <h3 className="mt-1 text-xl font-black">{item.title}</h3>
                    </div>

                    <p className="text-xs font-bold text-[#8b6f6f]">
                      {new Date(item.createdAt).toLocaleDateString("tr-TR")}
                    </p>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#6b4b4b]">
                    {item.description}
                  </p>

                  <div className="mt-4 rounded-2xl bg-white p-4 text-sm leading-6">
                    “{item.note}”
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => copyText(item.note)}
                      className="rounded-full bg-[#b83280] px-4 py-2 text-xs font-bold text-white"
                    >
                      Notu kopyala
                    </button>

                    <button
                      onClick={() => createQrForSaved(item)}
                      className="rounded-full border border-[#e8c4d8] bg-white px-4 py-2 text-xs font-bold text-[#b83280]"
                    >
                      QR oluştur
                    </button>

                    {qrMap[item.id] && (
                      <button
                        onClick={() => downloadSavedQr(item)}
                        className="rounded-full border border-[#e8c4d8] bg-white px-4 py-2 text-xs font-bold text-[#b83280]"
                      >
                        QR indir
                      </button>
                    )}

                    <button
                      onClick={() => downloadSavedCard(item)}
                      className="rounded-full bg-[#2b1b1b] px-4 py-2 text-xs font-bold text-white"
                    >
                      Kart olarak indir
                    </button>

                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className={`rounded-full px-4 py-2 text-xs font-bold ${
                        item.favorite
                          ? "bg-[#b83280] text-white"
                          : "bg-white text-[#b83280] ring-1 ring-[#e8c4d8]"
                      }`}
                    >
                      {item.favorite ? "Favoride" : "Favoriye ekle"}
                    </button>

                    <button
                      onClick={() => deleteSavedContent(item.id)}
                      className="rounded-full border border-red-200 bg-white px-4 py-2 text-xs font-bold text-red-600"
                    >
                      Sil
                    </button>
                  </div>

                  {qrMap[item.id] && (
                    <img
                      src={qrMap[item.id]}
                      alt="Kayıtlı içerik QR"
                      className="mt-4 h-32 w-32 rounded-2xl border border-[#f0d7df] bg-white p-2"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 rounded-3xl bg-[#2b1b1b] p-6 text-white">
          <h2 className="text-2xl font-black">Güvenlik notu</h2>

          <p className="mt-3 text-sm leading-7 text-[#ffeaf3]">
            Bu demo sürümde kullanıcı ve paket bilgisi localStorage içinde
            tutulur. Gerçek yayına çıkarken kullanıcı bilgisi veritabanında,
            ödeme işlemleri ise güvenli ödeme altyapısında tutulmalıdır.
          </p>
        </div>
      </section>
    </main>
  );
}
