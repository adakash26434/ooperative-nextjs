import { prisma } from "@/lib/db";
import { PageBanner } from "@/components/ui/PageBanner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Users } from "lucide-react";
import Image from "next/image";

export const metadata = { title: "टोली — Team" };

export default async function TeamPage() {
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
      <PageBanner title="हाम्रो टोली" subtitle="संस्थाका पदाधिकारी तथा कर्मचारीहरू"
        icon={<Users className="w-7 h-7" />}
        breadcrumbs={[{ label: "गृहपृष्ठ", href: "/" }, { label: "टोली" }]} />
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl space-y-12">
          {members.length === 0 ? (
            <EmptyState icon={<Users className="w-16 h-16" />} title="कुनै जानकारी छैन।" />
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-[var(--brand-primary)] inline-block">{category}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                  {items.map((member) => (
                    <div key={member.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center hover:shadow-md transition-shadow">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-green-50 mx-auto mb-3 ring-2 ring-[var(--brand-primary)] ring-offset-2">
                        {member.photo ? (
                          <Image src={`/${member.photo}`} alt={member.name} width={80} height={80} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[var(--brand-primary)] font-bold text-2xl">
                            {member.name?.[0]}
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm">{member.name}</h3>
                      {member.positionNp && <p className="text-xs text-[var(--brand-primary)] mt-0.5">{member.positionNp}</p>}
                      {member.phone && <p className="text-xs text-gray-400 mt-1">{member.phone}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
