export type GiftTemplate = {
  name: string;
  category: string;
  subCategory: string;
  recipients: string[];
  interests: string[];
  styles: string[];
  occasions: string[];
  urgency: string[];
  riskLevel: "low" | "medium" | "high";
  reason: string;
  note: string;
};

export const giftTemplates: GiftTemplate[] = [
  {
    name: "Cilt bakım hediyesi",
    category: "Beauty",
    subCategory: "Cilt bakım ürünü",
    recipients: ["Sevgilim", "Annem", "Arkadaşım", "Kardeşim"],
    interests: ["Cilt bakımı", "Makyaj", "Moda"],
    styles: ["Kullanışlı", "Minimal", "Lüks"],
    occasions: ["Doğum günü", "Anneler Günü", "Sevgililer Günü", "İçimden geldi"],
    urgency: ["1–2 gün içinde", "1 hafta içinde"],
    riskLevel: "medium",
    reason:
      "Cilt bakımına ilgisi olan biri için günlük rutinde kullanabileceği, düşünülmüş ve şık bir hediye olur. Hassas ciltlerde ürün içeriği kontrol edilmelidir.",
    note: "Kendine ayırdığın bakım zamanları biraz daha güzel olsun diye seçtim.",
  },
  {
    name: "Organizer hediyesi",
    category: "Beauty",
    subCategory: "Organizer",
    recipients: ["Sevgilim", "Annem", "Arkadaşım", "Kardeşim"],
    interests: ["Makyaj", "Cilt bakımı", "Ev dekorasyonu"],
    styles: ["Kullanışlı", "Minimal"],
    occasions: ["Doğum günü", "Anneler Günü", "İçimden geldi"],
    urgency: ["Bugün lazım", "1–2 gün içinde", "1 hafta içinde"],
    riskLevel: "low",
    reason:
      "Makyaj veya bakım ürünleri kullanan biri için renk, beden veya cilt uyumu riski olmadan işe yarayan güvenli bir hediyedir.",
    note: "Sevdiğin ürünler daha düzenli ve güzel dursun diye düşündüm.",
  },
  {
    name: "Teknoloji hediyesi",
    category: "Teknoloji",
    subCategory: "Telefon aksesuarı",
    recipients: ["Sevgilim", "Babam", "Arkadaşım", "Kardeşim", "İş arkadaşım"],
    interests: ["Teknoloji", "Seyahat"],
    styles: ["Kullanışlı", "Minimal"],
    occasions: ["Doğum günü", "Yeni iş", "Babalar Günü", "İçimden geldi"],
    urgency: ["1–2 gün içinde", "1 hafta içinde"],
    riskLevel: "low",
    reason:
      "Teknoloji seven biri için günlük hayatta gerçekten kullanabileceği, pratik ve düşük riskli bir hediye seçeneğidir.",
    note: "Günlük hayatını biraz daha kolaylaştırsın diye seçtim.",
  },
  {
    name: "Takı hediyesi",
    category: "Takı",
    subCategory: "Aksesuar",
    recipients: ["Sevgilim", "Annem", "Arkadaşım"],
    interests: ["Takı", "Moda"],
    styles: ["Romantik", "Minimal", "Lüks"],
    occasions: ["Doğum günü", "Yıl dönümü", "Sevgililer Günü", "Anneler Günü"],
    urgency: ["1–2 gün içinde", "1 hafta içinde"],
    riskLevel: "medium",
    reason:
      "Takı ve zarif aksesuarları seven biri için anlamlı, şık ve uzun süre saklanabilecek bir hediye olur.",
    note: "Küçük ama hep yanında olacak zarif bir şey seçmek istedim.",
  },
  {
    name: "Kahve hediyesi",
    category: "Kahve",
    subCategory: "Kahve ekipmanı",
    recipients: ["Sevgilim", "Annem", "Babam", "Arkadaşım", "İş arkadaşım"],
    interests: ["Kahve"],
    styles: ["Kullanışlı", "Minimal"],
    occasions: ["Doğum günü", "İçimden geldi", "Yeni iş"],
    urgency: ["Bugün lazım", "1–2 gün içinde", "1 hafta içinde"],
    riskLevel: "low",
    reason:
      "Kahve seven biri için hem günlük kullanılabilir hem de sıcak ve düşünülmüş hissettiren güvenli bir hediye olur.",
    note: "Kahve keyfin biraz daha güzel olsun diye düşündüm.",
  },
  {
    name: "Deneyim hediyesi",
    category: "Deneyim",
    subCategory: "Etkinlik",
    recipients: ["Sevgilim", "Arkadaşım", "Kardeşim", "Annem"],
    interests: ["Müzik", "Seyahat", "Kahve", "Ev dekorasyonu"],
    styles: ["Deneyim hediyesi", "Romantik", "Duygusal"],
    occasions: ["Doğum günü", "Yıl dönümü", "Sevgililer Günü", "İçimden geldi"],
    urgency: ["1 hafta içinde", "Zamanım var"],
    riskLevel: "low",
    reason:
      "Eşya yerine birlikte hatırlanacak bir anı bırakmak isteyenler için daha özel ve duygusal bir hediye seçeneğidir.",
    note: "Bu kez hediye bir eşya değil, birlikte hatırlayacağımız güzel bir anı olsun istedim.",
  },
];
