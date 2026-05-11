import { prisma } from "@/lib/db";
import { Download, FileText } from "lucide-react";

export const metadata = { title: "डाउनलोड — Downloads" };

type DownloadItem = { id: number; titleNp: string | null; title: string; file: string; category: string; displayOrder: number; isActive: boolean; createdAt: Date };

export default async function DownloadsPage() {
  let downloads: DownloadItem[] = [];
  try {
    downloads = await prisma.download.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { displayOrder: "asc" }],
    });
  } catch {}

  const grouped = downloads.reduce<Record<string, DownloadItem[]>>((acc, d) => {
    (acc[d.category] ??= []).push(d);
    return acc;
  }, {});

  return (
    <div>
      <section className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-light)] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2"><Download className="w-6 h-6" /><h1 className="text-3xl font-bold">डाउनलोड</h1></div>
          <p className="text-green-100">फारम, नमुना, र अन्य कागजातहरू</p>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {downloads.length === 0 ? (
            <div className="text-center py-16 text-gray-400"><Download className="w-12 h-12 mx-auto mb-4 opacity-30" /><p>कुनै फाइल छैन।</p></div>
          ) : (
            <div className="space-y-8">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <h2 className="text-lg font-bold text-gray-800 mb-4 capitalize border-b-2 border-[var(--brand-primary)] pb-2 inline-block">{category}</h2>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <a key={item.id} href={`/${item.file}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-[var(--brand-primary)] hover:shadow-sm transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-green-50 group-hover:bg-green-100 flex items-center justify-center text-[var(--brand-primary)] transition-colors">
                            <FileText className="w-5 h-5" />
                          </div>
                          <span className="font-medium text-gray-800 group-hover:text-[var(--brand-primary)] transition-colors">{item.titleNp || item.title}</span>
                        </div>
                        <Download className="w-4 h-4 text-gray-400 group-hover:text-[var(--brand-primary)] transition-colors shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
