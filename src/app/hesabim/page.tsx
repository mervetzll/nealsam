"use client";

import Link from "next/link";
import { ArrowRight, Bookmark, ChevronRight, Crown, Heart, History, Loader2, LogOut, PenLine, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { getCurrentUserPlan, isPremiumPlan, type UserPlan } from "@/lib/subscription";

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
  const [currentPlan, setCurrentPlan] = useState<UserPlan>("free");

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
      const plan = await getCurrentUserPlan();
      setCurrentPlan(plan);
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
      <main className="flex min-h-[60vh] items-center justify-center bg-[#fff4ef] px-5 py-16">
        <p className="inline-flex items-center gap-2 text-sm font-bold text-[#6b4a4a]">
          <Loader2 className="h-4 w-4 animate-spin text-pink-600" />
          Hesap yükleniyor
        </p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#fff4ef]">
        <section className="mx-auto max-w-2xl px-5 pb-24 pt-14 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-pink-600 ring-1 ring-pink-100">
            <UserRound className="h-7 w-7" strokeWidth={1.75} />
          </span>
          <h1 className="mt-6 text-5xl text-[#2b1b1b] md:text-6xl">
            Profilini görmek için <em>giriş yap.</em>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-lg leading-8 text-[#6b4a4a]">
            Giriş yaptıktan sonra hediye tercihlerin, favorilerin ve kaydettiğin öneriler burada olur.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            <Link
              href="/giris"
              className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-pink-600/20 transition hover:bg-pink-700"
            >
              Giriş yap veya kayıt ol
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/hesabim/bloglarim"
              className="text-sm font-bold text-[#2b1b1b] underline decoration-pink-300 decoration-2 underline-offset-[6px]"
            >
              Bloglarım
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff4ef]">
      <section className="mx-auto max-w-6xl px-5 pb-24 pt-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <aside className="grid content-start gap-6">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-bold text-pink-700">
                <span className="h-1.5 w-1.5 rounded-full bg-pink-600" />
                Hesabım
              </p>
              <h1 className="mt-5 text-5xl text-[#2b1b1b] md:text-6xl">
                Merhaba{profile.name ? `, ${profile.name}` : ""}<em>.</em>
              </h1>
              <p className="mt-3 break-all text-[#6b4a4a]">{user.email}</p>
            </div>

            <div
              className={`rounded-[1.75rem] p-6 ${
                isPremiumPlan(currentPlan) ? "dark-surface bg-[#2b1b1b] text-white" : "bg-white ring-1 ring-pink-100"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className={`text-xs font-bold uppercase tracking-[0.2em] ${isPremiumPlan(currentPlan) ? "text-pink-300" : "text-pink-600"}`}>
                  Paket durumu
                </p>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-600 px-3 py-1 text-xs font-bold text-white">
                  <Crown className="h-3 w-3" />
                  {currentPlan.toUpperCase()}
                </span>
              </div>
              <p className="mt-4 font-display text-2xl">
                {isPremiumPlan(currentPlan) ? "Premium özellikler açık" : "Ücretsiz hesap"}
              </p>
              <p className={`mt-2 text-sm leading-6 ${isPremiumPlan(currentPlan) ? "text-white/70" : "text-[#6b4a4a]"}`}>
                {isPremiumPlan(currentPlan)
                  ? "QR not, özel mektup ve premium deneyim özelliklerini kullanabilirsin."
                  : "QR not ve özel mektup için Plus, Deneyim veya Premium paketlerinden birini seçebilirsin."}
              </p>
              {!isPremiumPlan(currentPlan) && (
                <Link
                  href="/paketler"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-bold text-white transition hover:bg-black"
                >
                  Paketleri incele
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>

            <nav className="divide-y divide-pink-100 overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-pink-100" aria-label="Hesap menüsü">
              {[
                { href: "/hesabim/kaydettiklerim", label: "Kaydettiklerim", icon: Bookmark },
                { href: "/hesabim/gecmis", label: "Geçmiş önerilerim", icon: History },
                { href: "/hesabim/favoriler", label: "Favorilerim", icon: Heart },
                { href: "/hesabim/bloglarim", label: "Bloglarım", icon: PenLine },
              ].map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className="group flex items-center gap-4 px-6 py-4 transition hover:bg-[#fff8f5]">
                  <Icon className="h-5 w-5 text-pink-600" strokeWidth={1.75} />
                  <span className="flex-1 font-bold text-[#2b1b1b]">{label}</span>
                  <ChevronRight className="h-4 w-4 text-[#c9a9a9] transition group-hover:translate-x-0.5 group-hover:text-pink-600" />
                </Link>
              ))}
            </nav>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 justify-self-start text-sm font-bold text-[#8a6a6a] transition hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Çıkış yap
            </button>
          </aside>

          <section className="self-start rounded-[1.75rem] bg-white p-6 ring-1 ring-pink-100 md:p-10">
            <h2 className="text-3xl text-[#2b1b1b] md:text-4xl">
              Profil <em>bilgilerin</em>
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
              <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-800 ring-1 ring-emerald-100">
                {message}
              </div>
            )}

            <button
              type="button"
              onClick={saveProfile}
              disabled={saving}
              className="mt-8 rounded-full bg-pink-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-600/20 transition hover:bg-pink-700 disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : "Profili kaydet"}
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
      <span className="text-sm font-bold text-[#2b1b1b]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl bg-[#fff8f5] px-4 py-3.5 text-[15px] text-[#2b1b1b] ring-1 ring-pink-100 outline-none transition placeholder:text-[#b39a9a] focus:bg-white focus:ring-2 focus:ring-pink-400"
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
      <span className="text-sm font-bold text-[#2b1b1b]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className="mt-2 w-full rounded-2xl bg-[#fff8f5] px-4 py-3.5 text-[15px] text-[#2b1b1b] ring-1 ring-pink-100 outline-none transition placeholder:text-[#b39a9a] focus:bg-white focus:ring-2 focus:ring-pink-400"
      />
    </label>
  );
}
