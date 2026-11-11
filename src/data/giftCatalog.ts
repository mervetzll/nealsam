/**
 * Structured gift catalog used by Hediye Bul when the Supabase `gifts`
 * table is empty or unreachable. Every idea carries who it suits, which
 * interests and styles it matches, the occasions it fits, a risk level
 * and whether it is easy to find in a store the same day.
 *
 * Short codes keep the table readable; they are expanded to the labels
 * the rest of the app uses (see LABELS below).
 */

import type { RiskLevel } from "@/types/gift";

const RECIPIENTS = {
  S: "Sevgilim",
  A: "Annem",
  B: "Babam",
  F: "Arkadaşım",
  K: "Kardeşim",
  I: "İş arkadaşım",
} as const;

export const INTERESTS = {
  kahve: "Kahve / çay",
  bakim: "Bakım",
  ev: "Ev / dekor",
  moda: "Moda / aksesuar",
  kitap: "Kitap / kırtasiye",
  hobi: "Hobi / oyun",
  tek: "Teknoloji",
  muzik: "Müzik",
  spor: "Spor / outdoor",
  mutfak: "Mutfak / lezzet",
  bitki: "Bitki / doğa",
  seyahat: "Seyahat",
} as const;

export const STYLES = {
  rahat: "Rahat",
  bakim: "Bakım",
  romantik: "Romantik",
  kullanisli: "Kullanışlı",
  sik: "Şık",
  eglenceli: "Eğlenceli",
  duygusal: "Duygusal",
} as const;

export const OCCASIONS = {
  dg: "Doğum günü",
  yd: "Yıl dönümü",
  te: "Teşekkür",
  yi: "Yeni iş",
  ye: "Yeni ev",
} as const;

type R = keyof typeof RECIPIENTS;
type In = keyof typeof INTERESTS;
type St = keyof typeof STYLES;
type Oc = keyof typeof OCCASIONS;

type Row = {
  t: string; // title
  c: string; // category
  p: [number, number]; // price range TL
  r: R[] | "*";
  i: In[];
  s: St[];
  o: Oc[] | "*";
  risk?: RiskLevel; // default low
  today?: boolean; // easy to buy in a store today
  tags?: string[]; // extra words for exclusions and store search
  why: string;
};

const rows: Row[] = [
  // ── Kahve / çay ──────────────────────────────────────────────
  { t: "El yapımı seramik kupa", c: "Kahve / çay", p: [250, 900], r: "*", i: ["kahve"], s: ["kullanisli", "rahat"], o: "*", today: true, tags: ["kupa"], why: "Her gün kullanılan, zevk riski düşük ve kişisel hissettiren bir hediye." },
  { t: "Kişiye özel isimli kupa", c: "Kahve / çay", p: [200, 600], r: "*", i: ["kahve"], s: ["duygusal", "eglenceli"], o: ["dg", "te"], tags: ["kupa", "kişiye özel"], why: "Küçük bütçeyle kişiye özel bir dokunuş sağlar." },
  { t: "Filtre kahve demleme seti", c: "Kahve / çay", p: [700, 2200], r: ["S", "B", "F", "K", "I"], i: ["kahve"], s: ["kullanisli", "sik"], o: ["dg", "yi", "ye"], tags: ["v60", "french press"], why: "Kahveyi gerçekten seven biri için ritüele dönüşen bir hediye." },
  { t: "Kahve tadım seti", c: "Kahve / çay", p: [350, 1200], r: "*", i: ["kahve", "mutfak"], s: ["eglenceli", "kullanisli"], o: "*", today: true, tags: ["yiyecek"], why: "Farklı kahveleri denemeyi seven biri için keşif hissi verir." },
  { t: "Çelik termos", c: "Kahve / çay", p: [400, 2000], r: "*", i: ["kahve", "spor"], s: ["kullanisli"], o: ["dg", "yi", "te"], today: true, tags: ["termos"], why: "İşe, okula ya da doğaya giden herkesin her gün kullanacağı bir hediye." },
  { t: "Bitki çayı seçkisi kutusu", c: "Kahve / çay", p: [250, 800], r: "*", i: ["kahve", "bakim"], s: ["rahat", "bakim"], o: "*", today: true, tags: ["çay", "yiyecek"], why: "Sakinleştirici, samimi ve hemen her yaşa uygun bir seçim." },
  { t: "Türk kahvesi takımı", c: "Kahve / çay", p: [500, 2000], r: ["A", "B", "I"], i: ["kahve", "ev"], s: ["sik", "duygusal"], o: ["te", "ye", "dg"], today: true, why: "Geleneksel, şık ve özellikle aileye hitap eden bir hediye." },
  { t: "Elektrikli süt köpürtücü", c: "Kahve / çay", p: [400, 1500], r: ["S", "F", "K", "A"], i: ["kahve", "mutfak", "tek"], s: ["kullanisli", "eglenceli"], o: ["dg", "ye"], why: "Evde kafe keyfi isteyenler için pratik bir sürpriz." },
  { t: "Çay demleme demliği ve fincan seti", c: "Kahve / çay", p: [500, 1800], r: ["A", "B", "I"], i: ["kahve", "ev"], s: ["sik", "kullanisli"], o: ["ye", "te", "dg"], why: "Yeni eve ya da çay seven aile büyüklerine zarif bir seçim." },

  // ── Bakım ────────────────────────────────────────────────────
  { t: "El kremi seti", c: "Bakım", p: [200, 900], r: "*", i: ["bakim"], s: ["bakim", "rahat"], o: "*", today: true, tags: ["krem"], why: "Herkesin kullandığı, cilt tipi riski düşük bir bakım hediyesi." },
  { t: "Kokusuz nemlendirici bakım seti", c: "Bakım", p: [400, 1500], r: ["S", "A", "F", "K"], i: ["bakim"], s: ["bakim"], o: "*", today: true, tags: ["krem"], why: "Koku tercihini bilmediğinde güvenli bir bakım seçeneği." },
  { t: "Body mist", c: "Bakım", p: [300, 1500], r: ["S", "F", "K"], i: ["bakim"], s: ["bakim", "romantik"], o: ["dg", "yd"], risk: "medium", today: true, tags: ["kokulu", "parfüm", "body mist"], why: "Parfüme göre daha hafif ve tatlı bir koku hediyesi." },
  { t: "Mini parfüm keşif seti", c: "Bakım", p: [700, 3000], r: ["S", "F", "K", "A"], i: ["bakim", "moda"], s: ["sik", "romantik"], o: ["dg", "yd"], risk: "medium", today: true, tags: ["kokulu", "parfüm"], why: "Tek bir koku seçme riskini birkaç seçenekle azaltır." },
  { t: "Parfüm", c: "Bakım", p: [1200, 7000], r: ["S", "A", "B"], i: ["bakim", "moda"], s: ["sik", "romantik"], o: ["dg", "yd"], risk: "high", today: true, tags: ["kokulu", "parfüm"], why: "Kişinin kullandığı kokuyu biliyorsan çok etkileyici bir hediye." },
  { t: "Spa bakım kutusu", c: "Bakım", p: [500, 2000], r: ["S", "A", "F", "K"], i: ["bakim"], s: ["bakim", "rahat"], o: "*", tags: ["kokulu"], why: "Kendine vakit ayırması gereken birine dinlenme fırsatı sunar." },
  { t: "Yüz maskesi seti", c: "Bakım", p: [200, 1000], r: ["S", "F", "K"], i: ["bakim"], s: ["bakim", "eglenceli"], o: "*", today: true, why: "Eğlenceli, denenebilir ve bütçe dostu bir bakım hediyesi." },
  { t: "İpek yastık kılıfı", c: "Bakım", p: [500, 1800], r: ["S", "A", "F", "K"], i: ["bakim", "ev"], s: ["bakim", "sik"], o: ["dg", "yd"], why: "Saç ve cilt bakımına önem veren biri için şık bir detay." },
  { t: "Saç bakım seti", c: "Bakım", p: [300, 1500], r: ["S", "A", "F", "K"], i: ["bakim"], s: ["bakim"], o: "*", today: true, why: "Günlük rutine giren, işe yarayan bir bakım hediyesi." },
  { t: "Tıraş ve sakal bakım seti", c: "Bakım", p: [400, 1800], r: ["S", "B", "K", "F"], i: ["bakim"], s: ["bakim", "kullanisli"], o: ["dg", "te"], today: true, tags: ["tıraş", "sakal"], why: "Erkekler için klasik ama işe yarayan bir bakım hediyesi." },
  { t: "Banyo tuzu ve köpük seti", c: "Bakım", p: [250, 1000], r: ["S", "A", "F", "K"], i: ["bakim"], s: ["rahat", "bakim"], o: "*", today: true, tags: ["kokulu"], why: "Evde spa hissi yaratan, rahatlatıcı bir seçim." },
  { t: "Masaj aleti", c: "Bakım", p: [600, 3000], r: ["A", "B", "S"], i: ["bakim", "tek"], s: ["rahat", "kullanisli"], o: ["dg", "te"], today: true, why: "Yorgun omuzlara iyi gelen, gerçekten kullanılan bir hediye." },
  { t: "Dudak bakım seti", c: "Bakım", p: [150, 600], r: ["S", "F", "K", "I"], i: ["bakim"], s: ["bakim"], o: "*", today: true, why: "Küçük bütçeli, sevimli ve risksiz bir tamamlayıcı hediye." },

  // ── Ev / dekor ───────────────────────────────────────────────
  { t: "Kokulu mum", c: "Ev / dekor", p: [200, 1200], r: "*", i: ["ev"], s: ["rahat", "romantik"], o: "*", risk: "medium", today: true, tags: ["kokulu", "mum"], why: "Evi daha sıcak hissettiren, samimi bir hediye." },
  { t: "Kokusuz LED mum seti", c: "Ev / dekor", p: [250, 900], r: "*", i: ["ev"], s: ["rahat", "romantik"], o: "*", today: true, tags: ["mum"], why: "Koku tercihi riski olmadan aynı sıcak atmosferi verir." },
  { t: "Örgü battaniye", c: "Ev / dekor", p: [500, 2500], r: ["S", "A", "B", "F", "K"], i: ["ev"], s: ["rahat"], o: ["dg", "ye"], today: true, tags: ["battaniye"], why: "Kış akşamları için yumuşak ve sıcak bir konfor hediyesi." },
  { t: "Seramik vazo ve kuru çiçek", c: "Ev / dekor", p: [400, 1800], r: ["S", "A", "F", "I"], i: ["ev", "bitki"], s: ["sik"], o: ["ye", "dg", "te"], tags: ["vazo"], why: "Yeni bir eve ya da ofise karakter katan şık bir detay." },
  { t: "Çerçeveli fotoğraf baskısı", c: "Ev / dekor", p: [250, 1000], r: "*", i: ["ev"], s: ["duygusal", "romantik"], o: "*", tags: ["fotoğraf", "kişiye özel"], why: "Ortak bir anıyı her gün görülen bir yere taşır." },
  { t: "Kişiye özel fotoğraf albümü", c: "Ev / dekor", p: [300, 1200], r: ["S", "A", "B", "F", "K"], i: ["ev"], s: ["duygusal", "romantik"], o: ["dg", "yd"], tags: ["fotoğraf", "kişiye özel"], why: "Birlikte yaşanan anıları bir araya getiren duygusal bir hediye." },
  { t: "Yıldız haritası posteri", c: "Ev / dekor", p: [300, 1000], r: ["S"], i: ["ev"], s: ["romantik", "duygusal"], o: ["yd", "dg"], tags: ["kişiye özel", "poster"], why: "Tanıştığınız gecenin gökyüzünü gösteren romantik bir hatıra." },
  { t: "Ortam difüzörü", c: "Ev / dekor", p: [400, 1500], r: "*", i: ["ev", "bakim"], s: ["rahat"], o: ["ye", "yi"], risk: "medium", tags: ["kokulu", "oda kokusu"], why: "Ev ya da ofise kalıcı, hoş bir dokunuş." },
  { t: "Masa lambası", c: "Ev / dekor", p: [500, 2500], r: ["F", "K", "I", "S"], i: ["ev", "kitap"], s: ["kullanisli", "sik"], o: ["ye", "yi"], today: true, why: "Okuma ya da çalışma köşesi için hem şık hem işlevsel." },
  { t: "Gece lambası projektör", c: "Ev / dekor", p: [300, 1200], r: ["K", "F", "S"], i: ["ev", "tek"], s: ["eglenceli", "rahat"], o: ["dg"], today: true, why: "Odaya eğlenceli bir atmosfer katan sevimli bir hediye." },
  { t: "Kapı önü paspası (isimli)", c: "Ev / dekor", p: [300, 900], r: ["F", "K", "A"], i: ["ev"], s: ["eglenceli", "kullanisli"], o: ["ye"], tags: ["kişiye özel"], why: "Yeni ev için esprili ve işe yarayan bir karşılama hediyesi." },

  // ── Bitki / doğa ─────────────────────────────────────────────
  { t: "Saksıda sukulent seti", c: "Bitki / doğa", p: [200, 800], r: "*", i: ["bitki", "ev"], s: ["rahat", "eglenceli"], o: "*", today: true, tags: ["bitki"], why: "Bakımı kolay, yaşayan ve uzun süre hatırlanan bir hediye." },
  { t: "Bonsai ağacı", c: "Bitki / doğa", p: [500, 2500], r: ["A", "B", "I", "S"], i: ["bitki", "ev"], s: ["sik", "duygusal"], o: ["yi", "ye", "te"], tags: ["bitki"], why: "Sabır ve özen isteyen, karakterli bir hediye." },
  { t: "Mini bitki yetiştirme kiti", c: "Bitki / doğa", p: [200, 700], r: ["F", "K", "I"], i: ["bitki", "hobi"], s: ["eglenceli"], o: "*", today: true, tags: ["bitki"], why: "Tohumdan büyütme keyfi veren eğlenceli bir deneyim." },
  { t: "Çiçek buketi", c: "Bitki / doğa", p: [300, 1500], r: ["S", "A", "F", "I"], i: ["bitki"], s: ["romantik", "duygusal"], o: "*", today: true, tags: ["çiçek"], why: "Son dakikada bile anlamlı, klasik ve sevindirici." },
  { t: "Bahçe aletleri seti", c: "Bitki / doğa", p: [400, 1500], r: ["A", "B"], i: ["bitki", "hobi"], s: ["kullanisli"], o: ["dg", "ye"], why: "Balkonu ya da bahçesiyle uğraşmayı sevenler için." },

  // ── Moda / aksesuar ──────────────────────────────────────────
  { t: "Minimal gümüş kolye", c: "Takı", p: [500, 3000], r: ["S", "A", "K"], i: ["moda"], s: ["romantik", "sik"], o: ["yd", "dg"], risk: "medium", tags: ["takı", "kolye"], why: "Uzun süre takılan, zarif ve anlam yüklü bir hediye." },
  { t: "Harf ya da isim kolye", c: "Takı", p: [400, 2500], r: ["S", "A", "K"], i: ["moda"], s: ["romantik", "duygusal"], o: ["yd", "dg"], risk: "medium", tags: ["takı", "kolye", "kişiye özel"], why: "Kişiye özel olduğu için daha çok düşünülmüş hissettirir." },
  { t: "İnce bileklik", c: "Takı", p: [300, 2000], r: ["S", "K", "F"], i: ["moda"], s: ["romantik", "sik"], o: ["yd", "dg"], risk: "medium", tags: ["takı", "bileklik"], why: "Günlük kullanılabilen zarif bir takı." },
  { t: "Takı kutusu", c: "Takı", p: [300, 1200], r: ["S", "A", "K", "F"], i: ["moda", "ev"], s: ["sik", "kullanisli"], o: "*", today: true, why: "Takı seçme riski olmadan takı sevene düzen sağlar." },
  { t: "Deri kartlık", c: "Aksesuar", p: [300, 1500], r: ["S", "B", "K", "F", "I"], i: ["moda"], s: ["kullanisli", "sik"], o: ["dg", "yi", "te"], today: true, why: "Her gün cepte taşınan, şık ve kullanışlı bir aksesuar." },
  { t: "Deri cüzdan", c: "Aksesuar", p: [500, 2500], r: ["S", "B", "K"], i: ["moda"], s: ["kullanisli", "sik"], o: ["dg"], today: true, why: "Klasik ama her zaman işe yarayan bir hediye." },
  { t: "Kol saati", c: "Aksesuar", p: [1500, 8000], r: ["S", "B", "K"], i: ["moda"], s: ["sik"], o: ["dg", "yd", "yi"], risk: "medium", today: true, tags: ["saat"], why: "Uzun yıllar kullanılan, değerli hissettiren bir hediye." },
  { t: "İpek fular / eşarp", c: "Aksesuar", p: [400, 2000], r: ["A", "S"], i: ["moda"], s: ["sik"], o: ["dg", "te"], risk: "medium", today: true, why: "Zarif ve kalıcı, özellikle anneler için sevilen bir seçim." },
  { t: "Kaşmir atkı", c: "Aksesuar", p: [600, 3000], r: ["S", "A", "B"], i: ["moda"], s: ["sik", "rahat"], o: ["dg", "yd"], today: true, why: "Kışın her gün kullanılan, beden gerektirmeyen şık bir hediye." },
  { t: "Bez çanta (tote)", c: "Aksesuar", p: [200, 800], r: ["F", "K", "S"], i: ["moda", "kitap"], s: ["kullanisli", "eglenceli"], o: "*", today: true, tags: ["çanta"], why: "Pratik, şirin ve hemen her tarza uyan bir hediye." },
  { t: "Deri çanta", c: "Aksesuar", p: [1000, 5000], r: ["S", "A"], i: ["moda"], s: ["sik"], o: ["dg", "yd"], risk: "medium", tags: ["çanta"], why: "Zevkini bildiğin biri için güçlü bir hediye." },
  { t: "Güneş gözlüğü", c: "Aksesuar", p: [600, 4000], r: ["S", "K", "F"], i: ["moda", "seyahat"], s: ["sik", "eglenceli"], o: ["dg"], risk: "high", why: "Tarzını iyi bildiğin biri için havalı bir seçim." },
  { t: "Kemer", c: "Aksesuar", p: [400, 2000], r: ["B", "S"], i: ["moda"], s: ["kullanisli", "sik"], o: ["dg"], risk: "medium", tags: ["beden"], why: "Klasik ve kullanışlı bir erkek aksesuarı." },
  { t: "Kravat ve mendil seti", c: "Aksesuar", p: [400, 1500], r: ["B", "I"], i: ["moda"], s: ["sik"], o: ["yi", "dg"], risk: "medium", why: "Yeni iş ya da özel davetler için şık bir dokunuş." },

  // ── Rahat / ev giyim ─────────────────────────────────────────
  { t: "Pamuklu pijama takımı", c: "Ev giyim", p: [700, 2500], r: ["S", "A", "K", "F"], i: ["ev"], s: ["rahat"], o: ["dg"], risk: "medium", today: true, tags: ["giyim", "beden", "pijama"], why: "Rahat ve samimi; bedenini bildiğin biri için ideal." },
  { t: "Saten pijama takımı", c: "Ev giyim", p: [900, 3000], r: ["S", "A"], i: ["ev", "moda"], s: ["rahat", "sik", "romantik"], o: ["yd", "dg"], risk: "medium", tags: ["giyim", "beden", "pijama"], why: "Daha şık ve özel hissettiren zarif bir ev giyimi." },
  { t: "Peluş sabahlık", c: "Ev giyim", p: [800, 2500], r: ["S", "A", "K"], i: ["ev"], s: ["rahat"], o: ["dg"], risk: "medium", today: true, tags: ["giyim", "beden"], why: "Kış ayları için yumuşacık bir konfor hediyesi." },
  { t: "Ev terliği", c: "Ev giyim", p: [300, 1200], r: "*", i: ["ev"], s: ["rahat", "kullanisli"], o: ["ye", "dg"], risk: "medium", today: true, tags: ["giyim", "terlik", "beden"], why: "Küçük ama her gün kullanılan sıcak bir hediye." },
  { t: "Desenli çorap seti", c: "Ev giyim", p: [200, 800], r: "*", i: ["moda"], s: ["eglenceli", "rahat"], o: "*", today: true, tags: ["giyim"], why: "Eğlenceli, ucuz ve neredeyse hiç beden riski yok." },
  { t: "İpek uyku maskesi", c: "Ev giyim", p: [200, 900], r: ["S", "F", "K", "A"], i: ["bakim", "seyahat"], s: ["rahat", "bakim"], o: "*", today: true, why: "Uyku düzenine önem veren biri için küçük ama düşünceli." },
  { t: "Kapüşonlu sweatshirt", c: "Giyim", p: [600, 2500], r: ["S", "K", "F"], i: ["moda"], s: ["rahat"], o: ["dg"], risk: "high", today: true, tags: ["giyim", "beden", "sweatshirt"], why: "Rahat ve sevilen bir parça; beden ve tarz bilgisi gerekir." },

  // ── Kitap / kırtasiye ────────────────────────────────────────
  { t: "Sevdiği yazardan yeni kitap", c: "Kitap / kırtasiye", p: [150, 600], r: "*", i: ["kitap"], s: ["duygusal", "kullanisli"], o: "*", today: true, tags: ["kitap"], why: "Okuma zevkini bildiğin biri için samimi ve anlamlı." },
  { t: "Kitap ayracı ve not kartı seti", c: "Kitap / kırtasiye", p: [150, 500], r: "*", i: ["kitap"], s: ["duygusal", "eglenceli"], o: "*", today: true, tags: ["ayraç"], why: "Kitap seven biri için küçük ama düşünülmüş bir dokunuş." },
  { t: "Kitap okuma lambası", c: "Kitap / kırtasiye", p: [250, 900], r: "*", i: ["kitap", "tek"], s: ["kullanisli"], o: "*", today: true, why: "Gece okumayı seven biri için pratik bir hediye." },
  { t: "Deri kapaklı ajanda", c: "Kitap / kırtasiye", p: [250, 1200], r: ["I", "F", "K", "B", "A"], i: ["kitap"], s: ["kullanisli", "sik"], o: ["yi", "dg", "te"], today: true, tags: ["defter"], why: "Planlı yaşamayı seven ya da yeni işe başlayan biri için." },
  { t: "Dolma kalem", c: "Kitap / kırtasiye", p: [500, 3000], r: ["B", "I", "A"], i: ["kitap"], s: ["sik"], o: ["yi", "te", "dg"], why: "Klasik, zarif ve yıllarca saklanan bir hediye." },
  { t: "Anı defteri (birlikte doldurmalı)", c: "Kitap / kırtasiye", p: [200, 700], r: ["S", "F", "K"], i: ["kitap"], s: ["duygusal", "romantik"], o: ["yd", "dg"], tags: ["defter", "kişiye özel"], why: "Birlikte doldurulan sayfalarla ilişkiye özel bir hatıra." },
  { t: "Kitap abonelik kutusu", c: "Kitap / kırtasiye", p: [400, 1500], r: ["S", "F", "K", "A"], i: ["kitap"], s: ["eglenceli", "duygusal"], o: ["dg"], tags: ["kitap"], why: "Her ay yeni bir sürprizle hediyeyi uzatır." },
  { t: "Kişiye özel kartvizitlik", c: "Kitap / kırtasiye", p: [300, 1000], r: ["I", "B", "F"], i: ["kitap", "moda"], s: ["sik", "kullanisli"], o: ["yi"], tags: ["kişiye özel"], why: "Yeni iş için profesyonel ve kişisel bir başlangıç." },

  // ── Hobi / oyun ──────────────────────────────────────────────
  { t: "1000 parça puzzle", c: "Hobi / oyun", p: [250, 1000], r: "*", i: ["hobi"], s: ["eglenceli", "rahat"], o: "*", today: true, tags: ["puzzle"], why: "Sakin akşamlar için keyifli ve paylaşılabilir bir uğraş." },
  { t: "Kişiye özel fotoğraflı puzzle", c: "Hobi / oyun", p: [300, 900], r: ["S", "F", "K", "A"], i: ["hobi"], s: ["eglenceli", "duygusal"], o: ["dg", "yd"], tags: ["puzzle", "kişiye özel"], why: "Ortak bir fotoğrafı eğlenceli bir sürprize dönüştürür." },
  { t: "Kutu oyunu", c: "Hobi / oyun", p: [400, 2000], r: ["F", "K", "S"], i: ["hobi"], s: ["eglenceli"], o: ["dg", "ye"], today: true, tags: ["oyun"], why: "Arkadaş ve aile buluşmalarını şenlendiren bir hediye." },
  { t: "Çiftlere özel soru kartları oyunu", c: "Hobi / oyun", p: [200, 600], r: ["S"], i: ["hobi"], s: ["romantik", "eglenceli"], o: ["yd", "dg"], tags: ["oyun"], why: "Birlikte vakit geçirip birbirinizi daha iyi tanımanızı sağlar." },
  { t: "Akrilik boya ve tuval seti", c: "Hobi / oyun", p: [300, 1500], r: ["F", "K", "S", "A"], i: ["hobi"], s: ["eglenceli", "duygusal"], o: ["dg"], today: true, tags: ["boya"], why: "Yaratıcı birine yeni bir hobi kapısı açar." },
  { t: "Seramik boyama kiti", c: "Hobi / oyun", p: [300, 1000], r: ["F", "K", "S"], i: ["hobi"], s: ["eglenceli"], o: ["dg"], tags: ["boya"], why: "Elle bir şey üretmeyi seven biri için keyifli bir deneyim." },
  { t: "Örgü / makrame başlangıç seti", c: "Hobi / oyun", p: [250, 900], r: ["A", "F", "K", "S"], i: ["hobi"], s: ["rahat", "eglenceli"], o: "*", why: "Sakinleştirici, yeni bir el işi hobisi." },
  { t: "Mozaik / elmas boyama seti", c: "Hobi / oyun", p: [200, 800], r: ["A", "K", "F"], i: ["hobi"], s: ["rahat", "eglenceli"], o: "*", today: true, why: "Uzun saatler oyalayan, rahatlatıcı bir uğraş." },
  { t: "Lego / yapım seti", c: "Hobi / oyun", p: [600, 4000], r: ["K", "S", "F"], i: ["hobi", "tek"], s: ["eglenceli"], o: ["dg"], today: true, tags: ["oyun"], why: "Her yaşta keyif veren, sergilenebilir bir hobi hediyesi." },
  { t: "Atölye deneyimi hediye çeki", c: "Deneyim", p: [600, 2500], r: ["S", "F", "K", "A"], i: ["hobi", "mutfak"], s: ["eglenceli", "duygusal"], o: ["dg", "yd"], tags: ["deneyim"], why: "Eşyadan çok anı biriktirmeyi sevenler için." },
  { t: "Kaçış oyunu (escape room) bileti", c: "Deneyim", p: [500, 1500], r: ["F", "K", "S"], i: ["hobi"], s: ["eglenceli"], o: ["dg"], tags: ["deneyim", "oyun"], why: "Birlikte yaşanacak heyecanlı bir deneyim." },
  { t: "Polaroid fotoğraf makinesi", c: "Hobi / oyun", p: [2000, 5000], r: ["S", "K", "F"], i: ["hobi", "tek"], s: ["eglenceli", "duygusal"], o: ["dg", "yd"], today: true, why: "Anıları anında fiziksel hatıraya çeviren eğlenceli bir hediye." },

  // ── Teknoloji ────────────────────────────────────────────────
  { t: "Kablosuz kulak içi kulaklık", c: "Teknoloji", p: [800, 5000], r: ["S", "K", "F", "B"], i: ["tek", "muzik"], s: ["kullanisli"], o: ["dg"], today: true, tags: ["kulaklık"], why: "Müzik dinleyen ya da çok konuşan biri için her gün kullanılır." },
  { t: "Taşınabilir Bluetooth hoparlör", c: "Teknoloji", p: [600, 3000], r: ["S", "K", "F", "B"], i: ["tek", "muzik", "spor"], s: ["eglenceli", "kullanisli"], o: ["dg", "ye"], today: true, tags: ["hoparlör"], why: "Evde, piknikte ya da duşta müziği yanında taşıtır." },
  { t: "Powerbank", c: "Teknoloji", p: [400, 2000], r: "*", i: ["tek", "seyahat"], s: ["kullanisli"], o: ["dg", "yi", "te"], today: true, tags: ["powerbank"], why: "Telefonu hep yanında olan herkes için pratik bir kurtarıcı." },
  { t: "Kablosuz şarj standı", c: "Teknoloji", p: [400, 1500], r: ["S", "B", "K", "F", "I"], i: ["tek"], s: ["kullanisli", "sik"], o: ["yi", "dg"], today: true, why: "Masa düzenini güzelleştiren, her gün kullanılan bir aksesuar." },
  { t: "Akıllı bileklik", c: "Teknoloji", p: [800, 3000], r: ["S", "B", "A", "K"], i: ["tek", "spor"], s: ["kullanisli"], o: ["dg"], today: true, why: "Sağlığına ve adımlarına dikkat eden biri için faydalı." },
  { t: "Dijital fotoğraf çerçevesi", c: "Teknoloji", p: [1000, 3000], r: ["A", "B"], i: ["tek", "ev"], s: ["duygusal"], o: ["dg", "te"], why: "Aile fotoğraflarını sürekli gösteren duygusal bir teknoloji hediyesi." },
  { t: "Akıllı ampul / LED şerit", c: "Teknoloji", p: [300, 1200], r: ["K", "F", "S"], i: ["tek", "ev"], s: ["eglenceli"], o: ["ye", "dg"], today: true, why: "Odanın havasını telefondan değiştirmek isteyenler için." },
  { t: "Mekanik klavye", c: "Teknoloji", p: [1000, 4000], r: ["K", "F", "S"], i: ["tek", "hobi"], s: ["kullanisli", "eglenceli"], o: ["dg"], risk: "medium", why: "Bilgisayar başında çok vakit geçiren biri için keyifli bir yükseltme." },
  { t: "E-kitap okuyucu", c: "Teknoloji", p: [3000, 7000], r: ["S", "A", "K", "F"], i: ["tek", "kitap"], s: ["kullanisli"], o: ["dg", "yd"], why: "Çok okuyan biri için yüzlerce kitabı cebe sığdırır." },
  { t: "Telefon için gimbal / tripod", c: "Teknoloji", p: [500, 2500], r: ["K", "F", "S"], i: ["tek", "hobi"], s: ["eglenceli", "kullanisli"], o: ["dg"], today: true, why: "Video ve fotoğraf çekmeyi seven biri için." },
  { t: "Masaüstü düzenleyici ve kablo seti", c: "Teknoloji", p: [250, 900], r: ["I", "B", "F"], i: ["tek", "kitap"], s: ["kullanisli"], o: ["yi"], today: true, why: "Yeni işe başlayan ya da masası dağınık biri için pratik." },

  // ── Müzik ────────────────────────────────────────────────────
  { t: "Plak ya da sevdiği albüm", c: "Müzik", p: [400, 1500], r: ["S", "F", "K", "B"], i: ["muzik"], s: ["duygusal", "sik"], o: ["dg", "yd"], why: "Müzik zevkini bildiğin biri için nostaljik ve özel." },
  { t: "Pikap", c: "Müzik", p: [2500, 8000], r: ["S", "B", "K"], i: ["muzik", "ev"], s: ["sik", "duygusal"], o: ["dg", "yd"], why: "Müzik dinlemeyi ritüele dönüştüren büyük bir hediye." },
  { t: "Konser bileti", c: "Deneyim", p: [600, 3000], r: ["S", "F", "K"], i: ["muzik"], s: ["eglenceli", "romantik"], o: ["dg", "yd"], tags: ["deneyim"], why: "Birlikte yaşanacak, unutulmaz bir deneyim." },
  { t: "Ukulele başlangıç seti", c: "Müzik", p: [800, 2500], r: ["K", "F", "S"], i: ["muzik", "hobi"], s: ["eglenceli"], o: ["dg"], why: "Müzik yapmak isteyen birine yeni bir kapı açar." },
  { t: "Müzik kutusu", c: "Müzik", p: [250, 900], r: ["S", "A", "K"], i: ["muzik", "ev"], s: ["romantik", "duygusal"], o: ["yd", "dg"], why: "Küçük, nostaljik ve duygusal bir hatıra." },

  // ── Spor / outdoor ───────────────────────────────────────────
  { t: "Yoga matı ve blok seti", c: "Spor / outdoor", p: [400, 1500], r: ["S", "A", "F", "K"], i: ["spor", "bakim"], s: ["kullanisli", "rahat"], o: ["dg"], today: true, why: "Hareket etmeyi seven ya da başlamak isteyen biri için." },
  { t: "Akıllı su şişesi", c: "Spor / outdoor", p: [300, 1200], r: "*", i: ["spor"], s: ["kullanisli"], o: "*", today: true, why: "Gün içinde su içmeyi hatırlatan pratik bir hediye." },
  { t: "Kamp feneri ve outdoor seti", c: "Spor / outdoor", p: [400, 1500], r: ["B", "K", "F", "S"], i: ["spor", "seyahat"], s: ["kullanisli", "eglenceli"], o: ["dg"], today: true, why: "Doğada vakit geçirmeyi seven biri için işe yarar." },
  { t: "Spor çantası", c: "Spor / outdoor", p: [500, 2000], r: ["S", "K", "F", "B"], i: ["spor", "moda"], s: ["kullanisli"], o: ["dg"], today: true, tags: ["çanta"], why: "Spora düzenli giden biri için her gün kullanılan bir hediye." },
  { t: "Masaj topu ve köpük rulo", c: "Spor / outdoor", p: [250, 900], r: ["S", "K", "F", "B"], i: ["spor", "bakim"], s: ["kullanisli"], o: "*", today: true, why: "Antrenman sonrası rahatlamak için pratik bir set." },
  { t: "Bisiklet aksesuar seti", c: "Spor / outdoor", p: [400, 1800], r: ["B", "K", "F", "S"], i: ["spor"], s: ["kullanisli"], o: ["dg"], why: "Bisiklet tutkunu biri için güvenlik ve konfor sağlar." },

  // ── Seyahat ──────────────────────────────────────────────────
  { t: "Seyahat organizer seti", c: "Seyahat", p: [300, 1200], r: "*", i: ["seyahat"], s: ["kullanisli"], o: ["dg", "yi"], today: true, why: "Sık seyahat eden biri için valiz düzenini kolaylaştırır." },
  { t: "Boyun yastığı ve uyku seti", c: "Seyahat", p: [250, 900], r: "*", i: ["seyahat"], s: ["rahat", "kullanisli"], o: "*", today: true, why: "Uzun yolculukları daha rahat hale getirir." },
  { t: "Kazıma dünya haritası", c: "Seyahat", p: [250, 800], r: ["S", "F", "K"], i: ["seyahat", "ev"], s: ["eglenceli", "duygusal"], o: ["dg", "yd"], tags: ["poster"], why: "Gezdiği yerleri işaretleyip sergileyebileceği bir hatıra." },
  { t: "Pasaport kılıfı (isimli)", c: "Seyahat", p: [250, 900], r: ["S", "F", "K"], i: ["seyahat", "moda"], s: ["sik", "kullanisli"], o: ["dg"], tags: ["kişiye özel"], why: "Seyahat seven biri için kişisel ve kullanışlı." },
  { t: "Kabin boy valiz", c: "Seyahat", p: [1500, 5000], r: ["S", "K", "A", "B"], i: ["seyahat"], s: ["kullanisli", "sik"], o: ["dg", "yi"], why: "Sık seyahat eden biri için uzun süre kullanılan büyük bir hediye." },

  // ── Mutfak / lezzet ──────────────────────────────────────────
  { t: "Gurme çikolata kutusu", c: "Mutfak / lezzet", p: [250, 1200], r: "*", i: ["mutfak"], s: ["romantik", "eglenceli"], o: "*", today: true, tags: ["çikolata", "yiyecek", "tatlı"], why: "Son dakikada bile sevindiren, klasik bir tatlı hediye." },
  { t: "Zeytinyağı ve baharat seti", c: "Mutfak / lezzet", p: [300, 1200], r: ["A", "B", "I", "F"], i: ["mutfak"], s: ["kullanisli", "sik"], o: ["ye", "te"], today: true, tags: ["yiyecek"], why: "Yemek yapmayı seven ya da yeni ev kuran biri için." },
  { t: "Kişiye özel kesme tahtası", c: "Mutfak / lezzet", p: [300, 1000], r: ["A", "S", "F", "K"], i: ["mutfak", "ev"], s: ["kullanisli", "duygusal"], o: ["ye", "dg"], tags: ["kişiye özel"], why: "Mutfakta her gün kullanılan, isim yazılabilen bir hediye." },
  { t: "Yemek kitabı ve önlük", c: "Mutfak / lezzet", p: [300, 1000], r: ["A", "S", "F", "K", "B"], i: ["mutfak", "kitap"], s: ["eglenceli", "kullanisli"], o: ["ye", "dg"], today: true, why: "Mutfakta yeni tarifler denemeyi seven biri için." },
  { t: "Kurabiye ve atıştırmalık kutusu", c: "Mutfak / lezzet", p: [250, 900], r: "*", i: ["mutfak"], s: ["eglenceli", "rahat"], o: "*", today: true, tags: ["kurabiye", "atıştırmalık", "yiyecek", "tatlı"], why: "Paylaşılabilir, samimi ve her ofise uygun bir ikram." },
  { t: "Kahvaltılık reçel ve bal seti", c: "Mutfak / lezzet", p: [300, 1000], r: ["A", "B", "I", "F"], i: ["mutfak"], s: ["rahat"], o: ["te", "ye"], today: true, tags: ["yiyecek"], why: "Aileye ya da yeni komşuya sıcak bir teşekkür hediyesi." },
  { t: "Şarap ve peynir eşleşme kutusu", c: "Mutfak / lezzet", p: [800, 2500], r: ["S", "F", "B"], i: ["mutfak"], s: ["sik", "romantik"], o: ["yd", "ye"], risk: "medium", tags: ["yiyecek"], why: "Keyifli bir akşam yemeği için özel bir kutu." },
  { t: "Waffle / tost makinesi", c: "Mutfak / lezzet", p: [800, 2500], r: ["F", "K", "S", "A"], i: ["mutfak", "tek"], s: ["eglenceli", "kullanisli"], o: ["ye", "dg"], today: true, why: "Kahvaltıları şenlendiren, yeni ev için eğlenceli bir hediye." },
  { t: "Kaliteli bıçak seti", c: "Mutfak / lezzet", p: [1000, 4000], r: ["A", "B", "S"], i: ["mutfak"], s: ["kullanisli", "sik"], o: ["ye", "dg"], why: "Yemek yapmayı ciddiye alan biri için uzun ömürlü bir hediye." },

  // ── Duygusal / kişiye özel ───────────────────────────────────
  { t: "QR kodlu özel not kartı", c: "Kişiye özel", p: [50, 250], r: "*", i: [], s: ["duygusal", "romantik"], o: "*", today: true, tags: ["kişiye özel", "not"], why: "Düşük bütçeyle hediyeyi çok daha kişisel hale getirir." },
  { t: "El yazısı mektup ve mühür seti", c: "Kişiye özel", p: [200, 700], r: ["S", "A", "F", "K"], i: ["kitap"], s: ["duygusal", "romantik"], o: "*", tags: ["not"], why: "Bugünlerde nadir olan, kalıcı ve anlamlı bir jest." },
  { t: "Kişiye özel anı kutusu", c: "Kişiye özel", p: [400, 1500], r: ["S", "F", "K", "A"], i: ["ev"], s: ["duygusal", "romantik"], o: ["yd", "dg"], tags: ["kişiye özel"], why: "Biletler, fotoğraflar ve notlarla dolu duygusal bir hediye." },
  { t: "\"Sebeplerim\" kavanozu", c: "Kişiye özel", p: [150, 500], r: ["S", "A", "F", "K"], i: [], s: ["romantik", "duygusal"], o: ["yd", "dg"], tags: ["kişiye özel", "not"], why: "Onu neden sevdiğini küçük notlarla anlatan bir sürpriz." },
  { t: "Gravürlü anahtarlık", c: "Kişiye özel", p: [150, 600], r: "*", i: ["moda"], s: ["duygusal", "kullanisli"], o: "*", tags: ["kişiye özel"], why: "Her gün yanında taşıyacağı küçük, kişisel bir hatıra." },
  { t: "Kişiye özel karikatür / illüstrasyon", c: "Kişiye özel", p: [400, 1500], r: ["S", "F", "K", "A", "B"], i: ["ev", "hobi"], s: ["eglenceli", "duygusal"], o: ["dg", "yd"], tags: ["kişiye özel", "poster"], why: "Eğlenceli ve tamamen ona özel bir duvar süsü." },

  // ── İş / ofis ────────────────────────────────────────────────
  { t: "Masa bitkisi ve saksı", c: "İş / ofis", p: [200, 800], r: ["I", "F"], i: ["bitki", "ev"], s: ["sik", "rahat"], o: ["yi", "te"], today: true, tags: ["bitki"], why: "Yeni masaya canlılık katan, risksiz bir iş hediyesi." },
  { t: "Ofis için kupa ve kahve seti", c: "İş / ofis", p: [250, 900], r: ["I", "F"], i: ["kahve"], s: ["kullanisli"], o: ["yi", "te"], today: true, tags: ["kupa", "yiyecek"], why: "İş arkadaşına sıcak, samimi ve uygun fiyatlı bir teşekkür." },
  { t: "Ergonomik laptop standı", c: "İş / ofis", p: [400, 1500], r: ["I", "F", "K", "S"], i: ["tek"], s: ["kullanisli"], o: ["yi"], today: true, why: "Bilgisayar başında çalışan biri için gerçekten işe yarar." },
  { t: "Mouse pad ve masa matı", c: "İş / ofis", p: [200, 800], r: ["I", "K", "F"], i: ["tek"], s: ["kullanisli", "sik"], o: ["yi"], today: true, why: "Masayı toparlayan, uygun fiyatlı bir iş hediyesi." },
  { t: "Kalemlik ve masa organizeri", c: "İş / ofis", p: [200, 800], r: ["I", "B"], i: ["kitap"], s: ["kullanisli", "sik"], o: ["yi", "te"], today: true, why: "Yeni ofise düzen getiren şık bir detay." },
];

function expand(row: Row, index: number) {
  const recipients = row.r === "*" ? Object.values(RECIPIENTS) : row.r.map((code) => RECIPIENTS[code]);
  const occasions = row.o === "*" ? [...Object.values(OCCASIONS), "Her durum"] : row.o.map((code) => OCCASIONS[code]);
  const interests = row.i.map((code) => INTERESTS[code]);
  const styles = row.s.map((code) => STYLES[code]);

  return {
    id: `catalog-${index + 1}`,
    title: row.t,
    category: row.c,
    subCategory: row.c,
    priceMin: row.p[0],
    priceMax: row.p[1],
    price: `${row.p[0].toLocaleString("tr-TR")}–${row.p[1].toLocaleString("tr-TR")} TL`,
    recipients,
    interests,
    styles,
    occasions,
    urgency: row.today ? ["Bugün lazım", "Yarın lazım", "3 gün içinde"] : ["3 gün içinde", "Zamanım var"],
    riskLevel: row.risk ?? "low",
    reason: row.why,
    description: row.why,
    note: "",
    searchQuery: row.t.replace(/[()"]/g, ""),
    tags: [row.c.toLocaleLowerCase("tr"), ...(row.tags ?? [])],
  };
}

export const giftCatalog = rows.map(expand);
