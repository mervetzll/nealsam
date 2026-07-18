"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { openGiftCardPrint, type GiftCardTheme } from "@/lib/giftCard";
import { canDownloadCard, canUseMode, normalizePlan } from "@/lib/plans";

type Mode = "not" | "kader" | "anti" | "rpg" | "av" | "gelecek" | "gizemli";

type Result = {
  title: string;
  description: string;
  giftIdeas: string[];
  searchQueries: string[];
  note: string;
  extra: string[];
};

const modes: {
  id: Mode;
  title: string;
  subtitle: string;
  placeholder: string;
  buttonText: string;
}[] = [
  {
    id: "not",
    title: "Hediye Notu",
    subtitle: "Seçtiğin hediyenin yanına özel not yazar.",
    placeholder:
      "Örn: LED ışıklı makyaj aynası hediyesi için samimi, tatlı ve kısa bir not istiyorum...",
    buttonText: "Hediye notu oluştur",
  },
  {
    id: "kader",
    title: "Kader Bağları",
    subtitle: "Bir anıdan hediye fikri çıkarır.",
    placeholder:
      "Örn: Üniversitede yağmurlu bir günde otobüsü kaçırmıştık ve o gün tanışmıştık...",
    buttonText: "Anıdan hediye üret",
  },
  {
    id: "anti",
    title: "Anti-Hediye",
    subtitle: "Nefret ettiği şeylerden hediye bulur.",
    placeholder:
      "Örn: Erken kalkmaktan nefret eder, anahtarlarını kaybeder, kahvesi hemen soğur...",
    buttonText: "Nefretlerinden hediye bul",
  },
  {
    id: "rpg",
    title: "RPG Karakter",
    subtitle: "Kişiyi oyun karakteri gibi analiz eder.",
    placeholder:
      "Örn: Gamer, kahve bağımlısı, sabırsız. Zeka 90, sabır 20, karizma 70...",
    buttonText: "Karaktere göre hediye bul",
  },
  {
    id: "av",
    title: "Hediye Avı",
    subtitle: "Hediye için bilmece ve görev planı yapar.",
    placeholder:
      "Örn: Hediye evde saklanacak. Final yeri gardırop. Romantik ve komik olsun...",
    buttonText: "Hediye avı hazırla",
  },
  {
    id: "gelecek",
    title: "Gelecekteki Ben",
    subtitle: "20 yıl sonradan gelmiş gibi mektup yazar.",
    placeholder:
      "Örn: Adı Zeynep. 22 yaşında. Yazılımcı olmak istiyor. Çok çalışkan ama kendine güveni bazen düşüyor...",
    buttonText: "Mektup oluştur",
  },
  {
    id: "gizemli",
    title: "Gizemli Hediye",
    subtitle: "Hediyeyi saklar, sadece ipucu verir.",
    placeholder:
      "Örn: Bütçe 750 TL. Kahve seviyor, üşümeyi sevmiyor, minimal şeyleri seviyor...",
    buttonText: "Gizemli ipucu üret",
  },
];

const cardThemes: {
  id: GiftCardTheme;
  title: string;
  description: string;
}[] = [
  {
    id: "romantic",
    title: "Romantik",
    description: "Pembe tonlu, sıcak ve duygusal kart.",
  },
  {
    id: "minimal",
    title: "Minimal",
    description: "Sade, temiz ve modern kart.",
  },
  {
    id: "elegant",
    title: "Zarif",
    description: "Bej-altın tonlu daha şık kart.",
  },
  {
    id: "fun",
    title: "Eğlenceli",
    description: "Daha renkli ve neşeli kart.",
  },
  {
    id: "dark",
    title: "Premium",
    description: "Koyu arka planlı premium kart.",
  },
];

const noteTonePresets = [
  {
    label: "Kısa",
    text: "Ton: Kısa, net ve hediyenin yanına kart gibi koyulabilecek bir not olsun.",
  },
  {
    label: "Duygusal",
    text: "Ton: Duygusal, içten ve kişiyi özel hissettiren bir not olsun.",
  },
  {
    label: "Komik",
    text: "Ton: Komik, samimi ve hafif şakalı bir not olsun.",
  },
  {
    label: "Romantik",
    text: "Ton: Romantik ama abartısız, sıcak ve özel bir not olsun.",
  },
  {
    label: "Zarif",
    text: "Ton: Zarif, minimal, şık ve sade bir not olsun.",
  },
  {
    label: "Özür",
    text: "Ton: Özür dilemek veya barışmak için yumuşak, kırmadan ve içten bir not olsun.",
  },
  {
    label: "Arkadaşça",
    text: "Ton: Yakın arkadaş için doğal, eğlenceli ve samimi bir not olsun.",
  },
  {
    label: "Uzun",
    text: "Ton: Daha uzun, mektup gibi ama sıkmayan bir not olsun.",
  },
];

const PLAN_LIMITS: Record<string, number> = {
  free: 5,
  note: 30,
  experience: 20,
  premium: 100,
};

function getCurrentMonthKey() {
  return new Date().toISOString().slice(0, 7);
}

function getUsedCount(plan: string) {
  const month = getCurrentMonthKey();
  const usage = JSON.parse(localStorage.getItem("nealsam_usage") || "{}");

  return usage?.[month]?.[plan] || 0;
}

function increaseUsedCount(plan: string) {
  const month = getCurrentMonthKey();
  const usage = JSON.parse(localStorage.getItem("nealsam_usage") || "{}");
  const currentCount = usage?.[month]?.[plan] || 0;

  usage[month] = {
    ...(usage[month] || {}),
    [plan]: currentCount + 1,
  };

  localStorage.setItem("nealsam_usage", JSON.stringify(usage));
}

const quickExamples: Record<Mode, string[]> = {
  not: [
    "LED ışıklı makyaj aynası hediyesi için samimi, tatlı ve kısa bir not istiyorum.",
    "Kahve kupası hediyesi için komik ama içten bir not yaz.",
    "Cilt bakım seti hediyesi için zarif, düşünceli ve çok abartılı olmayan bir not oluştur.",
  ],
  kader: [
    "Üniversitede yağmurlu bir günde otobüsü kaçırmıştık ve o gün tanışmıştık.",
    "İlk kahvemizi küçük bir kafede içmiştik, o gün saatlerce konuşmuştuk.",
    "Birlikte kaybolduğumuz bir tatilde en güzel anımızı yaşamıştık.",
  ],
  anti: [
    "Erken uyanmaktan nefret eder, anahtarlarını sürekli kaybeder, kahvesi hemen soğur.",
    "Dağınıklıktan şikayet eder ama eşyalarını hep ortada bırakır.",
    "Telefonunun şarjı bitince çok sinirlenir, plan yapmayı da pek sevmez.",
  ],
  rpg: [
    "Gamer, kahve bağımlısı, sabırsız. Zeka 90, sabır 20, karizma 70.",
    "Yazılımcı, gececi, strateji sever. Zeka 95, enerji 60, sabır 40.",
    "Moda seven, sosyal, komik. Karizma 90, duygusallık 75, sabır 35.",
  ],
  av: [
    "Hediye evde saklanacak. Final yeri gardırop. Romantik ve komik olsun.",
    "Hediye arkadaşımın odasında saklanacak. 4 adımlı komik bir av olsun.",
    "Hediye kafede verilecek. Öncesinde WhatsApp ipuçlarıyla bulmasını istiyorum.",
  ],
  gelecek: [
    "Adı Zeynep. 22 yaşında. Yazılımcı olmak istiyor. Çok çalışkan ama bazen kendine güveni düşüyor.",
    "Adı Emir. Yeni mezun oldu. Gelecekte başarılı ve huzurlu olmak istiyor.",
    "Adı Ayşe. Çok duygusal, ailesine düşkün ve kendi işini kurmayı hayal ediyor.",
  ],
  gizemli: [
    "Bütçe 750 TL. Kahve seviyor, üşümeyi sevmiyor, minimal şeyleri seviyor.",
    "Bütçe 1000 TL. Kitap, kahve ve sakin akşamları seviyor. Sürpriz olsun.",
    "Bütçe 500 TL. Komik ama kullanışlı bir şey olsun. Hediyeyi hemen anlamasın.",
  ],
};

function makeSearchUrl(
  site: "google" | "trendyol" | "amazon" | "hepsiburada",
  query: string
) {
  const encoded = encodeURIComponent(query);

  if (site === "google") return `https://www.google.com/search?q=${encoded}`;
  if (site === "trendyol") return `https://www.trendyol.com/sr?q=${encoded}`;
  if (site === "amazon") return `https://www.amazon.com.tr/s?k=${encoded}`;

  return `https://www.hepsiburada.com/ara?q=${encoded}`;
}

function generateResult(mode: Mode, text: string): Result {
  const lower = text.toLowerCase();

  if (mode === "not") {
    const romantic =
      lower.includes("sevgili") || lower.includes("romantik") || lower.includes("aşk");
    const funny =
      lower.includes("komik") || lower.includes("eğlenceli") || lower.includes("şaka");
    const elegant =
      lower.includes("zarif") || lower.includes("şık") || lower.includes("minimal");
    const apology =
      lower.includes("özür") || lower.includes("barış") || lower.includes("kırdım");
    const birthday =
      lower.includes("doğum günü") || lower.includes("birthday");

    let mainNote =
      "Bu hediyeyi seçerken sana gerçekten yakışacak, işine yarayacak ve küçük de olsa mutlu edecek bir şey olmasını istedim.";

    if (romantic) {
      mainNote =
        "Büyük şeyler bazen küçük detaylarda saklıdır. Bu hediyeyi seçerken aklımda sadece senin gülümsemen vardı.";
    } else if (funny) {
      mainNote =
        "Bu hediyeyi görünce aklına ilk ben geleyim istedim. Kabul ediyorum, biraz tatlı, biraz kullanışlı, biraz da tam senlik oldu.";
    } else if (elegant) {
      mainNote =
        "Sana küçük ama düşünülmüş bir şey vermek istedim. Umarım her kullandığında kendini özel hissettirir.";
    } else if (apology) {
      mainNote =
        "Bazen kelimeler yetmez ama yine de bir yerden başlamak gerekir. Bu küçük hediye, seni düşündüğümü ve kalbimi yumuşatmak istediğimi anlatsın istedim.";
    } else if (birthday) {
      mainNote =
        "Yeni yaşında yüzünü güldürecek küçük bir detay bırakmak istedim. Umarım bu hediye sana güzel bir anı olarak kalır.";
    }

    return {
      title: "Hediyenin yanına özel not seçenekleri",
      description:
        "Bu mod ürün önermez. Seçtiğin hediyenin yanına koyabileceğin farklı tarzlarda not seçenekleri hazırlar. Beğendiğin notu seçersen QR kod sadece o nottan oluşur.",
      giftIdeas: [
        "Kısa ve tatlı not",
        "Duygusal not",
        "Komik not",
        "Zarif ve minimal not",
        "Uzun mektup tarzı not",
        "WhatsApp mesajı",
      ],
      searchQueries: [],
      note: mainNote,
      extra: [
        "Kısa ve tatlı: Küçük bir hediye, büyük bir düşünce. Umarım yüzünde minicik de olsa bir gülümseme bırakır.",
        "Duygusal: Bunu seçerken sadece ne alacağımı değil, sana ne hissettireceğini düşündüm. Umarım her baktığında güzel bir şey hatırlatır.",
        "Komik: Bu hediyeyi seçerken beynim, kalbim ve biraz da panik halindeki kararsızlığım birlikte çalıştı. Sonuç: bence tam senlik.",
        "Zarif/minimal: Sana sade ama düşünülmüş bir şey vermek istedim. Umarım küçük bir detay gibi görünür ama güzel hissettirir.",
        "Uzun mektup tarzı: Bazen bir hediyenin değeri fiyatında değil, arkasındaki düşüncede saklıdır. Bu hediyeyi seçerken seni, sevdiğin şeyleri ve küçük mutluluklarını düşündüm. Umarım bu sadece bir eşya gibi değil, seni gerçekten tanıyan birinin seçimi gibi hissettirir.",
        "WhatsApp mesajı: Sana küçük bir sürprizim var. Çok büyük bir şey değil belki ama seni düşündüğümü anlatan tatlı bir detay olsun istedim.",
        "Premium romantik: Bu hediyeyi seçerken en çok şunu düşündüm: Sana kendini özel hissettirecek küçük bir detay bırakmak. Çünkü bazen en güzel şeyler büyük cümlelerde değil, düşünülmüş küçük seçimlerde saklıdır.",
        "Premium arkadaş notu: Bu hediye biraz senin enerjine, biraz da aramızdaki o saçma ama güzel muhabbetlere yakışsın istedim. Umarım görünce ‘evet, bu tam benlik’ dersin.",
        "Özür/barışma tonu: Belki her şeyi tek bir hediyeyle anlatamam ama seni düşündüğümü göstermek için küçük bir başlangıç yapmak istedim. Umarım bu not, içimdeki iyi niyeti sana biraz olsun geçirir.",
        "Lüks ve zarif ton: Sana abartılı değil, düşünülmüş ve zarif bir şey vermek istedim. Umarım bu küçük detay, kendini değerli hissettiren güzel bir ana dönüşür.",
      ],
    };
  }

  if (mode === "kader") {
    const rain = lower.includes("yağmur");
    const bus = lower.includes("otobüs");
    const school = lower.includes("üniversite") || lower.includes("okul");
    const sea = lower.includes("deniz") || lower.includes("sahil");

    return {
      title: "Bu anıdan çıkan hediye deneyimi",
      description:
        "Bu modül, yazdığın anıdaki duygu ve sembolleri yakalar. Amaç ürün satmak değil; internette aranacak hediye fikirlerini ve hediyenin yanına konacak anlamlı notu hazırlamaktır.",
      giftIdeas: [
        rain ? "Yağmur temalı özel not kartı" : "Anı temalı özel not kartı",
        bus ? "Nostaljik otobüs bileti tasarımı" : "O güne özel mini anı kartı",
        school ? "Üniversite anısı temalı çerçeve" : "Kişiye özel anı posteri",
        sea ? "Deniz temalı küçük anı kutusu" : "Küçük bir anı kutusu",
      ],
      searchQueries: [
        rain ? "yağmur temalı hediye" : "anı kutusu hediye",
        bus ? "kişiye özel otobüs bileti tasarımı" : "kişiye özel anı posteri",
        school ? "üniversite anısı hediye" : "kişiye özel not kartı",
      ],
      note:
        "Bazı günler sıradan başlar ama hayatın yönünü değiştirir. O gün de bizim için öyleydi. İyi ki o an yaşandı, iyi ki yollarımız kesişti.",
      extra: [
        "Alternatif evren hikâyesi: Eğer o küçük tesadüf yaşanmasaydı, belki de aynı şehirde iki yabancı olarak kalacaktınız. Ama hayat bazen en güzel bağları en plansız anlarda kurar.",
        "Bizden alınabilecek içerik: Kader Bağları hikâyesi, basılabilir not kartı ve mini anı metni.",
      ],
    };
  }

  if (mode === "anti") {
    const keys = lower.includes("anahtar");
    const wake = lower.includes("erken") || lower.includes("uyan") || lower.includes("sabah");
    const coffee = lower.includes("kahve");
    const cold = lower.includes("soğuk") || lower.includes("üşü");
    const messy = lower.includes("dağınık") || lower.includes("kaybed");

    return {
      title: "Nefret ettiği şeylerden çıkan hediye",
      description:
        "Bu kişi için iyi hediye, sevdiği şeyi büyütmekten çok günlük hayatta sinir olduğu küçük problemi çözmek olabilir. Bu yüzden öneriler hem kullanışlı hem de biraz şakacı seçildi.",
      giftIdeas: [
        keys ? "Bluetooth akıllı anahtarlık" : "Günlük hayat kolaylaştırıcı mini aksesuar",
        wake ? "Güçlü alarm saati veya gün ışığı alarmı" : "Pratik masaüstü yardımcı ürün",
        coffee || cold ? "Kupa ısıtıcı veya kaliteli termos kupa" : "Kullanışlı organizer",
        messy ? "Masa düzenleyici veya çanta içi organizer" : "Komik not kartı",
      ],
      searchQueries: [
        keys ? "bluetooth akıllı anahtarlık" : "pratik hediye",
        wake ? "güçlü alarm saati" : "masaüstü organizer",
        coffee || cold ? "kupa ısıtıcı" : "kullanışlı hediye",
      ],
      note:
        "Hayatındaki küçük kaoslara minik bir çözüm bulmak istedim. Seni değiştirmeye çalışmıyorum, sadece kaybolan şeyleri ve zor sabahları biraz daha kolaylaştırıyorum.",
      extra: [
        "Şaka kartı fikri: Bu hediye, seninle değil, senin günlük dertlerinle savaşmak için seçildi.",
        "Bizden alınabilecek içerik: Komik anti-hediye notu ve basılabilir mini kart.",
      ],
    };
  }

  if (mode === "rpg") {
    const gamer = lower.includes("gamer") || lower.includes("oyun");
    const coffee = lower.includes("kahve");
    const impatient = lower.includes("sabır") || lower.includes("sabırsız");
    const smart = lower.includes("zeka") || lower.includes("akıllı");
    const stylish = lower.includes("moda") || lower.includes("stil");

    return {
      title: "Karakter analizine göre hediye",
      description:
        "Bu modül kişiyi RPG karakteri gibi düşünür. Hediyeyi normal ürün olarak değil, karakterin güçlü yönünü ödüllendiren veya zayıf yönünü tatlıca geliştiren bir ekipman gibi sunar.",
      giftIdeas: [
        gamer ? "Gaming mousepad veya RGB masa aksesuarı" : "Kişiye özel karakter kartı",
        coffee ? "Kahve kupası ve kahve seti" : "Masaüstü dekoratif obje",
        impatient ? "Zor ama eğlenceli puzzle" : "Strateji kutu oyunu",
        smart ? "Zeka oyunu veya yaratıcı problem çözme oyunu" : "Kişiselleştirilmiş not kartı",
        stylish ? "Minimal takı veya şık aksesuar" : "Mini karakter posteri",
      ],
      searchQueries: [
        gamer ? "gaming masa aksesuarı" : "kişiye özel karakter kartı",
        coffee ? "kahve hediye seti" : "masaüstü dekoratif hediye",
        impatient ? "zor puzzle hediye" : "strateji kutu oyunu",
      ],
      note:
        "Bu hediye, karakterinin güçlü yönlerini kutlamak ve küçük zayıflıklarına tatlı bir güçlendirme vermek için seçildi. Yeni ekipmanın hayırlı olsun.",
      extra: [
        "Karakter kartı: Sınıf: Özel Karakter. Pasif yetenek: Ortamın enerjisini değiştirir. Zayıf yön: Bazen fazla hızlı düşünür.",
        "Bizden alınabilecek içerik: RPG karakter kartı, seviye kartı ve komik görev metni.",
      ],
    };
  }

  if (mode === "av") {
    return {
      title: "Hediye Avı Planı",
      description:
        "Bu modda ürünü biz satmıyoruz. Sen hediyeyi alıp saklıyorsun, biz alıcının hediyeye ulaşması için bilmece, görev ve final mesajı hazırlıyoruz.",
      giftIdeas: [
        "Ev içi hediye avı kartları",
        "WhatsApp mesaj görevleri",
        "Final lokasyon kartı",
        "Komik veya romantik ipucu notları",
      ],
      searchQueries: ["hediye not kartı", "kişiye özel zarf", "hediye kutusu"],
      note:
        "Bugün hediyeni direkt vermek istemedim. Çünkü bazı şeyler hemen bulununca değil, aranınca daha değerli olur.",
      extra: [
        "1. ipucu: Güne başlarken ilk baktığın yere git.",
        "2. ipucu: En çok kullandığın ama en az fark ettiğin şeyin yanındayım.",
        "3. ipucu: Biraz düzen, biraz saklanma. Final seni bekliyor.",
        "Final mesajı: Buldun. Ama asıl hediye bu kutu değil, bu oyunu senin için düşünmüş olmam.",
      ],
    };
  }

  if (mode === "gelecek") {
    return {
      title: "Gelecekteki Ben’den Mektup",
      description:
        "Bu mod ürün önermez. Hediye paketinin yanına konabilecek, gelecekten gelmiş gibi yazılmış duygusal ve kişiye özel mektup seçenekleri üretir.",
      giftIdeas: [
        "Kısa gelecek notu",
        "Duygusal mektup",
        "Cesaret verici mektup",
        "Zaman kapsülü mesajı",
        "QR açıklama metni",
      ],
      searchQueries: [],
      note:
        "Merhaba, ben senin yıllar sonraki halinim. Bugün kafanı kurcalayan birçok şeyin bir gün anlam kazanacağını bilmeni isterdim. Şu an attığın küçük adımlar, ileride gururla anlatacağın bir hikâyenin başlangıcı olacak.",
      extra: [
        "Kısa not: Bugünkü sen, gelecekteki senin en cesur başlangıcısın.",
        "Duygusal mektup: Bir gün geriye dönüp baktığında, bugün zor gelen şeylerin seni nasıl güçlendirdiğini göreceksin. O yüzden kendine biraz daha nazik davran. Sen, sandığından daha dayanıklı ve daha değerlisin.",
        "Cesaret verici mektup: Şu an her şey net görünmeyebilir ama bu, yolunda olmadığın anlamına gelmez. Bazen en güzel hayatlar, kararsızlıkların içinden çıkar. Devam et; gelecekteki sen, bugünkü çabana teşekkür edecek.",
        "Zaman kapsülü mesajı: Bu mektubu açtığın gün, umarım bugün hayalini kurduğun şeylerin bir kısmına ulaşmış olursun. Ulaşmadıysan bile sorun değil; çünkü önemli olan hâlâ deniyor olman.",
        "QR açıklama metni: Bu QR kod, sana bugünden geleceğe bırakılmış küçük bir mesaj taşıyor. Açtığında sadece bir metin değil, seni düşünen birinin sana inancını okuyacaksın.",
      ],
    };
  }

  const coffee = lower.includes("kahve");
  const cold = lower.includes("üşü") || lower.includes("soğuk");
  const minimal = lower.includes("minimal") || lower.includes("sade");

  return {
    title: "Gizemli Hediye İpucu",
    description:
      "Bu modda hediye direkt söylenmez. Kullanıcı sadece şiirsel bir ipucu görür. İsterse sonra önerilen arama kelimelerini açıp ürünleri internette arayabilir.",
    giftIdeas: [
      coffee ? "Kahve temalı gizemli hediye" : "Kişiye özel küçük sürpriz",
      cold ? "Sıcak tutan kullanışlı hediye" : "Günlük hayatta kullanılacak tatlı obje",
      minimal ? "Minimal tasarımlı aksesuar" : "Sürpriz kutu fikri",
      "Gizemli ipucu kartı",
    ],
    searchQueries: [
      coffee ? "kahve hediye seti" : "sürpriz hediye",
      cold ? "sıcak tutan hediye" : "kişiye özel hediye",
      minimal ? "minimal hediye" : "hediye kutusu",
    ],
    note:
      "Sana hediyenin ne olduğunu hemen söylemeyeceğim. Sadece üç kelime: sıcak, tanıdık, küçük mutluluk.",
    extra: [
      "Gizemli şiir: Cevabı kutunun içinde, ipucu kalbin bildiği yerde. Açınca anlayacaksın; bu hediye biraz sen, biraz biz.",
      "Bizden alınabilecek içerik: Gizemli ipucu kartı, şiir ve açıklama notu.",
    ],
  };
}

export default function ExperienceModes() {
  const [selectedMode, setSelectedMode] = useState<Mode>("not");
  const [text, setText] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [selectedNoteText, setSelectedNoteText] = useState("");
  const [selectedCardTheme, setSelectedCardTheme] = useState<GiftCardTheme>("romantic");
  const [activePlan, setActivePlan] = useState("free");

  const activeMode = useMemo(
    () => modes.find((mode) => mode.id === selectedMode),
    [selectedMode]
  );

  useEffect(() => {
    const savedPlan = localStorage.getItem("nealsam_plan");
    if (savedPlan) setActivePlan(savedPlan);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode") as Mode | null;
    const gift = params.get("gift");

    if (mode && modes.some((item) => item.id === mode)) {
      setSelectedMode(mode);
      setResult(null);
      setQrDataUrl("");
      setSelectedNoteText("");

      if (gift) {
        setText(
          `Bu hediye için özel bir not oluşturmak istiyorum: ${gift}. Not samimi, kısa, anlamlı ve hediyenin yanına koyulabilecek gibi olsun.`
        );
      } else {
        setText("");
      }
    }
  }, []);

  useEffect(() => {
    async function createQrCode() {
      if (!result) {
        setQrDataUrl("");
        return;
      }

      const noteForQr = selectedNoteText || result.note;

      if (!noteForQr.trim()) {
        setQrDataUrl("");
        return;
      }

      const qrText = [
        "NeAlsam Hediye Notu",
        "",
        result.title,
        "",
        noteForQr,
      ].join("\n");

      try {
        const dataUrl = await QRCode.toDataURL(qrText, {
          width: 320,
          margin: 2,
        });

        setQrDataUrl(dataUrl);
      } catch {
        setQrDataUrl("");
      }
    }

    createQrCode();
  }, [result, selectedNoteText]);

  function handleQuickExample(example: string) {
    setText(example);
    setResult(null);
    setQrDataUrl("");
    setSelectedNoteText("");
  }

  function handleTonePreset(toneText: string) {
    setText((prev) => {
      if (!prev.trim()) return toneText;
      if (prev.includes(toneText)) return prev;
      return `${prev}\n${toneText}`;
    });

    setResult(null);
    setQrDataUrl("");
    setSelectedNoteText("");
  }

  function handleGenerate() {
    if (text.trim().length < 10) {
      alert("Biraz daha detay yazmalısın.");
      return;
    }

    const currentPlan = localStorage.getItem("nealsam_plan") || activePlan || "free";

    if (!canUseMode(currentPlan, selectedMode)) {
      alert("Bu mod mevcut paketinde açık değil. Paketler sayfasından uygun paketi seçebilirsin.");
      window.location.href = "/paketler";
      return;
    }

    const planLimit = PLAN_LIMITS[currentPlan] || PLAN_LIMITS.free;
    const usedCount = getUsedCount(currentPlan);

    if (usedCount >= planLimit) {
      alert("Bu ayki kullanım hakkın doldu. Paketini yükseltebilir veya yeni ayı bekleyebilirsin.");
      window.location.href = "/paketler";
      return;
    }

    increaseUsedCount(currentPlan);
    setActivePlan(currentPlan);

    setQrDataUrl("");
    setSelectedNoteText("");

    const generatedResult = generateResult(selectedMode, text);

    setResult(generatedResult);
    setSelectedNoteText(generatedResult.note);
  }

  function buildResultText() {
    if (!result) return "";

    return [
      result.title,
      "",
      result.description,
      "",
      selectedMode === "not" || selectedMode === "gelecek"
        ? "İçerik seçenekleri:"
        : "Hediye fikirleri:",
      ...result.giftIdeas.map((item) => `- ${item}`),
      "",
      "QR'a eklenen / seçili not:",
      selectedNoteText || result.note,
      "",
      "Ek içerik:",
      ...result.extra.map((item) => `- ${item}`),
      "",
      "QR kod açıklaması:",
      "Bu QR kod, seçili hediye notunu dijital olarak paylaşmak veya hediyenin yanına eklemek için oluşturulmuştur.",
    ].join("\n");
  }

  function copyResultText() {
    const fullText = buildResultText();

    if (!fullText) return;

    navigator.clipboard.writeText(fullText);
    alert("Not ve öneriler kopyalandı.");
  }

  function copySingleText(textToCopy: string) {
    setSelectedNoteText(textToCopy);
    navigator.clipboard.writeText(textToCopy);
    alert("Seçili not kopyalandı ve QR bu nota göre güncellendi.");
  }

  function selectSingleText(textToSelect: string) {
    setSelectedNoteText(textToSelect);
    alert("Bu not seçildi. QR kod bu nota göre oluşturuldu.");
  }

  function downloadResultText() {
    const fullText = buildResultText();

    if (!fullText) return;

    const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "nealsam-hediye-notu.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  function printResultText() {
    const fullText = buildResultText();

    if (!fullText) return;

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Yazdırma penceresi açılamadı.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>NeAlsam Hediye Notu</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.7; color: #2b1b1b; }
            h1 { color: #b83280; }
            pre { white-space: pre-wrap; font-family: Arial, sans-serif; background: #fff7f3; padding: 24px; border-radius: 18px; }
          </style>
        </head>
        <body>
          <h1>NeAlsam Hediye Notu</h1>
          <pre>${fullText}</pre>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  }

  function shareOnWhatsApp() {
    const fullText = buildResultText();

    if (!fullText) return;

    const encoded = encodeURIComponent(fullText);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  }

  function downloadQrCode() {
    if (!qrDataUrl) return;

    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = "nealsam-hediye-notu-qr.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function downloadSelectedCard() {
    if (!result) return;

    const currentPlan = normalizePlan(
      localStorage.getItem("nealsam_plan") || activePlan
    );

    if (!canDownloadCard(currentPlan)) {
      alert("Kart olarak indirme özelliği Not Paketi, Deneyim Paketi veya Premium Paket ile açılır.");
      window.location.href = "/paketler";
      return;
    }

    openGiftCardPrint({
      title: result.title,
      note: selectedNoteText || result.note,
      qrDataUrl,
      theme: selectedCardTheme,
    });
  }

  function saveResultToAccount() {
    if (!result) return;

    const savedUser = localStorage.getItem("nealsam_user");

    if (!savedUser) {
      alert("İçeriği kaydetmek için önce giriş yapmalısın.");
      window.location.href = "/giris";
      return;
    }

    const oldItems = JSON.parse(
      localStorage.getItem("nealsam_saved_contents") || "[]"
    );

    const newItem = {
      id: Date.now(),
      mode: selectedMode,
      title: result.title,
      note: selectedNoteText || result.note,
      description: result.description,
      plan: activePlan,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "nealsam_saved_contents",
      JSON.stringify([newItem, ...oldItems])
    );

    alert("İçerik hesabına kaydedildi.");
  }

  return (
    <section id="deneyim" className="bg-[#fff7f3] px-6 py-16 text-[#2b1b1b]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="mb-3 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#b83280] shadow-sm">
            Deneyim Modları
          </p>

          <h2 className="text-4xl font-extrabold">
            Hediye satmıyoruz, hediyenin anlamını buluyoruz.
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-[#6b4b4b]">
            Ürünü internetten kullanıcı alır. Biz sadece hediye fikri, arama linki,
            kişisel not, hikâye, bilmece, QR kod ve mektup üretiriz.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-7">
          {modes.map((mode) => {
            const modeLocked = !canUseMode(activePlan, mode.id);

            return (
              <button
                key={mode.id}
                onClick={() => {
                  if (modeLocked) {
                    alert("Bu mod mevcut paketinde açık değil. Paketler sayfasından uygun paketi seçebilirsin.");
                    window.location.href = "/paketler";
                    return;
                  }

                  setSelectedMode(mode.id);
                  setResult(null);
                  setQrDataUrl("");
                  setSelectedNoteText("");
                }}
                className={`rounded-3xl border p-4 text-left transition ${
                  selectedMode === mode.id
                    ? "border-[#b83280] bg-white shadow-md"
                    : modeLocked
                    ? "border-[#f0d7df] bg-[#f8eeee] opacity-70"
                    : "border-[#f0d7df] bg-[#fffaf7] hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-[#b83280]">{mode.title}</h3>
                  {modeLocked && (
                    <span className="rounded-full bg-white px-2 py-1 text-[10px] font-black text-[#b83280]">
                      Kilitli
                    </span>
                  )}
                </div>

                <p className="mt-2 text-sm text-[#6b4b4b]">{mode.subtitle}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-2xl font-bold">{activeMode?.title}</h3>

            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={activeMode?.placeholder}
              className="min-h-[160px] w-full rounded-2xl border border-[#f0d7df] bg-[#fffaf7] p-4 outline-none focus:border-[#b83280]"
            />

            <div className="mt-4">
              <p className="mb-2 text-sm font-bold text-[#b83280]">
                Hazır örneklerden seç
              </p>

              <div className="grid gap-2">
                {quickExamples[selectedMode].map((example) => (
                  <button
                    key={example}
                    onClick={() => handleQuickExample(example)}
                    className="rounded-2xl border border-[#f0d7df] bg-[#fffaf7] p-3 text-left text-sm leading-6 text-[#6b4b4b] transition hover:border-[#b83280] hover:bg-white"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {selectedMode === "not" && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-bold text-[#b83280]">
                  Not tonu seç
                </p>

                <div className="flex flex-wrap gap-2">
                  {noteTonePresets.map((tone) => (
                    <button
                      key={tone.label}
                      onClick={() => handleTonePreset(tone.text)}
                      className="rounded-full border border-[#e8c4d8] bg-white px-4 py-2 text-xs font-bold text-[#b83280] transition hover:bg-[#fff0f7]"
                    >
                      {tone.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleGenerate}
              className="mt-4 w-full rounded-full bg-[#b83280] px-6 py-3 font-semibold text-white"
            >
              {activeMode?.buttonText}
            </button>

            <p className="mt-4 text-sm leading-6 text-[#8b6f6f]">
              Not: Bu alan gerçek ürün satışı yapmaz. Sadece internet araması,
              hediye fikri ve kişisel içerik üretir.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            {!result ? (
              <div className="flex h-full min-h-[350px] items-center justify-center rounded-2xl border border-dashed border-[#f0d7df] p-6 text-center text-[#8b6f6f]">
                Sol tarafa bilgi yazınca burada hediye fikri, arama linkleri,
                kişisel not ve QR kod oluşacak.
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-bold text-[#b83280]">
                    {result.title}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    <button onClick={copyResultText} className="rounded-full border border-[#e8c4d8] px-4 py-2 text-xs font-bold text-[#b83280]">
                      Kopyala
                    </button>

                    <button onClick={downloadResultText} className="rounded-full bg-[#b83280] px-4 py-2 text-xs font-bold text-white">
                      Notu indir
                    </button>

                    <button onClick={printResultText} className="rounded-full border border-[#e8c4d8] px-4 py-2 text-xs font-bold text-[#b83280]">
                      Yazdır
                    </button>

                    <button onClick={shareOnWhatsApp} className="rounded-full bg-[#25D366] px-4 py-2 text-xs font-bold text-white">
                      WhatsApp
                    </button>

                    {qrDataUrl && (
                      <button onClick={downloadQrCode} className="rounded-full border border-[#e8c4d8] px-4 py-2 text-xs font-bold text-[#b83280]">
                        QR indir
                      </button>
                    )}

                    <button
                      onClick={saveResultToAccount}
                      className="rounded-full bg-[#fff0f7] px-4 py-2 text-xs font-bold text-[#b83280]"
                    >
                      Hesabıma kaydet
                    </button>
                  </div>
                </div>

                <p className="mt-3 leading-7 text-[#6b4b4b]">
                  {result.description}
                </p>

                <div className="mt-6">
                  <h4 className="mb-2 font-bold">
                    {selectedMode === "not" || selectedMode === "gelecek"
                      ? "İçerik seçenekleri"
                      : "Hediye fikirleri"}
                  </h4>

                  <div className="grid gap-3">
                    {result.giftIdeas.map((idea) => (
                      <div key={idea} className="rounded-2xl bg-[#fff7f3] p-3 text-sm">
                        {idea}
                      </div>
                    ))}
                  </div>
                </div>

                {result.searchQueries.length > 0 && (
                  <div className="mt-6">
                    <h4 className="mb-2 font-bold">Bu fikri internette ara</h4>

                    <div className="grid gap-3">
                      {result.searchQueries.map((query) => (
                        <div key={query} className="rounded-2xl border border-[#f0d7df] p-3">
                          <p className="mb-3 text-sm font-semibold">{query}</p>

                          <div className="flex flex-wrap gap-2">
                            <a href={makeSearchUrl("google", query)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#b83280] px-3 py-2 text-xs font-semibold text-white">
                              Google
                            </a>

                            <a href={makeSearchUrl("trendyol", query)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#b83280] ring-1 ring-[#f0d7df]">
                              Trendyol
                            </a>

                            <a href={makeSearchUrl("amazon", query)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#b83280] ring-1 ring-[#f0d7df]">
                              Amazon
                            </a>

                            <a href={makeSearchUrl("hepsiburada", query)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#b83280] ring-1 ring-[#f0d7df]">
                              Hepsiburada
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className={`mt-6 rounded-2xl p-4 ${
                    selectedNoteText === result.note
                      ? "bg-[#fff0f7] ring-2 ring-[#b83280]"
                      : "bg-[#fff7f3]"
                  }`}
                >
                  <h4 className="mb-2 font-bold">Bizden alınabilecek not</h4>
                  <p className="text-sm leading-6">“{result.note}”</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button onClick={() => selectSingleText(result.note)} className="rounded-full bg-[#b83280] px-4 py-2 text-xs font-bold text-white">
                      Bu notu seç
                    </button>

                    <button onClick={() => copySingleText(result.note)} className="rounded-full border border-[#e8c4d8] px-4 py-2 text-xs font-bold text-[#b83280]">
                      Bu notu kopyala
                    </button>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-[#f0d7df] bg-[#fff0f7] p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-[#b83280]">
                        Premium ile açılacaklar
                      </p>

                      <h4 className="mt-1 text-lg font-black">
                        Daha uzun, daha kişisel ve basılabilir içerik
                      </h4>

                      <p className="mt-2 text-sm leading-6 text-[#6b4b4b]">
                        Premium pakette bu sonucun daha uzun mektup versiyonu,
                        3 farklı ton alternatifi, QR açıklama metni ve
                        basılabilir hediye kartı taslağı hazırlanır.
                      </p>
                    </div>

                    <a
                      href="/paketler"
                      className="rounded-full bg-[#b83280] px-5 py-3 text-center text-sm font-bold text-white"
                    >
                      Paketleri incele
                    </a>
                  </div>
                </div>

                {qrDataUrl && (
                  <div className="mt-6 rounded-2xl border border-[#f0d7df] bg-white p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <img src={qrDataUrl} alt="QR kodlu hediye notu" className="h-32 w-32 rounded-2xl border border-[#f0d7df] bg-white p-2" />

                      <div>
                        <h4 className="font-bold">QR kodlu not</h4>

                        <p className="mt-2 text-sm leading-6 text-[#6b4b4b]">
                          Bu QR kod sadece seçili notu taşır. Alıcı QR'ı
                          okuttuğunda bu seçtiğin notu görür.
                        </p>

                        <div className="mt-3 rounded-2xl bg-[#fff7f3] p-3 text-xs leading-5 text-[#6b4b4b]">
                          <p className="font-bold text-[#b83280]">
                            QR'a eklenen not:
                          </p>
                          <p className="mt-1">
                            “{selectedNoteText || result.note}”
                          </p>
                        </div>

                        <button onClick={downloadQrCode} className="mt-3 rounded-full bg-[#b83280] px-5 py-2 text-xs font-bold text-white">
                          QR kodu indir
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 rounded-2xl border border-[#f0d7df] bg-[#fffaf7] p-4">
                  <h4 className="font-bold text-[#b83280]">
                    Kart tasarımını seç
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-[#6b4b4b]">
                    “Kart olarak indir” butonuna bastığında seçtiğin tasarım
                    ile yazdırılabilir hediye kartı açılır.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {cardThemes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setSelectedCardTheme(theme.id)}
                        className={`rounded-2xl border p-3 text-left transition ${
                          selectedCardTheme === theme.id
                            ? "border-[#b83280] bg-[#fff0f7] ring-2 ring-[#b83280]"
                            : "border-[#f0d7df] bg-white hover:bg-[#fff0f7]"
                        }`}
                      >
                        <p className="text-sm font-black text-[#b83280]">
                          {theme.title}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#6b4b4b]">
                          {theme.description}
                        </p>
                      </button>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-black text-[#b83280]">
                        Seçilen tasarımla kart hazırla
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#6b4b4b]">
                        Kart yeni pencerede açılır. Oradan PDF olarak
                        kaydedebilir veya yazdırabilirsin.
                      </p>
                    </div>

                    <button
                      onClick={downloadSelectedCard}
                      className="rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-bold text-white"
                    >
                      Kart olarak indir
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="mb-2 font-bold">Ek içerik</h4>

                  <div className="grid gap-3">
                    {result.extra.map((item) => (
                      <div
                        key={item}
                        className={`rounded-2xl p-3 text-sm leading-6 ${
                          selectedNoteText === item
                            ? "bg-[#fff0f7] ring-2 ring-[#b83280]"
                            : "bg-[#fffaf7]"
                        }`}
                      >
                        <p>{item}</p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button onClick={() => selectSingleText(item)} className="rounded-full bg-[#b83280] px-4 py-2 text-xs font-bold text-white">
                            Bu notu seç
                          </button>

                          <button onClick={() => copySingleText(item)} className="rounded-full border border-[#e8c4d8] px-4 py-2 text-xs font-bold text-[#b83280]">
                            Bu notu kopyala
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 rounded-3xl border border-[#f0d7df] bg-[#fff0f7] p-5">
                  <p className="text-xs font-black uppercase tracking-wide text-[#b83280]">
                    Premium içerik paneli
                  </p>

                  {activePlan === "free" ? (
                    <div className="mt-3">
                      <h4 className="text-xl font-black">
                        Bu alan premium paketle açılır
                      </h4>

                      <p className="mt-2 text-sm leading-6 text-[#6b4b4b]">
                        Ücretsiz planda temel deneme yapabilirsin. Kart olarak
                        indirme, uzun premium notlar, deneyim içerikleri ve
                        özel kart tasarımları paketlerle açılır.
                      </p>

                      <a
                        href="/paketler"
                        className="mt-4 inline-flex rounded-full bg-[#b83280] px-5 py-3 text-sm font-bold text-white"
                      >
                        Paketleri incele
                      </a>
                    </div>
                  ) : (
                    <div className="mt-4 grid gap-4">
                      {(activePlan === "note" || activePlan === "premium") && (
                        <div className="rounded-2xl bg-white p-4">
                          <h4 className="font-black text-[#b83280]">
                            Not Paketi içerikleri
                          </h4>

                          <p className="mt-2 text-sm leading-6 text-[#6b4b4b]">
                            Uzun not, basılabilir kart metni, QR mesajı ve
                            farklı not tonları açıldı.
                          </p>

                          <div className="mt-4 grid gap-3">
                            {[
                              "Premium uzun not: Bu hediyeyi seçerken sadece güzel görünmesini değil, sana gerçekten dokunan bir anlam taşımasını istedim.",
                              "Basılabilir kart: Küçük bir hediye, büyük bir düşünce. Umarım yüzünde minicik de olsa bir gülümseme bırakır.",
                              "QR mesajı: Bu QR kod, hediyenin içine saklanmış dijital bir nottur.",
                            ].map((premiumText) => (
                              <div
                                key={premiumText}
                                className="rounded-2xl bg-[#fff7f3] p-3 text-sm leading-6 text-[#6b4b4b]"
                              >
                                <p>{premiumText}</p>

                                <button
                                  onClick={() => selectSingleText(premiumText)}
                                  className="mt-3 rounded-full bg-[#b83280] px-4 py-2 text-xs font-bold text-white"
                                >
                                  QR'a ekle
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {(activePlan === "experience" || activePlan === "premium") && (
                        <div className="rounded-2xl bg-white p-4">
                          <h4 className="font-black text-[#b83280]">
                            Deneyim Paketi içerikleri
                          </h4>

                          <p className="mt-2 text-sm leading-6 text-[#6b4b4b]">
                            Hediye avı, gizemli ipucu, Kader Bağları hikâyesi
                            ve Gelecekteki Ben mektubu açıldı.
                          </p>

                          <div className="mt-4 grid gap-3">
                            {[
                              "Hediye avı final mesajı: Asıl hediye kutunun içinde değil, bu sürprizin senin için düşünülmüş olmasında.",
                              "Gizemli ipucu: Cevap küçük bir kutuda, anlamı ise seni tanıyan birinin seçiminde saklı.",
                              "Kader Bağları hikâyesi: Bazı karşılaşmalar tesadüf gibi görünür ama geriye dönüp bakınca iyi ki dedirtir.",
                            ].map((premiumText) => (
                              <div
                                key={premiumText}
                                className="rounded-2xl bg-[#fff7f3] p-3 text-sm leading-6 text-[#6b4b4b]"
                              >
                                <p>{premiumText}</p>

                                <button
                                  onClick={() => selectSingleText(premiumText)}
                                  className="mt-3 rounded-full bg-[#b83280] px-4 py-2 text-xs font-bold text-white"
                                >
                                  QR'a ekle
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activePlan === "premium" && (
                        <div className="rounded-2xl bg-[#2b1b1b] p-4 text-white">
                          <h4 className="font-black text-[#ffd6e8]">
                            Premium Özel Paket
                          </h4>

                          <p className="mt-2 text-sm leading-6 text-[#ffeaf3]">
                            Tüm paketler açık. Ayrıca premium kart tasarımı,
                            özel tonlar ve daha uzun içerikler kullanabilirsin.
                          </p>

                          <button
                            onClick={downloadSelectedCard}
                            className="mt-4 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#b83280]"
                          >
                            Premium kart tasarımıyla indir
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-12 rounded-3xl bg-white p-6 shadow-sm">
                  <div className="mb-6 text-center">
                    <p className="text-sm font-bold text-[#b83280]">
                      Paketler ve gelir modeli
                    </p>

                    <h3 className="mt-2 text-3xl font-extrabold">
                      Ürünü değil, hediyenin fikrini ve notunu sunuyoruz.
                    </h3>

                    <p className="mx-auto mt-3 max-w-3xl text-sm leading-6 text-[#6b4b4b]">
                      Kullanıcı ürünü Trendyol, Amazon, Hepsiburada gibi sitelerden alır.
                      NeAlsam ise kişisel not, hikâye, bilmece ve yaratıcı sunum üretir.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
