import { PageBanner } from "@/components/ui/PageBanner";
import { Link2, ExternalLink } from "lucide-react";

export const metadata = { title: "महत्त्वपूर्ण लिंकहरू — Important Links" };

const LINKS: Record<string, { title: string; url: string }[]> = {
  "सरकारी निकाय": [
    { title: "नेपाल सरकारको पोर्टल", url: "https://www.nepal.gov.np" },
    { title: "नेपाल राष्ट्र बैंक", url: "https://www.nrb.org.np" },
    { title: "सहकारी विभाग", url: "https://www.doca.gov.np" },
    { title: "नेपाल धितोपत्र बोर्ड", url: "https://www.sebon.gov.np" },
  ],
  "कर तथा दर्ता": [
    { title: "आन्तरिक राजस्व विभाग", url: "https://www.ird.gov.np" },
    { title: "कम्पनी रजिस्ट्रार", url: "https://www.ocr.gov.np" },
  ],
  "वित्तीय संस्थाहरू": [
    { title: "नाबिल बैंक", url: "https://www.nabilbank.com" },
    { title: "एनआईसी एशिया बैंक", url: "https://www.nicasiabank.com" },
    { title: "एभरेस्ट बैंक", url: "https://www.everestbankltd.com" },
  ],
  "उपयोगी सेवाहरू": [
    { title: "नागरिकता अनलाइन — नागरिक एप", url: "https://nagarik.gov.np" },
    { title: "विद्युत प्राधिकरण", url: "https://nea.org.np" },
    { title: "दूरसंचार प्राधिकरण", url: "https://www.nta.gov.np" },
  ],
};

export default function ImportantLinksPage() {
  return (
    <div>
      <PageBanner title="महत्त्वपूर्ण लिंकहरू" subtitle="उपयोगी वेबसाइट तथा सरकारी सम्पर्क"
        icon={<Link2 className="w-7 h-7" />}
        breadcrumbs={[{ label: "गृहपृष्ठ", href: "/" }, { label: "महत्त्वपूर्ण लिंकहरू" }]} />
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            {Object.entries(LINKS).map(([cat, items]) => (
              <div key={cat}>
                <h2 className="text-lg font-bold text-gray-800 mb-4 border-b-2 border-[var(--brand-primary)] pb-2 inline-block">{cat}</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {items.map((link, i) => (
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-[var(--brand-primary)] hover:shadow-sm transition-all group">
                      <div className="w-8 h-8 rounded-lg bg-green-50 group-hover:bg-[var(--brand-primary)] flex items-center justify-center text-[var(--brand-primary)] group-hover:text-white transition-colors shrink-0">
                        <Link2 className="w-4 h-4" />
                      </div>
                      <span className="flex-1 font-medium text-gray-800 text-sm">{link.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
