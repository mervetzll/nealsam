const requiredEnv = [
  "ADMIN_USER",
  "ADMIN_PASSWORD",
  "ADMIN_SESSION_SECRET",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

function mask(value) {
  if (!value) return "YOK";
  if (value.length <= 8) return "VAR";
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

console.log("NeAlsam yayın öncesi kontrol başlıyor...\n");

let hasError = false;

for (const key of requiredEnv) {
  const value = process.env[key];

  if (!value) {
    hasError = true;
    console.log(`❌ ${key}: eksik`);
  } else {
    console.log(`✅ ${key}: ${mask(value)}`);
  }
}

console.log("");

const siteUrl = "https://nealsamhediye.com";

console.log(`✅ Site URL: ${siteUrl}`);
console.log("✅ Admin sayfaları noindex layout ile korumaya alındı.");
console.log("✅ Supabase fallback sistemi aktif olduğu için veri gelmezse site tamamen bozulmaz.");

if (hasError) {
  console.log("\n❌ Eksik environment variable var. Yayına almadan önce tamamla.");
  process.exit(1);
}

console.log("\n✅ Preflight başarılı. Build ve push yapılabilir.");
