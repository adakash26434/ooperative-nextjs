import { prisma } from "@/lib/db";
import { PageBanner } from "@/components/ui/PageBanner";
import { Card, CardBody } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { MapPin, Phone, Mail, Building2 } from "lucide-react";

export const metadata = { title: "सेवा केन्द्रहरू — Service Centers" };

export default async function ServiceCentersPage() {
  const centers = await prisma.serviceCenter.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  }).catch(() => []);

  return (
    <div>
      <PageBanner
        title="सेवा केन्द्रहरू"
        subtitle="हाम्रा शाखा तथा सेवा केन्द्रहरूको जानकारी"
        icon={<Building2 className="w-7 h-7" />}
        breadcrumbs={[{ label: "गृहपृष्ठ", href: "/" }, { label: "सेवा केन्द्रहरू" }]}
      />
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {centers.length === 0 ? (
            <EmptyState icon={<Building2 className="w-16 h-16" />} title="कुनै सेवा केन्द्र छैन" />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {centers.map((center) => (
                <Card key={center.id} hover>
                  <CardBody>
                    <h3 className="font-bold text-gray-900 mb-3">{center.nameNp || center.name}</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {center.address && (
                        <li className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[var(--brand-primary)] shrink-0 mt-0.5" />
                          {center.address}
                        </li>
                      )}
                      {center.phone && (
                        <li className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
                          <a href={`tel:${center.phone}`} className="hover:text-[var(--brand-primary)]">{center.phone}</a>
                        </li>
                      )}
                      {center.email && (
                        <li className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
                          <a href={`mailto:${center.email}`} className="hover:text-[var(--brand-primary)] truncate">{center.email}</a>
                        </li>
                      )}
                    </ul>
                    {center.mapUrl && (
                      <a href={center.mapUrl} target="_blank" rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand-primary)] hover:underline">
                        <MapPin className="w-3 h-3" /> नक्सामा हेर्नुहोस्
                      </a>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
