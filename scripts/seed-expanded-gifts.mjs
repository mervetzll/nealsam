import fs from "fs";
import path from "path";
import vm from "vm";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf8");

  for (const line of content.split("\n")) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) continue;

    const index = trimmed.indexOf("=");

    if (index === -1) continue;

    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();

    value = value.replace(/^["']|["']$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.join(process.cwd(), ".env.local"));
loadEnvFile(path.join(process.cwd(), ".env"));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL veya SUPABASE_SERVICE_ROLE_KEY eksik.");
  process.exit(1);
}

const catalogPath = path.join(process.cwd(), "src/data/expandedGiftCatalog.ts");

if (!fs.existsSync(catalogPath)) {
  console.error("src/data/expandedGiftCatalog.ts bulunamadı.");
  process.exit(1);
}

const source = fs.readFileSync(catalogPath, "utf8");

const executableSource = source
  .replace("export const expandedGiftCatalog =", "const expandedGiftCatalog =")
  .replace(/;?\s*$/, "\nresult = expandedGiftCatalog;");

const sandbox = {
  result: [],
};

vm.createContext(sandbox);
vm.runInContext(executableSource, sandbox);

const catalog = Array.isArray(sandbox.result) ? sandbox.result : [];

if (catalog.length === 0) {
  console.error("Katalog boş görünüyor.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

function parsePriceRange(value) {
  const raw = String(value || "");
  const numbers =
    raw
      .replace(/\./g, "")
      .match(/\d+/g)
      ?.map((item) => Number(item))
      .filter((item) => Number.isFinite(item)) || [];

  if (numbers.length >= 2) {
    return {
      min: numbers[0],
      max: numbers[1],
    };
  }

  if (numbers.length === 1) {
    return {
      min: numbers[0],
      max: numbers[0],
    };
  }

  return {
    min: 0,
    max: 999999,
  };
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

function detectRecipients(item) {
  const text = normalizeText(`${item.title} ${item.category} ${item.description} ${(item.tags || []).join(" ")}`);

  const recipients = ["arkadaş"];

  if (text.includes("pijama") || text.includes("bakim") || text.includes("body mist") || text.includes("kolye")) {
    recipients.push("sevgili", "anne");
  }

  if (text.includes("erkek") || text.includes("tisort") || text.includes("sweatshirt") || text.includes("tiras") || text.includes("kemer")) {
    recipients.push("erkek", "baba", "erkek arkadaş");
  }

  if (text.includes("kitap") || text.includes("hobi") || text.includes("kulaklik") || text.includes("powerbank")) {
    recipients.push("kardeş");
  }

  return [...new Set(recipients)];
}

function detectInterests(item) {
  const text = normalizeText(`${item.title} ${item.category} ${item.description} ${(item.tags || []).join(" ")}`);
  const interests = [];

  if (text.includes("kahve") || text.includes("cay") || text.includes("kupa") || text.includes("termos")) interests.push("kahve", "çay");
  if (text.includes("bakim") || text.includes("body mist") || text.includes("krem") || text.includes("spa") || text.includes("maske")) interests.push("bakım");
  if (text.includes("dekor") || text.includes("mum") || text.includes("oda kokusu") || text.includes("vazo") || text.includes("abajur")) interests.push("ev", "dekorasyon");
  if (text.includes("kolye") || text.includes("bileklik") || text.includes("kupe") || text.includes("canta") || text.includes("saat")) interests.push("moda", "aksesuar");
  if (text.includes("kitap") || text.includes("defter") || text.includes("puzzle") || text.includes("hobi")) interests.push("kitap", "hobi");
  if (text.includes("kulaklik") || text.includes("powerbank") || text.includes("hoparlor") || text.includes("telefon")) interests.push("teknoloji");
  if (text.includes("pijama") || text.includes("battaniye") || text.includes("sabahlik") || text.includes("terlik")) interests.push("cozy", "ev giyim");

  return interests.length ? [...new Set(interests)] : ["genel"];
}

function detectStyles(item) {
  const text = normalizeText(`${item.title} ${item.category} ${item.description} ${(item.tags || []).join(" ")}`);
  const styles = [];

  if (text.includes("cozy") || text.includes("pijama") || text.includes("battaniye") || text.includes("ev giyim")) styles.push("cozy", "rahat");
  if (text.includes("bakim") || text.includes("spa") || text.includes("krem") || text.includes("body mist")) styles.push("bakım", "self-care");
  if (text.includes("kolye") || text.includes("bileklik") || text.includes("parfum") || text.includes("romantik")) styles.push("romantik", "şık");
  if (text.includes("termos") || text.includes("cuzdan") || text.includes("kartlik") || text.includes("powerbank")) styles.push("kullanışlı");
  if (text.includes("premium") || text.includes("saat") || text.includes("parfum")) styles.push("premium");

  return styles.length ? [...new Set(styles)] : ["kullanışlı"];
}

function detectOccasions(item) {
  const text = normalizeText(`${item.title} ${item.category} ${item.description} ${(item.tags || []).join(" ")}`);

  const occasions = ["doğum günü", "özel gün"];

  if (text.includes("romantik") || text.includes("kolye") || text.includes("parfum")) {
    occasions.push("sevgililer günü", "yıl dönümü");
  }

  if (text.includes("anne") || text.includes("bakim") || text.includes("dekor")) {
    occasions.push("anneler günü");
  }

  if (text.includes("kitap") || text.includes("defter") || text.includes("kalem")) {
    occasions.push("mezuniyet");
  }

  return [...new Set(occasions)];
}

function detectUrgency(item) {
  const text = normalizeText(`${item.title} ${item.category} ${item.description} ${(item.tags || []).join(" ")}`);

  const urgency = ["3 gün içinde", "acelesi yok"];

  if (text.includes("kupa") || text.includes("body mist") || text.includes("el kremi") || text.includes("mum") || text.includes("cikolata")) {
    urgency.push("bugün lazım", "yarın lazım");
  }

  if (text.includes("pijama") || text.includes("kolye") || text.includes("parfum") || text.includes("canta")) {
    urgency.push("yarın lazım");
  }

  return [...new Set(urgency)];
}

function detectRiskLevel(item) {
  const text = normalizeText(`${item.title} ${item.category} ${item.description} ${(item.tags || []).join(" ")}`);

  if (text.includes("parfum") || text.includes("giyim") || text.includes("pijama") || text.includes("canta")) return "medium";
  if (text.includes("yuzuk") || text.includes("saat")) return "medium";
  return "low";
}

function buildSearchQuery(item) {
  return String(item.title || item.name || "hediye")
    .replace(/\/.*/g, "")
    .trim();
}

function buildNote(item) {
  const title = item.title || item.name || "Bu hediye";
  return `${title} hediyesini küçük bir not, özenli paketleme veya QR özel mesaj ile daha kişisel hale getirebilirsin.`;
}

function normalizeGift(item) {
  const title = item.title || item.name || "Hediye";
  const category = item.category || "Genel";
  const priceRange = parsePriceRange(item.price || item.budget);
  const description = item.description || item.reason || "Bu hediye günlük kullanım ve hediyeleşme için uygun bir seçenektir.";
  const tags = Array.isArray(item.tags) ? item.tags : [];

  return {
    title,
    category,
    sub_category: item.sub_category || item.subCategory || category,
    price_min: item.price_min || item.priceMin || priceRange.min,
    price_max: item.price_max || item.priceMax || priceRange.max,
    recipients: item.recipients || detectRecipients(item),
    interests: item.interests || detectInterests(item),
    styles: item.styles || detectStyles(item),
    occasions: item.occasions || detectOccasions(item),
    urgency: item.urgency || detectUrgency(item),
    risk_level: item.risk_level || item.riskLevel || detectRiskLevel(item),
    reason: item.reason || description,
    note: item.note || buildNote(item),
    search_query: item.search_query || item.searchQuery || buildSearchQuery(item),
    is_active: true,
    price: item.price || item.budget || null,
    budget: item.budget || item.price || null,
    description,
    tags,
    updated_at: new Date().toISOString(),
  };
}

const gifts = catalog.map(normalizeGift);

let inserted = 0;
let updated = 0;

for (const gift of gifts) {
  const { data: existing, error: findError } = await supabase
    .from("gifts")
    .select("id,title,category")
    .eq("title", gift.title)
    .eq("category", gift.category)
    .maybeSingle();

  if (findError) {
    console.error("Arama hatası:", gift.title, findError.message);
    continue;
  }

  if (existing?.id) {
    const { error: updateError } = await supabase
      .from("gifts")
      .update(gift)
      .eq("id", existing.id);

    if (updateError) {
      console.error("Güncelleme hatası:", gift.title, updateError.message);
    } else {
      updated += 1;
    }

    continue;
  }

  const { error: insertError } = await supabase
    .from("gifts")
    .insert(gift);

  if (insertError) {
    console.error("Ekleme hatası:", gift.title, insertError.message);
  } else {
    inserted += 1;
  }
}

console.log(`Tamamlandı. Yeni eklenen: ${inserted}, güncellenen: ${updated}`);
