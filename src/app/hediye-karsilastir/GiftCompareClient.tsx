"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Choice = { name: string; price: string; personal: string; preparation: string };
const empty: Choice = { name: "", price: "", personal: "", preparation: "" };
const personalLabels: Record<string, string> = { known: "Sevdiğini biliyorum", possible: "Sevebilir", unsure: "Emin değilim" };
const preparationLabels: Record<string, string> = { today: "Bugün hazır", days: "Birkaç gün gerekir", unknown: "Henüz bilmiyorum" };

function price(value: string) {
  const parsed = Number(value.replace(/\s/g, "").replace(/\./g, "").replace(",", "."));
  return value.trim() && Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export default function GiftCompareClient({ initialGift = "" }: { initialGift?: string }) {
  const [choices, setChoices] = useState<Choice[]>([{ ...empty, name: initialGift }, { ...empty }]);
  const [budget, setBudget] = useState("");
  const [priority, setPriority] = useState("personal");
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("nealsam.compare.v2") || "null");
      if (Array.isArray(saved?.choices) && saved.choices.length === 2) {
        const valid = saved.choices.map((item: Choice) => Object.fromEntries(Object.keys(empty).map(key => [key, typeof item?.[key as keyof Choice] === "string" ? item[key as keyof Choice] : ""])) as Choice);
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Restore a draft after hydration.
        setChoices(initialGift ? [valid[0].name === initialGift ? valid[0] : { ...empty, name: initialGift }, valid[1]] : valid);
        setBudget(typeof saved.budget === "string" ? saved.budget : "");
        setPriority(["personal", "budget", "today"].includes(saved.priority) ? saved.priority : "personal");
      }
      const stored = JSON.parse(localStorage.getItem("nealsam.favorites.v1") || "[]");
      if (Array.isArray(stored)) setFavorites(stored.filter(item => typeof item?.title === "string").map(item => item.title));
    } catch { /* Invalid drafts can be safely ignored. */ }
    setReady(true);
  }, [initialGift]);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem("nealsam.compare.v2", JSON.stringify({ choices, budget, priority })); } catch { /* Optional browser storage. */ }
  }, [choices, budget, priority, ready]);

  function update(index: number, field: keyof Choice, value: string) {
    setChoices(current => current.map((item, i) => i === index ? { ...item, [field]: value } : item));
  }

  const complete = choices.every(item => item.name.trim());
  const ceiling = price(budget);
  const eligible = choices.filter(item => !ceiling || (price(item.price) !== null && price(item.price)! <= ceiling));
  let decision = "İki hediye ekle; bütçe, kişisel uygunluk ve hazırlık süresini birlikte değerlendirelim.";
  let winner: Choice | undefined;
  if (complete) {
    if (choices[0].name.trim().toLocaleLowerCase("tr") === choices[1].name.trim().toLocaleLowerCase("tr")) {
      decision = "Aynı hediyeyi iki kez girdin. Farklı bir seçenek ekleyerek karşılaştırabilirsin.";
    } else if (eligible.length === 0) {
      decision = "Girdiğin fiyatlarla bütçeye uygunluğu doğrulanmış bir seçenek yok. Eksik fiyatları tamamla veya bütçeni gözden geçir.";
    } else if (ceiling && eligible.length === 1 && choices.every(item => price(item.price) !== null)) {
      winner = eligible[0];
      decision = `${winner.name}, girdiğin fiyatlara göre bütçenin içinde kalan seçenek. Kişisel uygunluğunu ve güncel mağaza fiyatını da kontrol et.`;
    } else if (priority === "personal" && eligible.filter(item => item.personal === "known").length === 1 && choices.every(item => item.personal)) {
      winner = eligible.find(item => item.personal === "known");
      decision = `${winner!.name} öne çıkıyor; sevdiğini bildiğini belirttin. Bu değerlendirme senin verdiğin bilgilere dayanıyor.`;
    } else if (priority === "today" && eligible.filter(item => item.preparation === "today").length === 1 && choices.every(item => item.preparation && item.preparation !== "unknown")) {
      winner = eligible.find(item => item.preparation === "today");
      decision = `${winner!.name}, bugün hazır olduğunu belirttiğin için zaman açısından öne çıkıyor. Teslimat gerekiyorsa mağazadan doğrula.`;
    } else if (priority === "budget" && choices.every(item => price(item.price) !== null) && price(choices[0].price) !== price(choices[1].price)) {
      winner = [...eligible].sort((a, b) => price(a.price)! - price(b.price)!)[0];
      decision = `${winner.name}, girdiğin fiyatlara göre daha ekonomik. Fiyata paketleme ve teslimat masrafını da ekle.`;
    } else {
      decision = "Şimdilik tek bir seçenek öne çıkmıyor. Eksik bilgileri tamamla veya senin için en önemli ölçütü değiştir; son seçimde alıcının zevkini esas al.";
    }
  }

  const inputClass = "w-full rounded-xl border border-pink-200 bg-[#fff4ef] px-4 py-3 text-base font-normal";
  return <main className="min-h-screen bg-[#fff4ef] px-4 py-8 text-[#2b1b1b]">
    <section className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-black">İki hediyeyi birlikte değerlendirelim</h1>
      <p className="mt-3 text-sm leading-7 text-[#6b4a4a]">Fiyatı, alıcıya uygunluğu ve hazırlık süresini sen gir. Karşılaştırma bu bilgilere dayanır; seçimlerin bu tarayıcıda saklanır.</p>
      <div className="mt-6 grid gap-4 rounded-2xl bg-white p-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold">Toplam bütçem (TL, isteğe bağlı)<input inputMode="decimal" value={budget} onChange={event => setBudget(event.target.value)} placeholder="Örn. 1000" className={inputClass}/></label>
        <label className="grid gap-2 text-sm font-bold">Benim için en önemlisi<select value={priority} onChange={event => setPriority(event.target.value)} className={inputClass}><option value="personal">Sevdiğini bildiğim bir hediye</option><option value="budget">Daha ekonomik olması</option><option value="today">Bugün hazır olması</option></select></label>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        {choices.map((item, index) => <article key={index} className="grid content-start gap-4 rounded-2xl border border-pink-100 bg-white p-5">
          <h2 className="text-lg font-bold">Seçenek {index + 1}</h2>
          <label className="grid gap-2 text-sm font-bold">Hediye adı<input value={item.name} onChange={event => update(index, "name", event.target.value)} maxLength={150} className={inputClass}/></label>
          {favorites.length > 0 && <label className="grid gap-2 text-sm font-bold">Kaydettiklerimden seç<select value="" onChange={event => setChoices(current => current.map((choice, i) => i === index ? { ...empty, name: event.target.value } : choice))} className={inputClass}><option value="">Hediye seç…</option>{favorites.map(name => <option key={name}>{name}</option>)}</select></label>}
          <label className="grid gap-2 text-sm font-bold">Kontrol ettiğim fiyat (TL)<input inputMode="decimal" value={item.price} onChange={event => update(index, "price", event.target.value)} placeholder="Bilmiyorsan boş bırak" className={inputClass}/></label>
          <label className="grid gap-2 text-sm font-bold">Alıcının zevkine uygunluğu<select value={item.personal} onChange={event => update(index, "personal", event.target.value)} className={inputClass}><option value="">Seç…</option>{Object.entries(personalLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label className="grid gap-2 text-sm font-bold">Hazırlık / teslim alma<select value={item.preparation} onChange={event => update(index, "preparation", event.target.value)} className={inputClass}><option value="">Seç…</option>{Object.entries(preparationLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          {ceiling && price(item.price) !== null ? <p className="text-sm font-bold text-pink-700">{price(item.price)! <= ceiling ? "Girdiğin fiyata göre bütçene uyuyor." : "Girdiğin fiyat bütçeni aşıyor."}</p> : null}
        </article>)}
      </div>
      <div className="mt-5 rounded-2xl border border-pink-100 bg-white p-5">
        <h2 className="text-xl font-bold">Kararına yardımcı olacak değerlendirme</h2>
        <p className="mt-4 leading-7" role="status">{decision}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button disabled={!complete} onClick={async () => { try { await navigator.clipboard.writeText(decision); setMessage("Değerlendirme kopyalandı."); } catch { setMessage("Kopyalanamadı. Metni seçip kopyalayabilirsin."); } }} className="rounded-full bg-pink-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-50">Değerlendirmeyi kopyala</button>
          {winner && <Link href={`/deneyim?gift=${encodeURIComponent(winner.name)}`} className="rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-bold text-white">Bu hediye için not oluştur</Link>}
          <Link href="/hediye-bul" className="rounded-full border border-pink-200 px-5 py-3 text-sm font-bold text-pink-700">Yeni fikir bul</Link>
        </div>
        <p role="status" className="mt-3 text-sm text-pink-700">{message}</p>
      </div>
    </section>
  </main>;
}
