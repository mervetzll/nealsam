"use client";
import {useEffect,useState} from "react";
import {useSearchParams} from "next/navigation";
import Link from "next/link";
import {supabase} from "@/lib/supabase";
type State = "checking" | "login" | "active" | "pending" | "failed" | "unverified" | "error";
export default function PaymentResult() {
  const params = useSearchParams();
  const id = params.get("attempt") || "";
  const [state,setState] = useState<State>("checking");
  const [retry,setRetry] = useState(0);
  useEffect(()=>{
    let active = true;
    async function check() {
      try {
        if (!id) {if(active) setState("unverified");return;}
        const {data:{session}} = await supabase.auth.getSession();
        if (!session) {if(active) setState("login");return;}
        const response = await fetch(`/api/payment-status?attempt=${encodeURIComponent(id)}`,{method:retry>0?"POST":"GET",headers:{Authorization:`Bearer ${session.access_token}`},cache:"no-store"});
        const data = await response.json();
        if (!response.ok) throw new Error("Status unavailable");
        if (active) setState(["active","pending","failed","unverified"].includes(data.state)?data.state:"error");
      } catch {if(active) setState("error");}
    }
    void check();
    return ()=>{active=false;};
  },[id,retry]);
  const content: Record<State,[string,string]> = {
    checking:["Ödemen kontrol ediliyor","Paket ve ödeme kaydı doğrulanıyor."],
    login:["Ödeme durumunu görmek için giriş yap","Ödemeyi yaptığın hesapla giriş yaptıktan sonra bu sayfaya döneceksin."],
    active:["Paketin aktif 🎁","Ödemen doğrulandı ve paket erişimin hesabına tanımlandı. Hediye bulmaya devam edebilirsin."],
    pending:["Ödemenin onayı bekleniyor","Henüz ödeme ve paket aktivasyonu birlikte doğrulanamadı. Tekrar ödeme yapma; biraz sonra durumu yeniden kontrol et."],
    failed:["Ödeme tamamlanmadı","Bu işlemle yeni paket erişimi açılmadı. İstersen paketler sayfasına dönebilirsin."],
    unverified:["Doğrulanmış ödeme bulunamadı","Bu sayfayı açmak paketini aktifleştirmez. Siparişine ait doğrulanmış bir ödeme kaydı gerekiyor."],
    error:["Ödeme durumu alınamadı","Bağlantıyı kontrol edip yeniden dene. Sonucu doğrulamadan tekrar ödeme yapma."],
  };
  return <main className="min-h-screen bg-[#fff4ef] px-5 py-12"><section className="mx-auto max-w-2xl rounded-2xl border border-pink-100 bg-white p-8 text-center">
    <p className="text-sm font-bold text-pink-600">NeAlsam · Ödeme sonucu</p>
    <h1 className="mt-4 text-3xl font-black" aria-live="polite">{content[state][0]}</h1>
    <p className="mt-4 text-sm leading-7">{content[state][1]}</p>
    <div className="mt-6 flex flex-wrap justify-center gap-3">
      {state==="login" && <Link className="rounded-full bg-pink-600 px-5 py-3 font-bold text-white" href={`/giris?next=${encodeURIComponent(`/odeme/basarili?attempt=${id}`)}`}>Giriş yap</Link>}
      {state==="active" && <Link className="rounded-full bg-pink-600 px-5 py-3 font-bold text-white" href="/hediye-bul">Hediye bulmaya devam et</Link>}
      {(state==="pending" || state==="error") && <button onClick={()=>{setState("checking");setRetry(value=>value+1);}} className="rounded-full bg-pink-600 px-5 py-3 font-bold text-white">Durumu yeniden kontrol et</button>}
      <Link className="rounded-full border border-pink-200 px-5 py-3 font-bold text-pink-700" href="/hesabim">Hesabıma git</Link>
    </div>
  </section></main>;
}
