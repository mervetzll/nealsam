export type GiftCardTheme =
  | "romantic"
  | "minimal"
  | "dark"
  | "fun"
  | "elegant";

type GiftCardOptions = {
  title: string;
  note: string;
  qrDataUrl?: string;
  theme?: GiftCardTheme;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getThemeCss(theme: GiftCardTheme) {
  if (theme === "dark") {
    return `
      body { background: #2b1b1b; }
      .card { background: #2b1b1b; color: white; border-color: #ffd6e8; }
      .brand, .title { color: #ffd6e8; }
      .note { color: #fff3f8; }
      .badge { background: rgba(255,255,255,0.12); color: #ffd6e8; }
      .decor { background: rgba(255,214,232,0.15); }
    `;
  }

  if (theme === "minimal") {
    return `
      body { background: #f8f8f8; }
      .card { background: white; color: #2b1b1b; border-color: #e8e8e8; }
      .brand, .title { color: #2b1b1b; }
      .note { color: #444; }
      .badge { background: #f4f4f4; color: #333; }
      .decor { background: #f2f2f2; }
    `;
  }

  if (theme === "fun") {
    return `
      body { background: #fff1c7; }
      .card { background: #fffdf2; color: #2b1b1b; border-color: #ffd166; }
      .brand, .title { color: #ef476f; }
      .note { color: #6b4b4b; }
      .badge { background: #ffe3ec; color: #ef476f; }
      .decor { background: #ffd166; opacity: 0.35; }
    `;
  }

  if (theme === "elegant") {
    return `
      body { background: #f7f1ea; }
      .card { background: #fffaf4; color: #2b1b1b; border-color: #d8b98c; }
      .brand, .title { color: #8a5a2b; }
      .note { color: #5c4632; }
      .badge { background: #f4e5d0; color: #8a5a2b; }
      .decor { background: #d8b98c; opacity: 0.22; }
    `;
  }

  return `
    body { background: #fff7f3; }
    .card { background: white; color: #2b1b1b; border-color: #f0d7df; }
    .brand, .title { color: #b83280; }
    .note { color: #6b4b4b; }
    .badge { background: #fff0f7; color: #b83280; }
    .decor { background: #f6d7e8; }
  `;
}

export function openGiftCardPrint({
  title,
  note,
  qrDataUrl,
  theme = "romantic",
}: GiftCardOptions) {
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    alert("Kart penceresi açılamadı.");
    return;
  }

  const safeTitle = escapeHtml(title);
  const safeNote = escapeHtml(note);
  const themeCss = getThemeCss(theme);

  printWindow.document.write(`
    <html>
      <head>
        <title>NeAlsam Hediye Kartı</title>
        <style>
          * { box-sizing: border-box; }

          body {
            margin: 0;
            padding: 40px;
            font-family: Arial, sans-serif;
          }

          .page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .card {
            width: 640px;
            min-height: 440px;
            border: 2px solid;
            border-radius: 36px;
            padding: 42px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.10);
            position: relative;
            overflow: hidden;
          }

          .decor {
            position: absolute;
            width: 210px;
            height: 210px;
            border-radius: 999px;
            right: -70px;
            top: -70px;
            z-index: 0;
          }

          .content {
            position: relative;
            z-index: 1;
          }

          .badge {
            display: inline-block;
            border-radius: 999px;
            padding: 10px 16px;
            font-weight: 800;
            font-size: 13px;
            margin-bottom: 24px;
          }

          .brand {
            font-size: 18px;
            font-weight: 900;
            letter-spacing: 0.06em;
            text-transform: uppercase;
          }

          .title {
            font-size: 34px;
            line-height: 1.15;
            font-weight: 900;
            margin: 16px 0 20px;
          }

          .note {
            font-size: 18px;
            line-height: 1.8;
            white-space: pre-wrap;
          }

          .footer {
            margin-top: 32px;
            display: flex;
            align-items: end;
            justify-content: space-between;
            gap: 24px;
          }

          .small {
            font-size: 12px;
            opacity: 0.7;
            line-height: 1.5;
          }

          .qr {
            width: 120px;
            height: 120px;
            border-radius: 18px;
            border: 1px solid #f0d7df;
            padding: 8px;
            background: white;
          }

          .actions {
            margin: 24px auto 0;
            max-width: 640px;
            display: flex;
            gap: 12px;
            justify-content: center;
          }

          button {
            border: 0;
            border-radius: 999px;
            padding: 12px 20px;
            font-weight: 800;
            cursor: pointer;
            background: #b83280;
            color: white;
          }

          .secondary {
            background: white;
            color: #b83280;
            border: 1px solid #f0d7df;
          }

          ${themeCss}

          @media print {
            body { padding: 0; background: white; }
            .actions { display: none; }
            .page { min-height: auto; padding: 0; }
            .card {
              box-shadow: none;
              width: 100%;
              min-height: 100vh;
              border-radius: 0;
              border: 0;
            }
          }
        </style>
      </head>

      <body>
        <div class="page">
          <div>
            <div class="card">
              <div class="decor"></div>

              <div class="content">
                <div class="brand">NeAlsam</div>
                <div class="badge">Hediyeyi sen al, hikâyesini biz yazalım.</div>
                <div class="title">${safeTitle}</div>
                <div class="note">“${safeNote}”</div>

                <div class="footer">
                  <div class="small">
                    Bu kart NeAlsam tarafından kişisel hediye notu olarak oluşturuldu.
                    <br />
                    Yazdırabilir veya PDF olarak kaydedebilirsin.
                  </div>

                  ${
                    qrDataUrl
                      ? `<img class="qr" src="${qrDataUrl}" alt="QR kod" />`
                      : ""
                  }
                </div>
              </div>
            </div>

            <div class="actions">
              <button onclick="window.print()">PDF olarak kaydet / Yazdır</button>
              <button class="secondary" onclick="window.close()">Kapat</button>
            </div>
          </div>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
}
