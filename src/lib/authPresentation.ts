export function safeReturnPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u0020]/.test(value)) return "/hesabim";
  try {
    const url = new URL(value, "https://nealsam.invalid");
    if (url.origin !== "https://nealsam.invalid" || url.pathname === "/giris") return "/hesabim";
    return url.pathname + url.search + url.hash;
  } catch { return "/hesabim"; }
}

export function authErrorMessage(error: { code?: string; message?: string; status?: number }) {
  if (error.code === "invalid_credentials") return "E-posta veya şifre doğru değil. Bilgilerini kontrol et ya da şifreni yenile.";
  if (error.code === "email_not_confirmed") return "Önce e-postandaki doğrulama bağlantısını aç. Gerekiyorsa aşağıdan yeniden gönder.";
  if (error.status === 429 || error.code?.includes("rate_limit")) return "Çok fazla deneme yapıldı. Biraz bekleyip tekrar deneyebilirsin.";
  if (error.code === "user_already_exists" || error.code === "email_exists") return "Bu e-postayla daha önce kayıt olduysan giriş yapabilir veya şifreni yenileyebilirsin.";
  if (error.code === "weak_password") return "Daha güçlü bir şifre seç. Harf, rakam ve işaretleri birlikte kullanmayı deneyebilirsin.";
  if (error.code === "email_address_not_authorized") return "Üyelik e-postası şu anda gönderilemiyor. Lütfen daha sonra tekrar dene.";
  if (error.code === "same_password") return "Yeni şifren önceki şifrenden farklı olmalı.";
  if (error.code === "signup_disabled") return "Yeni üyelikler şu anda açılamıyor. Lütfen daha sonra tekrar dene.";
  if (error.code?.includes("expired")) return "Bağlantının süresi dolmuş olabilir. Yeni bir bağlantı isteyebilirsin.";
  return "İşlem tamamlanamadı. Bilgilerini ve internet bağlantını kontrol edip tekrar deneyebilirsin.";
}
