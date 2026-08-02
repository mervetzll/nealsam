"use client";

import Link from "next/link";
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
    <main className="min-h-screen bg-[#fff7fb]">
      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-14 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="rounded-[2rem] border border-pink-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold text-pink-600">NeAlsam Hesabı</p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#2b1b1b]">
            Profilini oluştur, tercihlerini kaydet
          </h1>

          <p className="mt-4 text-sm leading-6 text-[#6b4a4a]">
            Kayıt olduktan sonra hediye profilini Supabase üzerinde saklayabilir,
            bütçeni ve hediye tercihlerini düzenleyebilirsin.
          </p>

          <div className="mt-6 rounded-2xl bg-pink-50 p-5">
            <h2 className="font-black text-[#2b1b1b]">Hesapla ne olacak?</h2>
            <ul className="mt-3 space-y-2 text-sm font-semibold text-[#6b4a4a]">
              <li>• Profil bilgilerini kaydedebileceksin.</li>
              <li>• Varsayılan bütçe ve ilgi alanları tutabilecek.</li>
              <li>• Sonraki adımda öneri geçmişi eklenebilecek.</li>
              <li>• Premium deneyimler kullanıcıya bağlanabilecek.</li>
            </ul>
          </div>
        </aside>

        <section className="rounded-[2rem] border border-pink-100 bg-white p-8 shadow-sm">
          <div className="flex rounded-full bg-[#fff0f7] p-1">
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
              <span className="text-sm font-black text-[#2b1b1b]">E-posta</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="ornek@mail.com"
                className="mt-2 w-full rounded-2xl border border-pink-100 bg-[#fff7fb] px-4 py-3 text-sm font-semibold text-[#2b1b1b] outline-none focus:border-pink-400 focus:bg-white"
              />
            </label>

            <label className="block">
              <span className="text-sm font-black text-[#2b1b1b]">Şifre</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="En az 6 karakter"
                className="mt-2 w-full rounded-2xl border border-pink-100 bg-[#fff7fb] px-4 py-3 text-sm font-semibold text-[#2b1b1b] outline-none focus:border-pink-400 focus:bg-white"
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
              className="w-full rounded-full bg-pink-600 px-6 py-4 text-sm font-black text-white transition hover:bg-pink-700 disabled:opacity-50"
            >
              {loading
                ? "İşleniyor..."
                : mode === "login"
                ? "Giriş Yap"
                : "Kayıt Ol"}
            </button>

            <Link
              href="/hediye-bul"
              className="inline-flex w-full justify-center rounded-full border border-pink-200 bg-white px-6 py-4 text-sm font-black text-pink-700 transition hover:bg-pink-50"
            >
              Üye olmadan Hediye Bul
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
