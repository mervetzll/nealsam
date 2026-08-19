"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type SavedItem = Record<string, any>;

type TabKey = "premium" | "favorites" | "saved";

function formatDate(value?: string) {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleString("tr-TR");
  } catch {
    return value;
  }
}

function getTitle(item: SavedItem, fallback: string) {
  return (
    item.concept_title ||
    item.gift_name ||
    item.gift_title ||
    item.giftTitle ||
    item.title ||
    item.result_title ||
    item.name ||
    fallback
  );
}

function getSubtitle(item: SavedItem) {
  if (item.person_name || item.relation) {
    return `${item.person_name || ""}${item.relation ? " · " + item.relation : ""}`.trim();
  }

  if (item.category || item.sub_category || item.subCategory) {
    return `${item.category || ""} ${item.sub_category || item.subCategory || ""}`.trim();
  }

  if (item.price_min || item.price_max || item.priceMin || item.priceMax) {
    return `${item.price_min || item.priceMin || 0} TL - ${item.price_max || item.priceMax || 0} TL`;
  }

  return "";
}

function getDescription(item: SavedItem) {
  return (
    item.generated_text ||
    item.reason ||
    item.note ||
    item.summary ||
    item.result_summary ||
    item.description ||
    ""
  );
}

export default function KaydettiklerimClient() {
  const [premiumExperiences, setPremiumExperiences] = useState<SavedItem[]>([]);
  const [favoriteGifts, setFavoriteGifts] = useState<SavedItem[]>([]);
  const [savedGiftResults, setSavedGiftResults] = useState<SavedItem[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>("premium");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSavedItems();
  }, []);

  async function loadSavedItems() {
    setLoading(true);
    setMessage("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setMessage("Kaydettiklerini görmek için giriş yapmalısın.");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/my-saved-items", {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (!data?.ok) {
        setMessage(data?.error || "Kaydedilenler alınamadı.");
        return;
      }

      setPremiumExperiences(data.premiumExperiences || []);
      setFavoriteGifts(data.favoriteGifts || []);
      setSavedGiftResults(data.savedGiftResults || []);
    } catch {
      setMessage("Kaydedilenler alınamadı.");
    } finally {
      setLoading(false);
    }
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      alert("Metin kopyalandı.");
    } catch {
      alert("Kopyalanamadı. Metni elle seçip kopyalayabilirsin.");
    }
  }

  const tabs = useMemo(
    () => [
      {
        key: "premium" as const,
        label: "Premium Deneyimler",
        count: premiumExperiences.length,
      },
      {
        key: "favorites" as const,
        label: "Favori Hediyeler",
        count: favoriteGifts.length,
      },
      {
        key: "saved" as const,
        label: "Kaydedilen Öneriler",
        count: savedGiftResults.length,
      },
    ],
    [premiumExperiences.length, favoriteGifts.length, savedGiftResults.length]
  );

  const activeItems =
    activeTab === "premium"
      ? premiumExperiences
      : activeTab === "favorites"
        ? favoriteGifts
        : savedGiftResults;

  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 py-10 text-[#2b1b1b]">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
              Hesabım
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Kaydettiklerim
            </h1>

            <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-[#6b4a4a]">
              Premium deneyimlerini, favori hediyelerini ve kaydettiğin hediye
              önerilerini tek yerden görebilirsin.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/hediye-bul"
              className="rounded-full bg-pink-600 px-5 py-3 text-sm font-black text-white"
            >
              Hediye Bul
            </Link>

            <Link
              href="/deneyim"
              className="rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-black text-white"
            >
              Deneyim Oluştur
            </Link>

            <Link
              href="/hesabim"
              className="rounded-full border border-pink-200 bg-white px-5 py-3 text-sm font-black text-pink-700"
            >
              Hesabıma Dön
            </Link>
          </div>
        </div>

        {message && (
          <div className="mt-6 rounded-2xl border border-pink-100 bg-white p-5 text-sm font-black text-[#6b4a4a] shadow-sm">
            {message}
          </div>
        )}

        <div className="mt-8 grid gap-3 rounded-[2rem] border border-pink-100 bg-white p-3 shadow-sm md:grid-cols-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-[1.4rem] px-5 py-4 text-left transition ${
                activeTab === tab.key
                  ? "bg-[#2b1b1b] text-white"
                  : "bg-[#fff4ef] text-[#6b4a4a] hover:bg-[#fff0f7]"
              }`}
            >
              <p className="text-sm font-black">{tab.label}</p>
              <p className="mt-1 text-xs font-bold opacity-80">
                {tab.count} kayıt
              </p>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-8 rounded-[2rem] border border-pink-100 bg-white p-8 text-center shadow-sm">
            <p className="font-black text-[#2b1b1b]">Kaydedilenler yükleniyor...</p>
          </div>
        ) : activeItems.length === 0 ? (
          <EmptyState activeTab={activeTab} />
        ) : (
          <div className="mt-8 grid gap-5">
            {activeItems.map((item, index) => (
              <SavedCard
                key={item.id || index}
                item={item}
                index={index}
                activeTab={activeTab}
                onCopy={copyText}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function EmptyState({ activeTab }: { activeTab: TabKey }) {
  const text =
    activeTab === "premium"
      ? "Henüz kaydedilmiş premium deneyimin yok."
      : activeTab === "favorites"
        ? "Henüz favori hediyen yok."
        : "Henüz kaydedilmiş hediye önerin yok.";

  const href = activeTab === "premium" ? "/deneyim" : "/hediye-bul";
  const button = activeTab === "premium" ? "Deneyim Oluştur" : "Hediye Bul";

  return (
    <div className="mt-8 rounded-[2rem] border border-pink-100 bg-white p-8 text-center shadow-sm">
      <h2 className="text-2xl font-black text-[#2b1b1b]">{text}</h2>

      <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#6b4a4a]">
        Kaydettiğin içerikler burada görünecek.
      </p>

      <Link
        href={href}
        className="mt-6 inline-flex rounded-full bg-pink-600 px-6 py-4 text-sm font-black text-white"
      >
        {button}
      </Link>
    </div>
  );
}

function SavedCard({
  item,
  index,
  activeTab,
  onCopy,
}: {
  item: SavedItem;
  index: number;
  activeTab: TabKey;
  onCopy: (text: string) => void;
}) {
  const title = getTitle(item, `Kayıt ${index + 1}`);
  const subtitle = getSubtitle(item);
  const description = getDescription(item);

  return (
    <article className="rounded-[2rem] border border-pink-100 bg-white p-5 shadow-sm md:p-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[#fff0f7] px-4 py-2 text-xs font-black text-pink-700">
              {activeTab === "premium"
                ? item.concept_title || "Premium Deneyim"
                : activeTab === "favorites"
                  ? "Favori Hediye"
                  : "Kaydedilen Öneri"}
            </span>

            {item.tone && (
              <span className="rounded-full bg-[#fff4ef] px-4 py-2 text-xs font-black text-[#6b4a4a]">
                {item.tone}
              </span>
            )}
          </div>

          <h2 className="mt-4 text-2xl font-black text-[#2b1b1b]">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-2 text-sm font-semibold text-[#6b4a4a]">
              {subtitle}
            </p>
          )}

          <p className="mt-1 text-xs font-semibold text-[#8a6a6a]">
            Kaydedilme tarihi: {formatDate(item.created_at)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {activeTab === "premium" && item.id && (
            <Link
              href={`/deneyim/paylas/${item.id}`}
              className="rounded-full bg-pink-600 px-5 py-3 text-sm font-black text-white"
            >
              Kartı Aç / QR Oluştur
            </Link>
          )}

          {description && (
            <button
              onClick={() => onCopy(description)}
              className="rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-black text-white"
            >
              Metni Kopyala
            </button>
          )}

          <Link
            href={activeTab === "premium" ? "/deneyim" : "/hediye-bul"}
            className="rounded-full border border-pink-200 bg-white px-5 py-3 text-sm font-black text-pink-700"
          >
            Yeni Oluştur
          </Link>
        </div>
      </div>

      {description && (
        <pre className="mt-5 max-h-80 overflow-y-auto whitespace-pre-wrap rounded-[1.5rem] bg-[#fff4ef] p-5 text-sm font-semibold leading-7 text-[#2b1b1b]">
          {description}
        </pre>
      )}
    </article>
  );
}
