"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    const response = await fetch("/api/admin-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    setIsLoading(false);

    if (!response.ok) {
      setError("Kullanıcı adı veya şifre yanlış.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#fff7f3] px-6 py-12 text-[#2b1b1b]">
      <section className="mx-auto flex min-h-[75vh] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2.5rem] bg-white shadow-sm lg:grid-cols-2">
          <div className="bg-[#fff0f7] p-10 lg:p-12">
            <p className="text-sm font-bold text-[#b83280]">NeAlsam Admin</p>

            <h1 className="mt-4 text-4xl font-extrabold leading-tight">
              Yönetim paneline giriş yap
            </h1>

            <p className="mt-5 max-w-md leading-7 text-[#6b4b4b]">
              Hediye önerilerini, blog içeriklerini, SEO durumunu ve site
              ayarlarını yönetmek için admin hesabınla giriş yap.
            </p>

            <div className="mt-8 grid gap-3">
              <div className="rounded-3xl bg-white p-5">
                <p className="text-sm font-bold text-[#b83280]">
                  Hediye Yönetimi
                </p>
                <p className="mt-2 text-sm leading-6 text-[#6b4b4b]">
                  Öneri havuzunu ve kategorileri kontrol et.
                </p>
              </div>

              <div className="rounded-3xl bg-white p-5">
                <p className="text-sm font-bold text-[#b83280]">
                  SEO & Blog
                </p>
                <p className="mt-2 text-sm leading-6 text-[#6b4b4b]">
                  Google görünürlüğü için içerikleri takip et.
                </p>
              </div>
            </div>
          </div>

          <div className="p-10 lg:p-12">
            <a href="/" className="text-sm font-bold text-[#b83280]">
              ← Siteye dön
            </a>

            <h2 className="mt-8 text-3xl font-extrabold">Admin Girişi</h2>

            <p className="mt-3 leading-7 text-[#6b4b4b]">
              Devam etmek için kullanıcı adı ve şifre gir.
            </p>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <div>
                <label className="text-sm font-bold text-[#6b4b4b]">
                  Kullanıcı adı
                </label>

                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[#f0d7df] bg-[#fffaf7] px-5 py-4 outline-none focus:border-[#b83280]"
                  placeholder="admin"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-[#6b4b4b]">
                  Şifre
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[#f0d7df] bg-[#fffaf7] px-5 py-4 outline-none focus:border-[#b83280]"
                  placeholder="Admin şifren"
                />
              </div>

              {error && (
                <div className="rounded-2xl bg-[#fff0f7] p-4 text-sm font-bold text-[#b83280]">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-[#b83280] px-6 py-4 font-bold text-white disabled:opacity-60"
              >
                {isLoading ? "Giriş yapılıyor..." : "Admin paneline gir"}
              </button>
            </form>

            <p className="mt-6 text-xs leading-6 text-[#8b6f6f]">
              Bu sayfa yalnızca admin kullanımı içindir. Google tarafından
              indexlenmemesi için admin sayfası kapalı tutulur.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
