export type Relationship =
  | "Sevgilim"
  | "Annem"
  | "Babam"
  | "Arkadaşım"
  | "Kardeşim"
  | "Diğer";

export type Mood =
  | "Romantik"
  | "Duygusal"
  | "Komik"
  | "Minimal"
  | "Sürpriz"
  | "Lüks";

export type GiftIdea = {
  title: string;
  reason: string;
  searchQuery: string;
  tag: string;
};

export const relationships: Relationship[] = [
  "Sevgilim",
  "Annem",
  "Babam",
  "Arkadaşım",
  "Kardeşim",
  "Diğer",
];

export const moods: Mood[] = [
  "Romantik",
  "Duygusal",
  "Komik",
  "Minimal",
  "Sürpriz",
  "Lüks",
];

export function makeGiftIdeas(relationship: Relationship, mood: Mood): GiftIdea[] {
  const base: GiftIdea[] = [
    {
      title: "Kişiye özel mini anı kutusu",
      reason: "Fotoğraf, küçük notlar ve sembolik objelerle hediyeyi kişisel hale getirir.",
      searchQuery: "kişiye özel anı kutusu hediye",
      tag: "Kişisel",
    },
    {
      title: "QR kodlu özel not kartı",
      reason: "Hediyeyi sadece ürün olmaktan çıkarıp duygusal bir deneyime dönüştürür.",
      searchQuery: "özel tasarım hediye not kartı",
      tag: "Duygusal",
    },
    {
      title: "Deneyim hediyesi",
      reason: "Klasik ürün yerine birlikte yaşanacak bir anı bırakır.",
      searchQuery: "deneyim hediyesi",
      tag: "Anı",
    },
  ];

  if (relationship === "Sevgilim") {
    base.unshift({
      title: mood === "Komik" ? "İç şakalı çift kupası" : "Romantik fotoğraf albümü",
      reason:
        mood === "Komik"
          ? "Aranızdaki özel espriyi hediyeye dönüştürür."
          : "Birlikte yaşadığınız anıları kalıcı hale getirir.",
      searchQuery:
        mood === "Komik"
          ? "kişiye özel komik çift kupası"
          : "romantik fotoğraf albümü sevgiliye hediye",
      tag: mood,
    });
  }

  if (relationship === "Annem") {
    base.unshift({
      title: "Kişisel mesajlı takı veya çerçeve",
      reason: "Annen için hem manevi hem de saklanabilir bir hediye olur.",
      searchQuery: "anneye kişiye özel takı çerçeve hediye",
      tag: "Manevi",
    });
  }

  if (relationship === "Arkadaşım") {
    base.unshift({
      title: "Arkadaşa özel eğlenceli hediye seti",
      reason: "Hem kullanışlı hem de arkadaşlığınızı yansıtan eğlenceli bir seçenek olur.",
      searchQuery: "arkadaşa eğlenceli hediye seti",
      tag: "Eğlenceli",
    });
  }

  return base.slice(0, 4);
}

export function makeSpecialNotes(
  relationship: Relationship,
  mood: Mood,
  name: string,
  memory: string
) {
  const targetName = name.trim() || relationship.toLowerCase();
  const specialMemory = memory.trim();

  const memorySentence = specialMemory
    ? ` En sevdiğim şeylerden biri de "${specialMemory}" anımızı hatırlamak.`
    : "";

  const notes = [
    {
      id: "soft",
      title: "Sade ve içten not",
      text: `${targetName}, bu hediyeyi seçerken aklımda sadece sen vardın.${memorySentence} Umarım her baktığında seni düşündüğümü hissedersin.`,
    },
    {
      id: "emotional",
      title: "Duygusal not",
      text: `${targetName}, bazen bazı insanlar hayatımızda küçük değil, kocaman bir yer kaplar. Sen benim için öyle birisin.${memorySentence} Bu küçük hediye, sana verdiğim değerin minik bir hatırlatıcısı olsun.`,
    },
    {
      id: "funny",
      title: "Tatlı ve komik not",
      text: `${targetName}, hediyeyi seçerken çok düşündüm ve sonunda “tam senlik” dedim. Beğenmezsen de sorun yok, çünkü bu notu okudun ve artık duygusal olarak kabul etmiş sayılırsın.${memorySentence}`,
    },
  ];

  if (mood === "Romantik") {
    notes.unshift({
      id: "romantic",
      title: "Romantik not",
      text: `${targetName}, bazı hediyeler sadece paketlenmez; içine hisler de konur. Bu hediyenin içinde biraz heyecan, biraz özlem, biraz da sana bakınca hissettiğim o güzel şey var.${memorySentence}`,
    });
  }

  if (mood === "Minimal") {
    notes.unshift({
      id: "minimal",
      title: "Minimal not",
      text: `${targetName}, küçük bir hediye, büyük bir düşünce. Seni düşündüm, bu da onun küçük kanıtı.${memorySentence}`,
    });
  }

  return notes;
}

export function makeStory(
  relationship: Relationship,
  mood: Mood,
  name: string,
  memory: string
) {
  const targetName = name.trim() || relationship.toLowerCase();
  const specialMemory = memory.trim();

  return `Bir gün küçük bir hediye, sahibini bulmak için yola çıktı. Yol boyunca ona tek bir şey soruldu: "Kime gideceksin?" Hediye hiç düşünmeden "${targetName}" dedi. Çünkü onun gideceği kişi sıradan biri değildi; bazen bir gülüşüyle günü güzelleştiren, bazen de varlığıyla her şeyi daha anlamlı yapan biriydi.${
    specialMemory
      ? ` Hediye, yol boyunca "${specialMemory}" anısını da yanında taşıdı. Çünkü bazı anılar, hediyenin kendisinden bile daha değerlidir.`
      : ""
  } Sonunda hediye doğru kişiye ulaştı ve şunu fısıldadı: "Ben sadece bir eşya değilim; beni seçen kişinin seni düşündüğü bir anım."`;
}

export function makeRiddle(relationship: Relationship, name: string) {
  const targetName = name.trim() || relationship.toLowerCase();

  return {
    question: `${targetName} için saklanan bu hediye neyi anlatıyor?`,
    clues: [
      "Birinci ipucu: Bu hediye rastgele seçilmedi.",
      "İkinci ipucu: İçinde küçük bir düşünce, büyük bir anlam var.",
      "Üçüncü ipucu: Cevap hediyenin kendisinde değil, onu seçen kişinin niyetinde.",
    ],
    answer: "Cevap: Seni düşündüm ve bunu küçük bir sürprize dönüştürdüm.",
  };
}

export function makeStoreUrl(store: "google" | "trendyol" | "amazon" | "hepsiburada", query: string) {
  const encoded = encodeURIComponent(query);

  if (store === "trendyol") return `https://www.trendyol.com/sr?q=${encoded}`;
  if (store === "amazon") return `https://www.amazon.com.tr/s?k=${encoded}`;
  if (store === "hepsiburada") return `https://www.hepsiburada.com/ara?q=${encoded}`;

  return `https://www.google.com/search?q=${encoded}`;
}
