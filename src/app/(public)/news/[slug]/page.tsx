import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await prisma.news.findFirst({ where: { slug, isActive: true } }).catch(() => null);
  return { title: item ? `${item.titleNp || item.title} — समाचार` : "समाचार" };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await prisma.news.findFirst({ where: { slug, isActive: true } }).catch(() => null);
  if (!item) notFound();

  return (
    <div>
      <section className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-light)] text-white py-10">
        <div className="container mx-auto px-4">
          <Link href="/news" className="inline-flex items-center gap-2 text-green-100 hover:text-white text-sm mb-4"><ArrowLeft className="w-4 h-4" />समाचारमा फिर्ता</Link>
          <h1 className="text-2xl md:text-3xl font-bold">{item.titleNp || item.title}</h1>
          <div className="flex items-center gap-2 text-green-100 text-sm mt-2"><Calendar className="w-4 h-4" />{formatDate(item.createdAt)}</div>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {item.image && <img src={`/${item.image}`} alt="" className="w-full rounded-2xl mb-8 object-cover max-h-80" />}
          <div className="prose prose-green max-w-none" dangerouslySetInnerHTML={{ __html: item.contentNp || item.content || "" }} />
        </div>
      </section>
    </div>
  );
}
