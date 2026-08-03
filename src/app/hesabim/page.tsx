"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type UserProfile = {
  name: string;
  default_budget: string;
  favorite_interests: string;
  gift_style: string;
};

const emptyProfile: UserProfile = {
  name: "",
  default_budget: "",
  favorite_interests: "",
  gift_style: "",
};

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadAccount();
  }, []);

  async function loadAccount() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);

    if (user) {
      const { data } = await supabase
        .from("profiles")
        .select("name, default_budget, favorite_interests, gift_style")
        .eq("id", user.id)
        .maybeSingle();

      if (data) {
        setProfile({
          name: data.name || "",
          default_budget: data.default_budget || "",
          favorite_interests: data.favorite_interests || "",
          gift_style: data.gift_style || "",
        });
      }
    }

    setLoading(false);
  }

  async function saveProfile() {
    if (!user) {
      router.push("/giris");
      return;
    }

    setSaving(true);
    setMessage("");

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      ...profile,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Profil kaydedildi ✓");
    }

    setSaving(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/giris");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fff4ef] px-5 py-16 text-center">
        <p className="font-bold text-[#2b1b1b]">Hesap yükleniyor...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#fff4ef]">
        <section className="mx-auto max-w-3xl px-5 py-16 text-center">
          <div className="rounded-[2rem] border border-pink-100 bg-white p-8 shadow-sm">
            <p className="text-sm font-bold text-pink-600">Hesabım</p>
            <h1 className="mt-3 text-4xl font-black text-[#2b1b1b]">
              Profilini görmek için giriş yap
            </h1>
            <p className="mt-4 text-sm leading-6 text-[#6b4a4a]">
              Kayıt olup giriş yaptıktan sonra hediye tercihlerini Supabase
              profilinde saklayabilirsin.
            </p>

            <Link
              href="/giris"
              className="mt-7 inline-flex rounded-full bg-pink-600 px-6 py-4 text-sm font-black text-white transition hover:bg-pink-700"
            >
              Giriş Yap / Kayıt Ol
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff4ef]">
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-bold text-pink-600">Hesabım</p>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-[#2b1b1b]">
              Hediye profilin
            </h1>

            <p className="mt-4 text-sm leading-6 text-[#6b4a4a]">
              Bu bilgiler Supabase hesabına bağlı olarak saklanır.
            </p>

            <div className="mt-6 rounded-2xl bg-pink-50 p-5">
              <p className="text-sm font-black text-[#2b1b1b]">Giriş yapılan hesap</p>
              <p className="mt-2 break-all text-sm font-semibold text-[#6b4a4a]">
                {user.email}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/hediye-bul"
                className="rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-black text-white transition hover:opacity-90"
              >
                Hediye Bul
              </Link>

              <Link
                href="/hesabim/gecmis"
                className="rounded-full border border-pink-200 bg-white px-5 py-3 text-sm font-black text-pink-700 transition hover:bg-pink-50"
              >
                Geçmiş Önerilerim
              </Link>

              <Link
                href="/hesabim/favoriler"
                className="rounded-full border border-pink-200 bg-white px-5 py-3 text-sm font-black text-pink-700 transition hover:bg-pink-50"
              >
                Favorilerim
              </Link>

              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-red-200 bg-white px-5 py-3 text-sm font-black text-red-600 transition hover:bg-red-50"
              >
                Çıkış Yap
              </button>
            </div>
          </aside>

          <section className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-black text-[#2b1b1b]">
              Profil Bilgileri
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#6b4a4a]">
              Bu bilgiler ileride önerileri kişiselleştirmek ve öneri geçmişi
              oluşturmak için kullanılacak.
            </p>

            <div className="mt-6 grid gap-4">
              <Input
                label="Adın"
                value={profile.name}
                onChange={(value) => setProfile({ ...profile, name: value })}
                placeholder="Örn: Merve"
              />

              <Input
                label="Varsayılan hediye bütçen"
                value={profile.default_budget}
                onChange={(value) =>
                  setProfile({ ...profile, default_budget: value })
                }
                placeholder="Örn: 500-1500 TL"
              />

              <TextArea
                label="En çok baktığın hediye ilgi alanları"
                value={profile.favorite_interests}
                onChange={(value) =>
                  setProfile({ ...profile, favorite_interests: value })
                }
                placeholder="Örn: makyaj, cilt bakımı, kahve, teknoloji"
              />

              <TextArea
                label="Sevdiğin hediye tarzı"
                value={profile.gift_style}
                onChange={(value) =>
                  setProfile({ ...profile, gift_style: value })
                }
                placeholder="Örn: kullanışlı, minimal, romantik, deneyim hediyesi"
              />
            </div>

            {message && (
              <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm font-black text-emerald-800">
                {message}
              </div>
            )}

            <button
              type="button"
              onClick={saveProfile}
              disabled={saving}
              className="mt-7 rounded-full bg-pink-600 px-6 py-3 text-sm font-black text-white transition hover:bg-pink-700 disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : "Profili Kaydet"}
            </button>
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
        className="mt-2 w-full rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-semibold text-[#2b1b1b] outline-none transition placeholder:text-[#9b7b7b] focus:border-pink-400 focus:bg-white"
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
        className="mt-2 w-full rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-semibold text-[#2b1b1b] outline-none transition placeholder:text-[#9b7b7b] focus:border-pink-400 focus:bg-white"
      />
    </label>
  );
}
