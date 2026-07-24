import type { Question } from "@/types/gift";

export const questions: Question[] = [
  {
    title: "Kime hediye alıyorsun?",
    options: [
      "Sevgilim",
      "Annem",
      "Babam",
      "Arkadaşım",
      "Kardeşim",
      "Öğretmenim",
      "İş arkadaşım",
      "Diğer",
    ],
  },
  {
    title: "Hediye alacağın kişi?",
    options: ["Kadın", "Erkek", "Fark etmez"],
  },
  {
    title: "Bütçen ne kadar?",
    options: ["0–250 TL", "250–500 TL", "500–1000 TL", "1000–2500 TL", "2500 TL+"],
  },
  {
    title: "Özel gün ne?",
    options: [
      "Doğum günü",
      "Yıl dönümü",
      "Sevgililer Günü",
      "Anneler Günü",
      "Babalar Günü",
      "Mezuniyet",
      "Yeni iş",
      "Öğretmenler Günü",
      "İçimden geldi",
    ],
  },
  {
    title: "İlgi alanları neler?",
    multiple: true,
    options: [
      "Kahve",
      "Kitap",
      "Makyaj",
      "Cilt bakımı",
      "Teknoloji",
      "Oyun",
      "Spor",
      "Moda",
      "Takı",
      "Ev dekorasyonu",
      "Seyahat",
      "Müzik",
    ],
  },
  {
    title: "Hediye tarzı nasıl olsun?",
    options: [
      "Romantik",
      "Komik",
      "Kullanışlı",
      "Duygusal",
      "Lüks",
      "Minimal",
      "Kişiye özel",
      "Deneyim hediyesi",
    ],
  },
  {
    title: "Ne kadar acil?",
    options: ["Bugün lazım", "1–2 gün içinde", "1 hafta içinde", "Zamanım var"],
  },
  {
    title: "Hediyede hangi risklerden kaçınalım?",
    multiple: true,
    options: [
      "Beden/numara riski olmasın",
      "Koku seçimi gerektirmesin",
      "Renk/ton seçimi gerektirmesin",
      "Kırılabilir olmasın",
      "Çok romantik olmasın",
      "Kişiye özel olmasın",
      "Son dakika alınabilir olsun",
      "Fark etmez",
    ],
  },
];
