export type PremiumConcept = {
  id: string;
  title: string;
  badge: string;
  description: string;
  bestFor: string[];
  sample: string;
  premiumLevel: "plus" | "experience" | "premium";
};

export const premiumConcepts: PremiumConcept[] = [
  {
    id: "kader-bagi",
    title: "Kader Bağı",
    badge: "Duygusal bağ",
    description:
      "Hediyeyi, iki kişi arasındaki bağa özel yazılmış bir mesaj ve sembolik bir hikâyeyle sunar.",
    bestFor: ["Sevgili", "Yakın arkadaş", "Aile", "Yıl dönümü"],
    sample:
      "Bu hediye sadece bir eşya değil; seni düşündüğüm anla, senin bendeki yerin arasında küçük bir bağ.",
    premiumLevel: "premium",
  },
  {
    id: "hediye-avi",
    title: "Hediye Avı",
    badge: "Oyunlaştırılmış sürpriz",
    description:
      "Hediyeyi direkt vermek yerine ipuçları, küçük bilmeceler ve son adımla açılan bir sürpriz akışı oluşturur.",
    bestFor: ["Doğum günü", "Sevgili", "Ev sürprizi", "Arkadaş"],
    sample:
      "İpucu 1: En çok güldüğümüz anı hatırla. İpucu 2: Bu hediye, o anın küçük bir devamı.",
    premiumLevel: "experience",
  },
  {
    id: "ani-kutusu",
    title: "Anı Kutusu",
    badge: "Nostaljik",
    description:
      "Hediyenin yanına kişisel anılar, küçük notlar ve özel tarihleri bağlayan dijital bir anı sayfası ekler.",
    bestFor: ["Aile", "Arkadaş", "Mezuniyet", "Yıl dönümü"],
    sample:
      "Bu kutuda sadece bir hediye değil; birlikte biriktirdiğimiz küçük anların izi var.",
    premiumLevel: "experience",
  },
  {
    id: "gizli-mesaj",
    title: "Gizli Mesaj",
    badge: "QR sürpriz",
    description:
      "Hediyenin içine veya yanına koyulan QR kodla açılan özel bir mesaj, mektup veya mini hikâye oluşturur.",
    bestFor: ["Romantik hediye", "Uzaktan hediye", "Özel not", "Sürpriz"],
    sample:
      "Bu notu hediyeden sonra açmanı istedim; çünkü asıl söylemek istediğim şey burada.",
    premiumLevel: "plus",
  },
  {
    id: "karakterine-gore",
    title: "Karakterine Göre Hediye",
    badge: "Kişilik odaklı",
    description:
      "Kişinin tarzına, risk seviyesine, ilgi alanına ve kullanım alışkanlığına göre daha isabetli hediye sunumu yapar.",
    bestFor: ["Kararsız kalanlar", "Arkadaş", "Yeni tanışılan kişi", "İş arkadaşı"],
    sample:
      "Onun tarzı daha sade ve kullanışlı olduğu için hediyeyi abartmadan ama düşünülmüş hissettirecek şekilde seçtik.",
    premiumLevel: "plus",
  },
];
