import { prisma } from "@/lib/db";
import { PageBanner } from "@/components/ui/PageBanner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Smartphone, ArrowRight } from "lucide-react";

export const metadata = { title: "डिजिटल सेवाहरू — Digital Services" };

export default async function DigitalServicesPage() {
  type SVC = Awaited<ReturnType<typeof prisma.service.findMany>>[number];
  let services: SVC[] = [];
  try {
    services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });
  } catch {}

  const ICONS = ["💳", "📱", "🏦", "💰", "🔒", "📊", "🌐", "⚡"];

  return (
    <div>
      <PageBanner title="डिजिटल सेवाहरू" subtitle="अनलाइन तथा डिजिटल माध्यमबाट उपलब्ध सेवाहरू"
        icon={<Smartphone className="w-7 h-7" />}
        breadcrumbs={[{ label: "गृहपृष्ठ", href: "/" }, { label: "डिजिटल सेवाहरू" }]} />

      {/* Hero highlight */}
      <section className="bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-light)] text-white py-10">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-2xl font-bold mb-3">घरबाटै सेवा लिनुहोस्</h2>
          <p className="text-green-100 max-w-xl mx-auto">मोबाइल र इन्टरनेटको माध्यमबाट खाता जाँच, ऋण आवेदन, KYC अपडेट लगायतका सेवाहरू अब घरैबाट उपलब्ध छन्।</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {services.length === 0 ? (
            /* Static fallback cards */
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: "💳", title: "अनलाइन खाता खोल्नुहोस्", desc: "घरबाटै नयाँ बचत वा मुद्दती खाता खोल्नुहोस्।", href: "/online-account" },
                { icon: "📋", title: "अनलाइन KYC", desc: "आफ्नो KYC फारम अनलाइन नै भर्नुहोस्।", href: "/online-kyc" },
                { icon: "🏦", title: "ऋण आवेदन", desc: "घरबाटै ऋणको लागि आवेदन दिनुहोस्।", href: "/loan-apply" },
                { icon: "📅", title: "भेटघाट बुकिङ", desc: "कार्यालयसँग भेटको समय बुक गर्नुहोस्।", href: "/appointment" },
                { icon: "📊", title: "ब्याज दर हेर्नुहोस्", desc: "बचत र ऋणको ब्याज दर जाँच्नुहोस्।", href: "/interest-rates" },
                { icon: "🔍", title: "आवेदन ट्र्याकिङ", desc: "आफ्नो आवेदनको स्थिति जाँच्नुहोस्।", href: "/track-application" },
              ].map((svc, i) => (
                <a key={i} href={svc.href}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all group">
                  <div className="text-4xl mb-4">{svc.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[var(--brand-primary)] transition-colors">{svc.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{svc.desc}</p>
                  <span className="flex items-center gap-1 text-sm text-[var(--brand-primary)] font-medium">
                    थप जान्नुहोस् <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((svc, i) => (
                <div key={svc.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="text-4xl mb-4">{ICONS[i % ICONS.length]}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{svc.titleNp || svc.title}</h3>
                  {svc.descriptionNp && <p className="text-sm text-gray-500">{svc.descriptionNp}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
