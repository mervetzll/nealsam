"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setMessage("");

    if (!email || !password) {
      setMessage("E-posta ve şifre girmen gerekiyor.");
      return;
    }

    if (password.length < 6) {
      setMessage("Şifre en az 6 karakter olmalı.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setMessage(error.message);
          return;
        }

        setMessage(
          "Kayıt oluşturuldu. Supabase e-posta doğrulaması açıksa mailini kontrol et. Doğrulama kapalıysa Hesabım sayfasına geçebilirsin."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setMessage(error.message);
          return;
        }

        router.push("/hesabim");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fff4ef]">
      <section className="mx-auto grid max-w-6xl gap-6 px-5 pb-24 pt-8 lg:grid-cols-2 lg:pt-12">
        <aside className="dark-surface relative isolate flex flex-col overflow-hidden rounded-[2rem] bg-[#2b1b1b] p-8 text-white md:p-10">
          <div
            aria-hidden="true"
            className="glow-spin pointer-events-none absolute -bottom-1/2 -right-1/3 -z-10 h-[28rem] w-[28rem] rounded-full opacity-40 blur-3xl"
            style={{ background: "conic-gradient(from 0deg, #db2777, transparent 40%, #f472b6, transparent 80%, #db2777)" }}
          />
          <p className="inline-flex items-center gap-2 text-sm font-bold text-pink-300">
            <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />
            NeAlsam hesabı
          </p>

          <h1 className="mt-6 text-5xl md:text-6xl">
            Tercihlerini kaydet, <em>hediyeni hatırla.</em>
          </h1>

          <p className="mt-5 max-w-md leading-7 text-white/70">
            Hesabınla bütçeni ve hediye tarzını saklar, beğendiğin önerilere istediğin zaman geri dönersin.
          </p>

          <ul className="mt-auto space-y-3 pt-10 text-sm text-white/85">
            {[
              "Profil ve bütçe tercihlerin kayıtlı kalır",
              "Favori ve kaydettiğin öneriler tek yerde",
              "Premium deneyimler hesabına bağlanır",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                  <Check className="h-3.5 w-3.5 text-pink-300" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </aside>

        <section className="rounded-[2rem] bg-white p-8 ring-1 ring-pink-100 md:p-10">
          <h2 className="mb-6 text-3xl text-[#2b1b1b]">{mode === "login" ? "Tekrar hoş geldin" : "Hesap oluştur"}</h2>
          <div className="flex rounded-full bg-pink-50 p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-full px-4 py-3 text-sm font-black transition ${
                mode === "login"
                  ? "bg-[#2b1b1b] text-white"
                  : "text-[#6b4a4a]"
              }`}
            >
              Giriş Yap
            </button>

            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 rounded-full px-4 py-3 text-sm font-black transition ${
                mode === "register"
                  ? "bg-[#2b1b1b] text-white"
                  : "text-[#6b4a4a]"
              }`}
            >
              Kayıt Ol
            </button>
          </div>

          <div className="mt-7 space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-[#2b1b1b]">E-posta</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="ornek@mail.com"
                className="mt-2 w-full rounded-2xl bg-[#fff8f5] px-4 py-3.5 text-[15px] text-[#2b1b1b] ring-1 ring-pink-100 outline-none transition placeholder:text-[#b39a9a] focus:bg-white focus:ring-2 focus:ring-pink-400"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-[#2b1b1b]">Şifre</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="En az 6 karakter"
                className="mt-2 w-full rounded-2xl bg-[#fff8f5] px-4 py-3.5 text-[15px] text-[#2b1b1b] ring-1 ring-pink-100 outline-none transition placeholder:text-[#b39a9a] focus:bg-white focus:ring-2 focus:ring-pink-400"
              />
            </label>

            {message && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-800">
                {message}
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-full bg-pink-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-pink-600/20 transition hover:bg-pink-700 disabled:opacity-50"
            >
              {loading
                ? "İşleniyor..."
                : mode === "login"
                ? "Giriş Yap"
                : "Kayıt Ol"}
            </button>

            <Link
              href="/hediye-bul"
              className="inline-flex w-full justify-center py-2 text-sm font-bold text-[#6b4a4a] underline decoration-pink-300 decoration-2 underline-offset-[6px] transition hover:text-[#2b1b1b]"
            >
              Üye olmadan devam et
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
