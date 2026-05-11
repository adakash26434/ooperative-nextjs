import { prisma } from "@/lib/db";
import Link from "next/link";
import { Newspaper, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "समाचार — News" };

export default async function NewsPage() {
  const news = await prisma.news.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 30,
  }).catch(() => []);

  return (
    <div>
      <section className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-light)] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2"><Newspaper className="w-6 h-6" /><h1 className="text-3xl font-bold">समाचार</h1></div>
          <p className="text-green-100">संस्थाका ताजा समाचार तथा घटनाहरू</p>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {news.length === 0 ? (
            <div className="text-center py-16 text-gray-400"><Newspaper className="w-12 h-12 mx-auto mb-4 opacity-30" /><p>हाल कुनै समाचार छैन।</p></div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <Link key={item.id} href={`/news/${item.slug}`} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 overflow-hidden group">
                  {item.image && <div className="h-44 bg-gray-100 overflow-hidden"><img src={`/${item.image}`} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" /></div>}
                  <div className="p-5">
                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-2"><Calendar className="w-3 h-3" />{formatDate(item.createdAt)}</div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-[var(--brand-primary)] transition-colors line-clamp-2">{item.titleNp || item.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
