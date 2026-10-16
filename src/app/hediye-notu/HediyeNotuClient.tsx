"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { readSharedNote, type SharedNote } from "@/lib/sharedNote";

function subscribe(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

export default function HediyeNotuClient({ legacyNote }: { legacyNote: SharedNote }) {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash, () => "");
  const value = hash ? readSharedNote(new URLSearchParams(hash.slice(1))) : legacyNote;
  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 py-14">
      <section className="mx-auto max-w-2xl rounded-[2rem] border border-pink-100 bg-white p-7 shadow-sm md:p-12">
        <p className="text-sm font-bold text-pink-600">Sana özel bir sürpriz</p>
        <h1 className="mt-4 break-words text-3xl font-black text-[#2b1b1b] md:text-4xl">{value.note ? value.title : "Bir hediye notu hazırla"}</h1>
        {value.note ? <>
          <p className="mt-8 whitespace-pre-wrap break-words text-lg leading-9 text-[#6b4a4a]">{value.note}</p>
          {value.from && <p className="mt-8 break-words text-right font-bold text-pink-700">Sevgilerle, {value.from}</p>}
          <p className="mt-10 border-t border-pink-100 pt-5 text-xs text-[#6b4a4a]">NeAlsam Hediye ile hazırlandı.</p>
        </> : <>
          <p className="mt-5 leading-7 text-[#6b4a4a]">Bu bağlantıda bir not bulunmuyor. Sana gönderilen bağlantıyı eksiksiz aç veya kendi notunu oluştur.</p>
          <Link href="/deneyim" className="mt-6 inline-block rounded-full bg-pink-600 px-6 py-4 font-bold text-white">Not Oluştur</Link>
        </>}
      </section>
    </main>
  );
}
