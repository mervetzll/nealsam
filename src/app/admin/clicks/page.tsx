import { existsSync, readFileSync } from "fs";
import path from "path";

type ClickData = {
  clickedAt: string;
  platform: string;
  query: string;
  referrer: string;
  userAgent: string;
};

function getClicks(): ClickData[] {
  const filePath = path.join(process.cwd(), "analytics", "clicks.jsonl");

  if (!existsSync(filePath)) {
    return [];
  }

  const file = readFileSync(filePath, "utf8");

  return file
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line))
    .reverse();
}

function getPlatformCounts(clicks: ClickData[]) {
  return clicks.reduce<Record<string, number>>((acc, click) => {
    acc[click.platform] = (acc[click.platform] || 0) + 1;
    return acc;
  }, {});
}

export default function ClicksPage() {
  const clicks = getClicks();
  const platformCounts = getPlatformCounts(clicks);

  return (
    <main className="min-h-screen bg-[#fff7f3] px-6 py-10 text-[#2b1b1b]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-[2rem] bg-white p-8 shadow-sm">
          <p className="text-sm font-bold text-[#b83280]">NeAlsam Admin</p>

          <h1 className="mt-2 text-4xl font-extrabold">
            Tıklama Takibi
          </h1>

          <p className="mt-3 text-[#6b4b4b]">
            Trendyol, Amazon, Hepsiburada ve Google yönlendirme tıklamalarını
            burada görebilirsin.
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-5">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-[#8b6f6f]">Toplam tıklama</p>
            <p className="mt-2 text-3xl font-extrabold">{clicks.length}</p>
          </div>

          {["trendyol", "amazon", "hepsiburada", "google"].map((platform) => (
            <div key={platform} className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm capitalize text-[#8b6f6f]">{platform}</p>
              <p className="mt-2 text-3xl font-extrabold">
                {platformCounts[platform] || 0}
              </p>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
          <div className="border-b border-[#f0d8e4] p-6">
            <h2 className="text-2xl font-extrabold">Son tıklamalar</h2>
          </div>

          {clicks.length === 0 ? (
            <p className="p-6 text-[#6b4b4b]">
              Henüz tıklama yok. Hediye sonucundaki alışveriş butonlarına
              basınca burada görünecek.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">
                <thead className="bg-[#fff0f7]">
                  <tr>
                    <th className="p-4 text-sm font-bold">Tarih</th>
                    <th className="p-4 text-sm font-bold">Platform</th>
                    <th className="p-4 text-sm font-bold">Arama</th>
                    <th className="p-4 text-sm font-bold">Kaynak</th>
                  </tr>
                </thead>

                <tbody>
                  {clicks.slice(0, 100).map((click, index) => (
                    <tr key={index} className="border-t border-[#f5e3eb]">
                      <td className="p-4 text-sm">
                        {new Date(click.clickedAt).toLocaleString("tr-TR")}
                      </td>

                      <td className="p-4 text-sm font-bold capitalize text-[#b83280]">
                        {click.platform}
                      </td>

                      <td className="p-4 text-sm">{click.query}</td>

                      <td className="max-w-xs truncate p-4 text-sm text-[#6b4b4b]">
                        {click.referrer || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
