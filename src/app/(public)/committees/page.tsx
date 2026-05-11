import { prisma } from "@/lib/db";
import { PageBanner } from "@/components/ui/PageBanner";
import { EmptyState } from "@/components/ui/EmptyState";
import { UsersRound } from "lucide-react";
import Image from "next/image";

export const metadata = { title: "समितिहरू — Committees" };

const COMMITTEE_LABELS: Record<string, string> = {
  board: "सञ्चालक समिति",
  management: "व्यवस्थापन समिति",
  staff: "कर्मचारीहरू",
};

export default async function CommitteesPage() {
  type TM = Awaited<ReturnType<typeof prisma.teamMember.findMany>>[number];
  let members: TM[] = [];
  try {
    members = await prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { displayOrder: "asc" }],
    });
  } catch {}

  const grouped = members.reduce<Record<string, TM[]>>((acc, m) => {
    (acc[String(m.category)] ??= []).push(m);
    return acc;
  }, {});

  return (
    <div>
      <PageBanner title="समितिहरू" subtitle="संस्थाका विभिन्न समिति तथा पदाधिकारीहरू"
        icon={<UsersRound className="w-7 h-7" />}
        breadcrumbs={[{ label: "गृहपृष्ठ", href: "/" }, { label: "समितिहरू" }]} />
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl space-y-12">
          {members.length === 0 ? (
            <EmptyState icon={<UsersRound className="w-16 h-16" />} title="कुनै जानकारी छैन।" />
          ) : (
            Object.entries(grouped).map(([cat, items]) => (
              <div key={cat}>
                <h2 className="text-xl font-bold text-gray-900 mb-6 border-b-2 border-[var(--brand-primary)] pb-2 inline-block">
                  {COMMITTEE_LABELS[cat] || cat}
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-xl border border-gray-100 shadow-sm text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold">क्र.सं.</th>
                        <th className="text-left px-4 py-3 font-semibold">नाम</th>
                        <th className="text-left px-4 py-3 font-semibold">पद</th>
                        <th className="text-left px-4 py-3 font-semibold">फोन</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {items.map((m, i) => (
                        <tr key={m.id} className="hover:bg-green-50 transition-colors">
                          <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-[var(--brand-primary)] font-bold text-sm shrink-0">
                                {m.photo ? (
                                  <Image src={`/${m.photo}`} alt={m.name} width={32} height={32} className="rounded-full object-cover" />
                                ) : m.name?.[0]}
                              </div>
                              <span className="font-medium text-gray-900">{m.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-[var(--brand-primary)]">{m.positionNp || m.position || "—"}</td>
                          <td className="px-4 py-3 text-gray-500">{m.phone || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
