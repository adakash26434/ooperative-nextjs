import { prisma } from "@/lib/db";
import { Shield, PiggyBank, CreditCard, Smartphone, RefreshCw } from "lucide-react";

export const metadata = { title: "सेवाहरू — Services" };

const iconMap: Record<string, React.ReactNode> = {
  "fas fa-piggy-bank": <PiggyBank className="w-10 h-10" />,
  "fas fa-hand-holding-usd": <CreditCard className="w-10 h-10" />,
  "fas fa-lock": <Shield className="w-10 h-10" />,
  "fas fa-mobile-alt": <Smartphone className="w-10 h-10" />,
  "fas fa-exchange-alt": <RefreshCw className="w-10 h-10" />,
  "fas fa-shield-alt": <Shield className="w-10 h-10" />,
};

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  }).catch(() => []);

  return (
    <div>
      <section className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-light)] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2"><Shield className="w-6 h-6" /><h1 className="text-3xl font-bold">हाम्रा सेवाहरू</h1></div>
          <p className="text-green-100">उत्कृष्ट वित्तीय सेवाहरू तपाईंको ढोकामा</p>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {services.length === 0 ? (
            <div className="text-center py-16 text-gray-400"><Shield className="w-12 h-12 mx-auto mb-4 opacity-30" /><p>कुनै सेवा छैन।</p></div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((svc) => (
                <div key={svc.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group">
                  <div className="w-16 h-16 rounded-xl bg-green-50 group-hover:bg-[var(--brand-primary)] flex items-center justify-center text-[var(--brand-primary)] group-hover:text-white transition-all mb-4">
                    {iconMap[svc.icon] ?? <Shield className="w-10 h-10" />}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{svc.titleNp || svc.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{svc.descriptionNp || svc.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
