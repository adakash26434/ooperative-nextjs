import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Briefcase, Calendar, MapPin, ArrowLeft, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { PageBanner } from "@/components/ui/PageBanner";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await prisma.career.findUnique({ where: { id: Number(id) } }).catch(() => null);
  return { title: job ? `${job.titleNp || job.title} — क्यारियर` : "क्यारियर" };
}

export default async function CareerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await prisma.career.findUnique({ where: { id: Number(id), isActive: true } }).catch(() => null);
  if (!job) notFound();

  return (
    <div>
      <PageBanner title={job.titleNp || job.title} subtitle={job.department || ""}
        icon={<Briefcase className="w-7 h-7" />}
        breadcrumbs={[{ label: "गृहपृष्ठ", href: "/" }, { label: "क्यारियर", href: "/careers" }, { label: job.titleNp || job.title }]} />

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link href="/careers" className="inline-flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" /> सबै पदहरू
          </Link>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            {/* Meta info */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
              {job.department && <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-[var(--brand-primary)]" />{job.department}</span>}
              {job.location && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[var(--brand-primary)]" />{job.location}</span>}
              {job.deadline && <span className="flex items-center gap-1.5 text-red-500"><Calendar className="w-4 h-4" />अन्तिम मिति: {formatDate(job.deadline)}</span>}
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[var(--brand-primary)]" />{job.jobType}</span>
              {job.salary && <span className="font-semibold text-[var(--brand-primary)]">{job.salary}</span>}
            </div>

            {/* Description */}
            {job.description && (
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap mb-8">
                {job.description}
              </div>
            )}

            {/* Apply */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <h3 className="font-semibold text-gray-800 mb-2">आवेदन दिन सम्पर्क गर्नुहोस्</h3>
              <p className="text-sm text-gray-500 mb-4">
                आफ्नो CV र आवश्यक कागजात लिएर कार्यालयमा आउनुहोस् वा इमेलमा पठाउनुहोस्।
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact"
                  className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors">
                  सम्पर्क गर्नुहोस्
                </Link>
                <Link href="/careers"
                  className="border border-[var(--brand-primary)] text-[var(--brand-primary)] text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-green-50 transition-colors">
                  अन्य पदहरू
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
