"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";

function isValidEmail(email: string) {
  const cleanEmail = email.trim().toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!emailRegex.test(cleanEmail)) return false;
  if (cleanEmail.includes("..")) return false;
  if (cleanEmail.startsWith(".") || cleanEmail.endsWith(".")) return false;

  return true;
}

function createVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default function LoginPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [verificationCode, setVerificationCode] = useState("");
  const [userCode, setUserCode] = useState("");

  function sendDemoCode() {
    const cleanEmail = email.trim().toLowerCase();

    if (!isValidEmail(cleanEmail)) {
      alert("Lütfen geçerli bir e-posta adresi yaz. Örn: isim@mail.com");
      return;
    }

    const code = createVerificationCode();

    setEmail(cleanEmail);
    setVerificationCode(code);
    setStep("code");

    alert(
      `Demo doğrulama kodun: ${code}\n\nGerçek sürümde bu kod e-posta adresine gönderilecek.`
    );
  }

  function verifyCodeAndLogin() {
    if (userCode.trim() !== verificationCode) {
      alert("Doğrulama kodu hatalı. Lütfen tekrar kontrol et.");
      return;
    }

    const user = {
      name: name.trim() || "NeAlsam Kullanıcısı",
      email: email.trim().toLowerCase(),
      emailVerified: true,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("nealsam_user", JSON.stringify(user));

    if (!localStorage.getItem("nealsam_plan")) {
      localStorage.setItem("nealsam_plan", "free");
    }

    alert("E-posta doğrulandı. Hesabın oluşturuldu.");
    router.push("/hesabim");
  }

  function changeEmail() {
    setStep("email");
    setVerificationCode("");
    setUserCode("");
  }

  return (
    <main className="min-h-screen bg-[#fff7f3] text-[#2b1b1b]">
      <Navbar />

      <section className="mx-auto grid max-w-5xl gap-8 px-6 pb-16 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="mb-4 inline-flex rounded-full bg-[#fff0f7] px-4 py-2 text-sm font-bold text-[#b83280]">
            Güvenli hesap
          </p>

          <h1 className="text-4xl font-black">
            E-posta ile giriş yap
          </h1>

          <p className="mt-4 text-sm leading-7 text-[#6b4b4b]">
            İsim zorunlu değil; asıl önemli olan e-postanın doğru olması.
            Çünkü paket, ödeme ve abonelik bilgileri e-posta hesabına
            bağlanacak.
          </p>

          {step === "email" ? (
            <div className="mt-6 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-bold text-[#b83280]">
                  Ad Soyad
                  <span className="ml-1 font-normal text-[#8b6f6f]">
                    opsiyonel
                  </span>
                </span>

                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="İstersen adını yazabilirsin"
                  className="rounded-2xl border border-[#f0d7df] bg-[#fffaf7] px-4 py-3 outline-none focus:border-[#b83280]"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-bold text-[#b83280]">
                  E-posta
                </span>

                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="ornek@mail.com"
                  className="rounded-2xl border border-[#f0d7df] bg-[#fffaf7] px-4 py-3 outline-none focus:border-[#b83280]"
                />

                <span className="text-xs leading-5 text-[#8b6f6f]">
                  E-posta formatı kontrol edilir. Sonraki adımda doğrulama
                  kodu istenir.
                </span>
              </label>

              <button
                onClick={sendDemoCode}
                className="rounded-full bg-[#b83280] px-6 py-3 font-bold text-white"
              >
                Doğrulama kodu gönder
              </button>
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl bg-[#fff7f3] p-4">
                <p className="text-sm font-bold text-[#b83280]">
                  Kod gönderilen e-posta
                </p>

                <p className="mt-1 font-semibold">{email}</p>

                <button
                  onClick={changeEmail}
                  className="mt-3 text-sm font-bold text-[#b83280] underline"
                >
                  E-postayı değiştir
                </button>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-bold text-[#b83280]">
                  6 haneli doğrulama kodu
                </span>

                <input
                  value={userCode}
                  onChange={(event) => setUserCode(event.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="rounded-2xl border border-[#f0d7df] bg-[#fffaf7] px-4 py-3 text-center text-2xl font-black tracking-[0.35em] outline-none focus:border-[#b83280]"
                />
              </label>

              <button
                onClick={verifyCodeAndLogin}
                className="rounded-full bg-[#b83280] px-6 py-3 font-bold text-white"
              >
                Kodu doğrula ve giriş yap
              </button>

              <button
                onClick={sendDemoCode}
                className="rounded-full border border-[#e8c4d8] bg-white px-6 py-3 font-bold text-[#b83280]"
              >
                Yeni kod oluştur
              </button>
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-[#2b1b1b] p-8 text-white shadow-sm">
          <p className="text-sm font-bold text-[#ffd6e8]">
            Gerçek sistemde nasıl olacak?
          </p>

          <h2 className="mt-3 text-3xl font-black">
            E-posta doğrulama ödeme güveni için gerekli.
          </h2>

          <div className="mt-6 grid gap-4 text-sm leading-7 text-[#ffeaf3]">
            <p>✓ Kullanıcı paketi kendi doğrulanmış e-postasıyla alır.</p>
            <p>✓ Ödeme sonrası paket aynı hesaba tanımlanır.</p>
            <p>✓ Ay içinde tekrar giriş yapınca paket kaybolmaz.</p>
            <p>✓ Şifre sıfırlama ve fatura bilgisi e-postaya bağlanabilir.</p>
          </div>

          <div className="mt-8 rounded-2xl bg-white/10 p-4 text-sm leading-6">
            Demo sürümde kod ekranda gösterilir. Gerçek yayında bu kod
            kullanıcıya e-posta olarak gönderilir. Bunun için Supabase Auth,
            Firebase Auth, Auth.js, Resend, SendGrid veya benzeri servisler
            kullanılabilir.
          </div>
        </div>
      </section>
    </main>
  );
}
