import { PageBanner } from "@/components/ui/PageBanner";
import { Handshake, ExternalLink, CheckCircle } from "lucide-react";

export const metadata = { title: "साझेदार सुविधाहरू — Partner Facilities" };

const PARTNERS = [
  {
    category: "बैंकिङ तथा वित्तीय सेवा",
    items: [
      { name: "नाबिल बैंक", desc: "बैंकिङ पार्टनर — ATM तथा भुक्तानी सेवा", url: "https://www.nabilbank.com" },
      { name: "एनआईसी एशिया बैंक", desc: "रेमिट्यान्स तथा भुक्तानी सेवा", url: "https://www.nicasiabank.com" },
    ],
  },
  {
    category: "बीमा सेवा",
    items: [
      { name: "नेपाल लाइफ इन्स्योरेन्स", desc: "जीवन बीमा सेवा — सदस्यहरूका लागि विशेष दर", url: "https://www.nepalifeinsurance.com" },
      { name: "शिखर इन्स्योरेन्स", desc: "सम्पत्ति तथा दुर्घटना बीमा", url: "https://www.shikharinsurance.com" },
    ],
  },
  {
    category: "प्रविधि साझेदार",
    items: [
      { name: "फोनपे नेपाल", desc: "डिजिटल भुक्तानी एकीकरण", url: "#" },
      { name: "ई-सेवा", desc: "अनलाइन भुक्तानी गेटवे", url: "https://www.esewa.com.np" },
    ],
  },
];

const BENEFITS = [
  "सदस्यहरूलाई विशेष छूट दर",
  "प्राथमिकता सेवा",
  "एकीकृत डिजिटल भुक्तानी",
  "बीमा तथा सुरक्षा सुविधा",
  "साझेदार संस्थामा सजिलो कर्जा",
  "थप ब्याज दर सुविधा",
];

export default function PartnerFacilitiesPage() {
  return (
    <div>
      <PageBanner title="साझेदार सुविधाहरू" subtitle="संस्थाका साझेदार संस्था तथा उनीहरूबाट प्राप्त हुने सुविधाहरू"
        icon={<Handshake className="w-7 h-7" />}
        breadcrumbs={[{ label: "गृहपृष्ठ", href: "/" }, { label: "साझेदार सुविधाहरू" }]} />

      {/* Benefits */}
      <section className="bg-green-50 py-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">सदस्यहरूले पाउने सुविधाहरू</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {BENEFITS.map((b, i) => (
              <div key={i} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-green-100 shadow-sm">
                <CheckCircle className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
                <span className="text-sm font-medium text-gray-700">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl space-y-10">
          {PARTNERS.map((group, gi) => (
            <div key={gi}>
              <h2 className="text-lg font-bold text-gray-800 mb-5 pb-2 border-b-2 border-[var(--brand-primary)] inline-block">
                {group.category}
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {group.items.map((p, pi) => (
                  <div key={pi} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-[var(--brand-primary)] shrink-0">
                      <Handshake className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{p.name}</h3>
                      <p className="text-sm text-gray-500 mb-3">{p.desc}</p>
                      {p.url !== "#" && (
                        <a href={p.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-[var(--brand-primary)] hover:underline">
                          वेबसाइट <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
