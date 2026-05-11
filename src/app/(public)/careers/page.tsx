import { prisma } from "@/lib/db";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "क्यारियर — Careers" };

export default async function CareersPage() {
  const careers = await prisma.career.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return (
    <div>
      <section className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-light)] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2"><Briefcase className="w-6 h-6" /><h1 className="text-3xl font-bold">क्यारियर / रोजगारी</h1></div>
          <p className="text-green-100">हाम्रो टोलीमा सामेल हुनुहोस्</p>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {careers.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-medium">हाल कुनै रिक्त पद छैन।</p>
              <p className="text-sm mt-1">पछि फेरि जाँच्नुहोस्।</p>
            </div>
          ) : (
            <div className="space-y-4">
              {careers.map((job) => (
                <div key={job.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{job.titleNp || job.title}</h3>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                        {job.department && <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{job.department}</span>}
                        {job.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>}
                        {job.deadline && <span className="flex items-center gap-1 text-red-500"><Calendar className="w-3 h-3" />म्याद: {formatDate(job.deadline)}</span>}
                      </div>
                      {job.description && <p className="text-gray-600 text-sm mt-3 leading-relaxed line-clamp-3">{job.description}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="bg-green-100 text-[var(--brand-primary)] text-xs font-semibold px-3 py-1 rounded-full">{job.jobType}</span>
                      {job.salary && <span className="text-sm font-medium text-gray-700">{job.salary}</span>}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <a href="/contact" className="inline-flex items-center gap-2 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
                      आवेदन दिनुहोस्
                    </a>
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
