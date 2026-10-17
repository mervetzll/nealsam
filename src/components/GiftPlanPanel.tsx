"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Answers, Gift } from "@/lib/giftMatching";
import type { GiftPlan } from "@/lib/giftPlan";

export default function GiftPlanPanel({gifts, answers, paid}: {gifts: Gift[]; answers: Answers; paid: boolean}) {
  const [giftId, setGiftId] = useState("");
  const [recipient, setRecipient] = useState("");
  const [memory, setMemory] = useState("");
  const [result, setResult] = useState<{plan: GiftPlan; context: string} | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const selectedId = gifts.some(gift => gift.id === giftId) ? giftId : gifts[0]?.id || "";
  const context = JSON.stringify({answers, selectedId, recipient, memory});
  const plan = result?.context === context && paid ? result.plan : null;
  async function generate() {
    setBusy(true); setMessage("");
    try {
      const {data: {session}} = await supabase.auth.getSession();
      if (!session) { setMessage("Paketinin bağlı olduğu hesapla giriş yap."); return; }
      const response = await fetch("/api/gift-search", {method: "POST", headers: {"Content-Type": "application/json", Authorization: `Bearer ${session.access_token}`}, body: JSON.stringify({action: "plan", answers, giftId: selectedId, recipient, memory})});
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Plan hazırlanamadı.");
      setResult({plan: data.plan, context});
    } catch (error) { setMessage(error instanceof Error ? error.message : "Tekrar deneyebilirsin."); }
    finally { setBusy(false); }
  }
  function download() {
    if (!plan) return;
    const content = `${plan.title}\n\nKİŞİSEL NOT\n${plan.note}\n\nSUNUM\n${plan.presentation}\n\nBÜTÇE\n${plan.budget}\n\nALTERNATİFLER\n${plan.alternatives.join("\n")}\n\nHAZIRLIK LİSTESİ\n${plan.checklist.map(item => `☐ ${item}`).join("\n")}\n\nNeAlsam Hediye · Fiyat ve stok mağazada doğrulanmalıdır.`;
    const url = URL.createObjectURL(new Blob(["\uFEFF", content], {type: "text/plain;charset=utf-8"}));
    const link = document.createElement("a"); link.href = url; link.download = "nealsam-hediye-planim.txt"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <section className="mt-6 rounded-2xl border border-pink-200 bg-white p-5 md:p-7">
    <p className="text-xs font-black uppercase tracking-wide text-pink-600">Plus · Hediyeden hazır bir sürprize</p>
    <h3 className="mt-2 text-2xl font-black">Kişisel hediye planın</h3>
    <p className="mt-3 text-sm leading-6 text-[#6b4a4a]">Bir hediye seç; adını ve ortak bir anınızı ekle. Kişisel not, paketleme fikri, bütçe dağılımı, alternatifler ve indirilebilir hazırlık listesi bir arada. Metinler tercihlerine göre şablonlardan hazırlanır.</p>
    {!paid ? <div className="mt-4 rounded-xl bg-pink-50 p-4"><p className="text-sm">İlk üç arama ücretsiz. Daha fazla arama ve kişisel plan Plus’ta.</p><Link href="/odeme?plan=plus" className="mt-3 inline-block rounded-full bg-pink-600 px-5 py-3 text-sm font-bold text-white">Plus’ı incele · 49 TL</Link></div> : <>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-bold">Planlanacak hediye<select value={selectedId} onChange={event => setGiftId(event.target.value)} disabled={busy} className="mt-2 block w-full rounded-xl border border-pink-200 bg-white p-3">{gifts.map(gift => <option key={gift.id} value={gift.id}>{gift.title || gift.name}</option>)}</select></label>
        <label className="text-sm font-bold">Alıcının adı (isteğe bağlı)<input maxLength={80} value={recipient} disabled={busy} onChange={event => setRecipient(event.target.value)} className="mt-2 block w-full rounded-xl border border-pink-200 p-3" /></label>
        <label className="text-sm font-bold md:col-span-2">Ortak bir anınız (isteğe bağlı)<textarea maxLength={400} value={memory} disabled={busy} onChange={event => setMemory(event.target.value)} placeholder="O yağmurlu gün birlikte içtiğimiz kahveyi unutamıyorum." className="mt-2 block w-full rounded-xl border border-pink-200 p-3" /><span className="mt-1 block text-xs font-normal">Bu alanlar plan hazırlanması için kullanılır; planı indirene kadar sunucuda kaydedilmez.</span></label>
      </div>
      <button onClick={() => void generate()} disabled={busy || !selectedId} className="mt-4 rounded-full bg-pink-600 px-6 py-3 text-sm font-bold text-white disabled:opacity-50">{busy ? "Plan hazırlanıyor…" : "Kişisel planımı hazırla"}</button>
      <p role="status" className="mt-3 text-sm text-pink-700">{message}</p>
      {plan && <div className="mt-5 space-y-4 rounded-xl bg-[#fff4ef] p-5">
        <h4 className="text-xl font-bold">{plan.title}</h4>
        <label className="block text-sm font-bold">Notunu son kez düzenle<textarea value={plan.note} maxLength={1600} onChange={event => setResult({context, plan: {...plan, note: event.target.value}})} className="mt-2 block min-h-32 w-full rounded-xl border border-pink-200 bg-white p-3 font-normal leading-6" /></label>
        <p className="text-sm leading-6"><strong>Sunum fikri: </strong>{plan.presentation}</p>
        <p className="text-sm leading-6"><strong>Bütçe dağılımı: </strong>{plan.budget}</p>
        <div><p className="text-sm font-bold">Alternatif fikirler</p>{plan.alternatives.length ? <ul className="mt-2 list-inside list-disc text-sm leading-6">{plan.alternatives.map(item => <li key={item}>{item}</li>)}</ul> : <p className="mt-2 text-sm">Bu tercihlerde başka alternatif bulunamadı.</p>}</div>
        <fieldset><legend className="text-sm font-bold">Hazırlık listesi</legend>{plan.checklist.map(item => <label key={item} className="mt-2 flex gap-2 text-sm leading-6"><input type="checkbox" className="mt-1" />{item}</label>)}</fieldset>
        <button onClick={download} className="rounded-full border border-pink-300 bg-white px-5 py-3 text-sm font-bold">Planımı indir (.txt)</button>
      </div>}
    </>}
  </section>;
}
