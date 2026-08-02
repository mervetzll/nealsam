"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type UserProfile = {
  name: string;
  email: string;
  defaultBudget: string;
  favoriteInterests: string;
  giftStyle: string;
};

const emptyProfile: UserProfile = {
  name: "",
  email: "",
  defaultBudget: "",
  favoriteInterests: "",
  giftStyle: "",
};

export default function AccountPage() {
  const [profile, setProfile] = useState<UserProfile>(emptyProfile);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("nealsam_user_profile");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProfile({
          ...emptyProfile,
          ...parsed,
        });
        setSaved(true);
      } catch {
        setSaved(false);
      }
    }

    setLoaded(true);
  }, []);

  function saveProfile() {
    localStorage.setItem("nealsam_user_profile", JSON.stringify(profile));
    setSaved(true);
  }

  function clearProfile() {
    localStorage.removeItem("nealsam_user_profile");
    setProfile(emptyProfile);
    setSaved(false);
  }

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#fff7fb] px-5 py-16 text-center">
        <p className="font-bold text-[#2b1b1b]">Profil yükleniyor...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff7fb]">
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-bold text-pink-600">Hesabım</p>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-[#2b1b1b]">
              Hediye profilini oluştur
            </h1>

            <p className="mt-4 text-sm leading-6 text-[#6b4a4a]">
              Profil bilgilerin bu cihazda saklanır. Böylece ileride Hediye Bul
              sayfasında tercihlerini daha kolay kullanabiliriz.
            </p>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-black text-amber-900">
                Şimdilik lokal profil
              </p>
              <p className="mt-2 text-sm leading-6 text-amber-800">
                Bu profil şu an sadece tarayıcında tutulur. Gerçek üyelik,
                şifre, e-posta doğrulama ve giriş sistemi için sonraki adımda
                Supabase Auth bağlanmalıdır.
              </p>
            </div>

            {saved ? (
              <div className="mt-6 rounded-2xl bg-emerald-50 p-4">
                <p className="text-sm font-black text-emerald-800">
                  Profil oluşturuldu ✓
                </p>
                <p className="mt-2 text-sm text-emerald-700">
                  Bilgilerin bu cihazda kayıtlı.
                </p>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl bg-pink-50 p-4">
                <p className="text-sm font-black text-pink-700">
                  Henüz profil oluşturmadın
                </p>
                <p className="mt-2 text-sm text-pink-700/80">
                  Sağdaki formu doldurup kaydedebilirsin.
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/hediye-bul"
                className="rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-black text-white transition hover:opacity-90"
              >
                Hediye Bul
              </Link>

              <Link
                href="/paketler"
                className="rounded-full border border-pink-200 bg-white px-5 py-3 text-sm font-black text-pink-700 transition hover:bg-pink-50"
              >
                Paketler
              </Link>
            </div>
          </aside>

          <section className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-black text-[#2b1b1b]">
              Profil Bilgileri
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#6b4a4a]">
              Bu bilgiler ileride önerileri kişiselleştirmek için kullanılacak.
            </p>

            <div className="mt-6 grid gap-4">
              <Input
                label="Adın"
                value={profile.name}
                onChange={(value) => setProfile({ ...profile, name: value })}
                placeholder="Örn: Merve"
              />

              <Input
                label="E-posta"
                value={profile.email}
                onChange={(value) => setProfile({ ...profile, email: value })}
                placeholder="ornek@mail.com"
              />

              <Input
                label="Varsayılan hediye bütçen"
                value={profile.defaultBudget}
                onChange={(value) =>
                  setProfile({ ...profile, defaultBudget: value })
                }
                placeholder="Örn: 500-1500 TL"
              />

              <TextArea
                label="En çok baktığın hediye ilgi alanları"
                value={profile.favoriteInterests}
                onChange={(value) =>
                  setProfile({ ...profile, favoriteInterests: value })
                }
                placeholder="Örn: makyaj, cilt bakımı, kahve, teknoloji"
              />

              <TextArea
                label="Sevdiğin hediye tarzı"
                value={profile.giftStyle}
                onChange={(value) =>
                  setProfile({ ...profile, giftStyle: value })
                }
                placeholder="Örn: kullanışlı, minimal, romantik, deneyim hediyesi"
              />
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={saveProfile}
                className="rounded-full bg-pink-600 px-6 py-3 text-sm font-black text-white transition hover:bg-pink-700"
              >
                Profili Kaydet
              </button>

              <button
                type="button"
                onClick={clearProfile}
                className="rounded-full border border-red-200 bg-white px-6 py-3 text-sm font-black text-red-600 transition hover:bg-red-50"
              >
                Profili Temizle
              </button>
            </div>

            <div className="mt-8 rounded-2xl bg-[#fff7fb] p-5">
              <h3 className="font-black text-[#2b1b1b]">Sonraki geliştirme</h3>
              <p className="mt-2 text-sm leading-6 text-[#6b4a4a]">
                Bu lokal profil sistemi hazır. Bir sonraki adımda bunu gerçek
                üyelik sistemine çevirmek için Supabase Auth bağlayabiliriz:
                kullanıcı kayıt olur, giriş yapar ve profili her cihazda
                görünür.
              </p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-[#2b1b1b]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-pink-100 bg-[#fff7fb] px-4 py-3 text-sm font-semibold text-[#2b1b1b] outline-none transition placeholder:text-[#9b7b7b] focus:border-pink-400 focus:bg-white"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-[#2b1b1b]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className="mt-2 w-full rounded-2xl border border-pink-100 bg-[#fff7fb] px-4 py-3 text-sm font-semibold text-[#2b1b1b] outline-none transition placeholder:text-[#9b7b7b] focus:border-pink-400 focus:bg-white"
      />
    </label>
  );
}
