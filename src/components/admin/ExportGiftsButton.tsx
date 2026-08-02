"use client";

type Gift = {
  title: string;
  category: string;
  subCategory?: string;
  priceMin?: number;
  priceMax?: number;
  recipients?: string[];
  interests?: string[];
  styles?: string[];
  occasions?: string[];
  urgency?: string[];
  riskLevel?: string;
  reason?: string;
  note?: string;
  searchQuery?: string;
  isActive?: boolean;
};

function clean(value: unknown) {
  if (Array.isArray(value)) return `"${value.join(", ").replaceAll('"', '""')}"`;
  if (typeof value === "string") return `"${value.replaceAll('"', '""')}"`;
  if (typeof value === "boolean") return value ? "Aktif" : "Pasif";
  if (value === null || value === undefined) return "";
  return String(value);
}

export default function ExportGiftsButton({ gifts }: { gifts: Gift[] }) {
  function exportCsv() {
    const headers = [
      "Hediye Adı",
      "Kategori",
      "Alt Kategori",
      "Min Fiyat",
      "Max Fiyat",
      "Alıcılar",
      "İlgi Alanları",
      "Tarzlar",
      "Özel Günler",
      "Aciliyet",
      "Risk",
      "Neden Uygun",
      "Not",
      "Arama Kelimesi",
      "Durum",
    ];

    const rows = gifts.map((gift) => [
      gift.title,
      gift.category,
      gift.subCategory,
      gift.priceMin,
      gift.priceMax,
      gift.recipients,
      gift.interests,
      gift.styles,
      gift.occasions,
      gift.urgency,
      gift.riskLevel,
      gift.reason,
      gift.note,
      gift.searchQuery,
      gift.isActive !== false,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(clean).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `nealsam-hediyeler-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={exportCsv}
      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
    >
      CSV Dışa Aktar
    </button>
  );
}
