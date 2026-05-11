import { prisma } from "@/lib/db";
import { Image as ImageIcon } from "lucide-react";

export const metadata = { title: "ग्यालरी — Gallery" };

export default async function GalleryPage() {
  const items = await prisma.gallery.findMany({
    where: { isActive: true },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  }).catch(() => []);

  const categories = ["all", ...Array.from(new Set(items.map((i) => i.category)))];

  return (
    <div>
      <section className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-light)] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2"><ImageIcon className="w-6 h-6" /><h1 className="text-3xl font-bold">फोटो ग्यालरी</h1></div>
          <p className="text-green-100">संस्थाका गतिविधि र कार्यक्रमका तस्विरहरू</p>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {items.length === 0 ? (
            <div className="text-center py-16 text-gray-400"><ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-30" /><p>कुनै फोटो छैन।</p></div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <div key={item.id} className="bg-gray-100 rounded-xl overflow-hidden aspect-square group hover:shadow-lg transition-shadow">
                  <img src={`/${item.image}`} alt={item.titleNp || item.title || ""} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
