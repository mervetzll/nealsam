"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { authErrorMessage, safeReturnPath } from "@/lib/authPresentation";

type Mode = "login" | "register" | "reset" | "update";

export default function AuthClient() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeReturnPath(params.get("next"));
  const [mode, setMode] = useState<Mode>(params.get("mode") === "register" ? "register" : params.get("mode") === "update" ? "update" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") setMode("update");
      if (params.get("mode") === "confirmed" && session && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        router.replace(next); router.refresh();
      }
    });
    return () => subscription.unsubscribe();
  }, [params, next, router]);
  useEffect(() => {
    if (!cooldown) return;
    const timer = window.setTimeout(() => setCooldown(false), 60000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  function changeMode(value: Mode) {
    setMode(value); setMessage(""); setError(false); setPassword(""); setConfirmation(""); setCanResend(false);
  }
  function showError(value: string) { setError(true); setMessage(value); }
  function goToNext() { router.replace(next); router.refresh(); }
  function redirect(mode?: string) {
    const url = new URL("/giris", window.location.origin);
    url.searchParams.set("next", next);
    if (mode) url.searchParams.set("mode", mode);
    return url.toString();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setMessage(""); setError(false);
    if ((mode === "register" || mode === "update") && password.length < 8) { showError("Şifren en az 8 karakter olmalı."); return; }
    if ((mode === "register" || mode === "update") && password !== confirmation) { showError("Şifreler eşleşmiyor. İki alana da aynı şifreyi yaz."); return; }
    setBusy(true);
    try {
      const address = email.trim();
      if (mode === "reset") {
        if (cooldown) return;
        const { error } = await supabase.auth.resetPasswordForEmail(address, { redirectTo: redirect("update") });
        if (error) { showError(authErrorMessage(error)); return; }
        setCooldown(true);
        setMessage("Bu e-postaya bağlı bir hesap varsa şifre yenileme bağlantısı gönderildi. Gelen kutunu ve spam klasörünü kontrol et.");
      } else if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({ email: address, password, options: { emailRedirectTo: redirect("confirmed") } });
        if (error) { showError(authErrorMessage(error)); return; }
        if (data.session) { goToNext(); return; }
        setPassword(""); setConfirmation(""); setCanResend(true); setCooldown(true);
        setMessage("E-postanı kontrol et. Doğrulama iletisi geldiyse bağlantıya dokunarak üyeliğini tamamla. Daha önce üye olduysan giriş yapabilirsin. Spam klasörüne de bakmayı unutma.");
      } else if (mode === "update") {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { showError("Önce e-postandaki şifre yenileme bağlantısını aç. Bağlantı eskidiyse yeniden isteyebilirsin."); return; }
        const { error } = await supabase.auth.updateUser({ password });
        if (error) { showError(authErrorMessage(error)); return; }
        setPassword(""); setConfirmation(""); setMessage("Şifren güncellendi. Hesabına devam edebilirsin.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: address, password });
        if (error) { showError(authErrorMessage(error)); setCanResend(error.code === "email_not_confirmed"); return; }
        goToNext();
      }
    } catch { showError("Bağlantı kurulamadı. İnternetini kontrol edip tekrar dene."); }
    finally { setBusy(false); }
  }

  async function resend() {
    if (busy || cooldown) return;
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { showError("Önce geçerli e-posta adresini yaz."); return; }
    setBusy(true); setError(false);
    try {
      const { error } = await supabase.auth.resend({ type: "signup", email: email.trim(), options: { emailRedirectTo: redirect("confirmed") } });
      if (error) { showError(authErrorMessage(error)); return; }
      setCooldown(true); setMessage("Doğrulama iletisi gönderilebiliyorsa e-postana ulaşacaktır. Gelen kutunu ve spam klasörünü kontrol et.");
    } catch { showError("İleti gönderilemedi. Daha sonra tekrar deneyebilirsin."); }
    finally { setBusy(false); }
  }

  const title = { login: "Tekrar hoş geldin", register: "Hediye hikâyene buradan başla", reset: "Şifreni yenileyelim", update: "Yeni şifreni belirle" }[mode];
  const inputClass = "mt-2 w-full rounded-xl border border-pink-200 bg-white px-4 py-3 text-base outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100";
  return <main className="min-h-screen bg-[#fff4ef] px-4 py-7 text-[#2b1b1b]">
    <div className="mx-auto grid max-w-4xl items-start gap-6 md:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm md:p-7">
        <div className="grid grid-cols-2 gap-1 rounded-full bg-pink-50 p-1" aria-label="Hesap işlemi">
          <button type="button" disabled={busy} onClick={() => changeMode("login")} aria-pressed={mode === "login"} className={`rounded-full px-4 py-3 text-sm font-bold ${mode === "login" ? "bg-[#2b1b1b] text-white" : "text-pink-700"}`}>Giriş yap</button>
          <button type="button" disabled={busy} onClick={() => changeMode("register")} aria-pressed={mode === "register"} className={`rounded-full px-4 py-3 text-sm font-bold ${mode === "register" ? "bg-[#2b1b1b] text-white" : "text-pink-700"}`}>Üye ol</button>
        </div>
        <h1 className="mt-6 text-2xl font-black">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-[#6b4a4a]">{mode === "register" ? "Ücretsiz hesabını oluştur; kendi yazılarını gönder, hediye deneyimlerini hesabında sakla." : mode === "reset" ? "Hesabına ait e-postayı yaz. Şifreni değiştirebileceğin bağlantıyı gönderelim." : mode === "update" ? "Yalnızca bu hesapta kullanacağın güçlü bir şifre seç." : "Yazılarına ve kaydettiğin deneyimlere kaldığın yerden devam et."}</p>
        <form className="mt-5 grid gap-4" onSubmit={submit} aria-busy={busy}>
          <fieldset disabled={busy} className="grid gap-4">
            {mode !== "update" && <label className="text-sm font-bold">E-posta<input type="email" name="email" autoComplete="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} placeholder="ornek@mail.com" className={inputClass}/></label>}
            {mode !== "reset" && <label className="text-sm font-bold">{mode === "update" ? "Yeni şifre" : "Şifre"}<div className="relative"><input type={visible ? "text" : "password"} name="password" aria-label={mode === "update" ? "Yeni şifre" : "Şifre"} autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={mode === "login" ? undefined : 8} value={password} onChange={event => setPassword(event.target.value)} className={`${inputClass} pr-20`}/><button type="button" aria-label={visible ? "Şifreyi gizle" : "Şifreyi göster"} aria-pressed={visible} onClick={() => setVisible(!visible)} className="absolute bottom-0 right-1 px-3 py-3 text-xs font-bold text-pink-700">{visible ? "Gizle" : "Göster"}</button></div>{mode !== "login" && <span className="mt-2 block text-xs font-normal text-[#6b4a4a]">En az 8 karakter. Harf, rakam ve işaretlerle güçlendirebilirsin.</span>}</label>}
            {(mode === "register" || mode === "update") && <label className="text-sm font-bold">Şifre tekrar<input type={visible ? "text" : "password"} name="password-confirmation" autoComplete="new-password" required minLength={8} value={confirmation} onChange={event => setConfirmation(event.target.value)} className={inputClass}/></label>}
          </fieldset>
          {message && <p role={error ? "alert" : "status"} className={`rounded-xl p-4 text-sm leading-6 ${error ? "bg-amber-50 text-amber-900" : "bg-pink-50 text-pink-800"}`}>{message}</p>}
          <button type="submit" disabled={busy || (mode === "reset" && cooldown)} className="rounded-full bg-pink-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{busy ? "İşlem yapılıyor…" : mode === "register" ? "Ücretsiz üye ol" : mode === "reset" ? cooldown ? "Bağlantı gönderildi" : "Yenileme bağlantısı gönder" : mode === "update" ? "Yeni şifreyi kaydet" : "Giriş yap"}</button>
        </form>
        {canResend && <button type="button" disabled={busy || cooldown} onClick={resend} className="mt-4 text-sm font-bold text-pink-700 underline disabled:opacity-50">{cooldown ? "Yeni ileti için bir dakika bekle" : "Doğrulama e-postasını yeniden gönder"}</button>}
        {mode === "login" && <button type="button" disabled={busy} onClick={() => changeMode("reset")} className="mt-4 text-sm font-bold text-pink-700 underline">Şifremi unuttum</button>}
        {(mode === "reset" || mode === "update") && <button type="button" disabled={busy} onClick={() => changeMode("login")} className="mt-4 block text-sm font-bold text-pink-700 underline">Giriş ekranına dön</button>}
        {mode === "update" && message && !error && <Link href={next} className="mt-4 block font-bold text-pink-700 underline">Hesabıma devam et</Link>}
        <p className="mt-5 text-xs leading-6 text-[#6b4a4a]"><Link href="/gizlilik-politikasi" className="underline">Gizlilik politikası</Link> · <Link href="/kullanim-sartlari" className="underline">Kullanım şartları</Link></p>
      </section>
      <aside className="rounded-3xl border border-pink-100 bg-pink-50 p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-pink-600">NeAlsam topluluğu</p>
        <h2 className="mt-3 text-xl font-bold">Bir hediye bazen bir hikâyeyi başlatır.</h2>
        <p className="mt-3 text-sm leading-7 text-[#6b4a4a]">Unutamadığın bir hediye, işe yarayan bir fikir ya da küçük bir sürpriz… Yazını gönder; incelemeden sonra toplulukla paylaşalım.</p>
        <ul className="mt-4 grid gap-3 text-sm text-[#6b4a4a]"><li>✍️ Yazılarını ve taslaklarını yönet.</li><li>💌 Hazırladığın özel deneyimleri hesabına kaydet.</li><li>🎁 Profilindeki hediye tercihlerini düzenle.</li></ul>
        <Link href="/blog" className="mt-5 inline-block text-sm font-bold text-pink-700 underline">Önce yazılara göz at →</Link>
        <Link href="/hediye-bul" className="mt-4 block text-sm font-bold text-pink-700 underline">Üye olmadan hediye bul →</Link>
      </aside>
    </div>
  </main>;
}
