"use client";
import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {supabase} from "@/lib/supabase";
import {isPaymentPlan, PAYMENT_PLANS, parseBuyer, type BuyerDetails} from "@/lib/paymentRules";

export default function OdemeClient() {
  const router = useRouter();
  const params = useSearchParams();
  const selected = params.get("plan") || "plus";
  const valid = isPaymentPlan(selected);
  const plan = valid ? PAYMENT_PLANS[selected] : null;
  const [config,setConfig] = useState<{mode: string; ready: boolean} | null>(null);
  const [loading,setLoading] = useState(false);
  const [message,setMessage] = useState("");
  const [buyer,setBuyer] = useState<BuyerDetails>({name:"",surname:"",phone:"",identityNumber:"",address:"",city:""});
  useEffect(() => { let active = true; fetch("/api/payment-config", {cache:"no-store"}).then(response=>response.json()).then(data=>{if(active) setConfig(data);}).catch(()=>{if(active) setMessage("Ödeme bilgisi alınamadı. Sayfayı yenileyebilirsin.");}); return ()=>{active=false;}; },[]);
  async function startPayment() {
    if (loading || !valid || !config?.ready) return;
    setLoading(true); setMessage("");
    try {
      const {data:{session}} = await supabase.auth.getSession();
      if (!session) {router.push(`/giris?mode=register&next=${encodeURIComponent(`/odeme?plan=${selected}`)}`);return;}
      if (!parseBuyer(buyer)) {setMessage("Ad, soyad, telefon, T.C. kimlik numarası ve fatura adresini eksiksiz doldur.");return;}
      const response = await fetch("/api/create-checkout",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${session.access_token}`},body:JSON.stringify({plan:selected,buyer})});
      const data = await response.json();
      if (!response.ok || !data.ok) {setMessage(data.error || "Ödeme başlatılamadı.");return;}
      const url = new URL(data.paymentPageUrl);
      if (url.protocol !== "https:" || !["cpp.iyzipay.com","sandbox-cpp.iyzipay.com"].includes(url.hostname)) throw new Error("Invalid payment URL");
      setBuyer({name:"",surname:"",phone:"",identityNumber:"",address:"",city:""});
      window.location.assign(url.toString());
    } catch {setMessage("Ödeme bağlantısı kurulamadı. Biraz sonra tekrar dene.");}
    finally {setLoading(false);}
  }
  if (!plan) return <main className="mx-auto max-w-3xl px-5 py-12"><h1 className="text-2xl font-black">Paket seçimini doğrulayamadık</h1><Link href="/paketler" className="mt-5 inline-block underline">Paketlere dön</Link></main>;
  return <main className="min-h-screen bg-[#fff4ef] px-5 py-8 text-[#2b1b1b]">
    <section className="mx-auto max-w-5xl">
      <Link href="/paketler" className="text-sm font-bold text-pink-700">← Paketlere dön</Link>
      <div className="mt-5 grid items-start gap-6 lg:grid-cols-[1fr_0.7fr]">
        <section className="rounded-2xl border border-pink-100 bg-white p-6 md:p-8">
          <p className="text-xs font-black uppercase tracking-wide text-pink-600">NeAlsam Hediye</p>
          <h1 className="mt-3 text-3xl font-black">{plan.name} paketi · {plan.price} TL</h1>
          <p className="mt-3 text-sm leading-6">Paket, doğrulanmış ödeme sonrasında giriş yaptığın hesaba tanımlanır. Bu işlem otomatik yenilenen abonelik oluşturmaz.</p>
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6" role="status">
            {!config ? "Ödeme durumu kontrol ediliyor…" : !config.ready ? "Ödeme henüz kullanıma açılmadı. Şu anda bu sayfadan ücret tahsil edilmez." : config.mode === "sandbox" ? "Test ortamı: gerçek ücret tahsil edilmez. Yalnızca izin verilen test hesapları ve iyzico test kartları kullanılabilir. Gerçek kart bilgisi girme." : "Ödeme iyzico’nun güvenli sayfasında tamamlanır."}
          </div>
          {config?.ready && <div className="mt-6">
            <h2 className="text-xl font-black">Fatura bilgilerin</h2>
            <p className="mt-2 text-xs leading-5 text-[#6b4a4a]">Bu bilgiler ödeme işlemi için iyzico’ya iletilir. T.C. kimlik numaranı ve adresini NeAlsam veritabanına kaydetmeyiz. Kart bilgileri yalnızca iyzico sayfasında girilir.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">{([
              ["name","Ad","given-name"],["surname","Soyad","family-name"],["phone","Telefon","tel"],["identityNumber","T.C. kimlik numarası","off"],["city","Şehir","address-level2"],["address","Fatura adresi","street-address"],
            ] as const).map(([key,label,auto])=><label key={key} className="text-sm font-bold">{label}<input value={buyer[key]} disabled={loading} maxLength={key==="identityNumber"?11:key==="address"?500:100} inputMode={key==="identityNumber"?"numeric":key==="phone"?"tel":"text"} autoComplete={auto} onChange={event=>setBuyer(current=>({...current,[key]:event.target.value}))} className="mt-2 block w-full rounded-xl border border-pink-200 p-3 font-normal" /></label>)}</div>
          </div>}
          <p role="alert" className="mt-4 text-sm leading-6 text-red-700">{message}</p>
          <button onClick={()=>void startPayment()} disabled={loading || !config?.ready} className="mt-5 w-full rounded-full bg-pink-600 px-6 py-4 font-bold text-white disabled:opacity-50">{loading?"Bağlantı hazırlanıyor…":config?.mode==="sandbox" && config.ready?"iyzico test ödemesine geç":config?.ready?`${plan.price} TL için iyzico’ya geç`:"Ödeme hazırlığı sürüyor"}</button>
          <Link href={`/giris?next=${encodeURIComponent(`/odeme?plan=${selected}`)}`} className="mt-4 block text-center text-sm text-pink-700 underline">Paketin bağlanacağı hesapla giriş yap</Link>
        </section>
        <aside className="rounded-2xl border border-pink-100 bg-white p-6">
          <h2 className="text-xl font-black">Sipariş özeti</h2>
          <p className="mt-4 flex justify-between text-sm"><span>{plan.name} paketi</span><strong>{plan.price} TL</strong></p>
          <p className="mt-3 flex justify-between text-sm"><span>Ek hizmet bedeli</span><span>0 TL</span></p>
          <p className="mt-5 flex justify-between border-t border-pink-100 pt-5 font-black"><span>Toplam</span><span>{plan.price} TL</span></p>
          {(selected==="plus" || selected==="premium") && <ul className="mt-5 list-inside list-disc space-y-2 text-sm leading-6"><li>Hediye arama sınırını kaldırma</li><li>Kişisel not ve sunum planı</li><li>Bütçe dağılımı ve alternatifler</li><li>İndirilebilir hazırlık listesi</li></ul>}
          <p className="mt-5 text-xs leading-5 text-[#6b4a4a]">İşlem sonrası sonuç sayfası ödeme kaydını kontrol eder. Sayfayı açmak tek başına paket erişimi vermez.</p>
        </aside>
      </div>
    </section>
  </main>;
}
