export type PremiumConcept = {
  id: string;
  title: string;
  badge: string;
  description: string;
  bestFor: string[];
  sample: string;
  premiumLevel: string;
};

export function getFallbackConcepts(): PremiumConcept[] {
  return [
    {
      id: "kader-bagi",
      title: "Kader Bağı",
      badge: "Duygusal",
      description: "Hediyeyi anlamlı ve duygusal bir mesaja dönüştürür.",
      bestFor: ["Sevgili", "Eş", "Yakın arkadaş", "Aile"],
      sample: "Bu hediye sadece bir eşya değil, aramızdaki bağın küçük bir hatırası.",
      premiumLevel: "plus",
    },
    {
      id: "hediye-avi",
      title: "Hediye Avı",
      badge: "Oyunlu",
      description: "Hediyeyi adım adım ipuçlarıyla bulunan mini bir sürpriz oyununa dönüştürür.",
      bestFor: ["Arkadaş", "Kardeş", "Sevgili", "Eğlenceli ilişkiler"],
      sample: "QR kodu okut, ipuçlarını takip et ve hediyeye ulaş.",
      premiumLevel: "experience",
    },
    {
      id: "ani-kutusu",
      title: "Anı Kutusu",
      badge: "Nostaljik",
      description: "Hediyeyi ortak anılarla bağlayan özel bir not oluşturur.",
      bestFor: ["Aile", "Yakın arkadaş", "Mezuniyet"],
      sample: "Bu hediye bana birlikte yaşadığımız güzel anları hatırlattı.",
      premiumLevel: "plus",
    },
    {
      id: "gizli-mesaj",
      title: "Gizli Mesaj",
      badge: "Sürpriz",
      description: "QR ile açılan daha gizemli ve özel bir mesaj hazırlar.",
      bestFor: ["Sevgili", "Uzakta olan biri", "Sürpriz hediye"],
      sample: "Küçük bir sürprizin ardından sana söylemek istediğim bir şey var.",
      premiumLevel: "premium",
    },
    {
      id: "karakterine-gore",
      title: "Karakterine Göre",
      badge: "Kişisel",
      description: "Kişinin tarzına göre özel ve samimi bir not yazar.",
      bestFor: ["Herkes"],
      sample: "Bunu seçtim çünkü tam senlik olduğunu düşündüm.",
      premiumLevel: "plus",
    },
  ];
}

function getHuntStyleText(style: string) {
  if (style === "funny") return "tatlı ve eğlenceli";
  if (style === "romantic") return "romantik ve merak uyandıran";
  if (style === "mysterious") return "gizemli ve heyecanlı";
  if (style === "cute") return "sevimli ve yumuşak";
  return "sürprizli ve keyifli";
}

function getDifficultyText(difficulty: string) {
  if (difficulty === "easy") return "kolay";
  if (difficulty === "hard") return "zorlayıcı";
  return "orta zorlukta";
}

function buildHuntClues({
  personName,
  senderName,
  giftName,
  huntLocation,
  huntSteps,
  huntDifficulty,
  huntStyle,
  huntDetail,
}: {
  personName: string;
  senderName: string;
  giftName: string;
  huntLocation: string;
  huntSteps: number;
  huntDifficulty: string;
  huntStyle: string;
  huntDetail: string;
}) {
  const toName = personName.trim() || "sen";
  const fromName = senderName.trim();
  const gift = giftName.trim() || "sürprizin";
  const location = huntLocation.trim() || "hediyenin saklı olduğu yer";
  const detail = huntDetail.trim();
  const steps = Math.min(Math.max(Number(huntSteps || 3), 2), 6);
  const styleText = getHuntStyleText(huntStyle);
  const difficultyText = getDifficultyText(huntDifficulty);

  const clues = [
    `İlk ipucun burada başlıyor: Bugün sıradan bir gün gibi görünebilir ama aslında küçük bir sürprize doğru ilerliyorsun. ${difficultyText} bir av olacak, dikkatli bak.`,
    `İkinci ipucu: ${gift} sana direkt gelmeyecek. Önce etrafında sana tanıdık gelen, günlük hayatında sık gördüğün bir yere odaklan.`,
    `Üçüncü ipucu: Sürpriz, çok uzaklarda değil. Biraz merak, biraz dikkat ve biraz da gülümseme gerekiyor.`,
    `Dördüncü ipucu: ${detail ? `Şunu hatırla: ${detail}` : "Bugün sana özel hazırlanan küçük detaylara dikkat et."}`,
    `Beşinci ipucu: Artık çok yaklaştın. Sürprizi bulduğunda bunun özellikle senin için hazırlandığını anlayacaksın.`,
    `Son ipucu: Şimdi final zamanı. Hediyene ulaşmak için ${location} kısmına bak.`,
  ];

  const selectedClues = clues.slice(0, steps - 1);

  selectedClues.push(`Final: ${location}. Orada seni ${gift} bekliyor.`);

  return `${toName === "sen" ? "Sevgili sen" : `Sevgili ${toName}`},

Sana hediyeni direkt vermek yerine küçük bir Hediye Avı hazırladım.

Bu avın tarzı: ${styleText}.
Zorluk seviyesi: ${difficultyText}.

${selectedClues.map((clue, index) => `${index + 1}. ADIM\n${clue}`).join("\n\n")}

${fromName ? `${fromName}'den küçük bir sürpriz.` : "Bu küçük sürpriz senin için."}`;
}

export function buildConceptOutput({
  concept,
  personName,
  senderName,
  relation,
  giftName,
  tone,
  noteLength,
  specialDetail,
  huntLocation,
  huntSteps,
  huntDifficulty,
  huntStyle,
  huntDetail,
}: {
  concept: PremiumConcept;
  personName: string;
  senderName: string;
  relation: string;
  giftName: string;
  tone: string;
  noteLength: string;
  specialDetail: string;
  huntLocation: string;
  huntSteps: number;
  huntDifficulty: string;
  huntStyle: string;
  huntDetail: string;
}) {
  if (concept.id === "hediye-avi") {
    return buildHuntClues({
      personName,
      senderName,
      giftName,
      huntLocation,
      huntSteps,
      huntDifficulty,
      huntStyle,
      huntDetail,
    });
  }

  const recipient = personName.trim();
  const gift = giftName.trim() || "bu küçük sürpriz";
  const detail = specialDetail.trim();
  const opening = recipient ? `Sevgili ${recipient},` : "Sana küçük bir not,";
  const closings: Record<string, string> = {
    romantic: "İyi ki yollarımız kesişmiş. Seninle daha nice güzel anlara.",
    emotional: "Hayatımda olduğun için mutluyum. Bu küçük hatıra yüzünü güldürsün.",
    funny: "Kocaman bir gülümseme bekliyorum; hediye paketine sığdıramadığım tek şey oydu!",
    minimal: "Güzel günlerde kullan.",
    premium: "Güzel anlarına eşlik etmesi dileğiyle.",
  };
  const bodies: Record<string, string[]> = {
    "kader-bagi": [
      `Senin için seçtiğim hediye: ${gift}. Birlikte paylaştığımız küçük anların bende bıraktığı sıcaklığı hatırlatsın istedim.`,
      "Bazen bir sohbet, bazen aynı şeye gülmek… Aramızdaki bağı özel yapan şey, biriktirdiğimiz bu küçük anlar.",
      "Umarım bu hediyeye her baktığında seni düşünen birinin olduğunu hissedersin.",
    ],
    "ani-kutusu": [
      `Bu kutuya ${gift} ile birlikte güzel anılarımızdan bir parça koymak istedim.`,
      "Bazı günleri geride bıraksak da hissettirdikleri bizimle kalıyor. Bu küçük hatıra da o günlere dönmek için bir bahane olsun.",
      "Önümüzde biriktireceğimiz daha pek çok güzel an var. Kutunun asıl değeri, içinde sakladığımız hikâyede.",
    ],
    "gizli-mesaj": [
      "Sürpriz burada bitmiyor. Asıl söylemek istediğim şey bu satırların arasında:",
      `Seni düşündüm ve ${gift} ile sana küçük bir mutluluk bırakmak istedim.`,
      "Bu mesajı kendi zamanında açıp okuman bile hediyenin bir parçası. Şimdi bu anın tadını çıkar.",
    ],
    "karakterine-gore": [
      `Hediyeni seçerken günlük hayatta nelerden keyif aldığını düşündüm. Aklıma gelen seçenek ${gift} oldu.`,
      "En gösterişli olanı değil, eline aldığında kendinden bir parça bulabileceğin bir şeyi seçmek istedim.",
      "Umarım kendi tarzınla kullanır, ona senin hikâyenden bir şeyler katarsın.",
    ],
  };
  const paragraphs = bodies[concept.id] || bodies["kader-bagi"];
  const count = noteLength === "short" ? 1 : noteLength === "long" ? 3 : 2;
  const relationLine = relation.trim() && noteLength === "long" ? "Hayatımda yerin ayrı; paylaştığımız her güzel an için teşekkür ederim." : "";
  const text = tone === "minimal" && noteLength === "short" ? [`Senin için seçtiğim hediye: ${gift}.`] : paragraphs.slice(0, count);
  return [opening, ...text, detail, relationLine, closings[tone] || closings.emotional, senderName.trim() ? `Sevgilerle, ${senderName.trim()}` : ""].filter(Boolean).join("\n\n");
}
