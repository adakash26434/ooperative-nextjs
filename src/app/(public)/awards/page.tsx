import { PageBanner } from "@/components/ui/PageBanner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Trophy, Medal, Calendar } from "lucide-react";

export const metadata = { title: "सम्मान तथा पुरस्कार — Awards" };

const AWARDS = [
  {
    title: "उत्कृष्ट सहकारी संस्था पुरस्कार",
    awardedBy: "नेपाल सहकारी महासंघ",
    year: "२०८०",
    description: "उत्कृष्ट सेवा र व्यवस्थापनका लागि प्रदान गरिएको।",
  },
  {
    title: "डिजिटल सहकारी पुरस्कार",
    awardedBy: "सहकारी विभाग, नेपाल सरकार",
    year: "२०७९",
    description: "डिजिटल सेवा विस्तारमा उल्लेखनीय योगदानका लागि।",
  },
  {
    title: "सामुदायिक विकास पुरस्कार",
    awardedBy: "जिल्ला सहकारी संघ",
    year: "२०७८",
    description: "स्थानीय समुदायको आर्थिक विकासमा सराहनीय योगदानका लागि।",
  },
];

export default function AwardsPage() {
  return (
    <div>
      <PageBanner title="सम्मान तथा पुरस्कार" subtitle="संस्थाले प्राप्त गरेका सम्मान र पुरस्कारहरू"
        icon={<Trophy className="w-7 h-7" />}
        breadcrumbs={[{ label: "गृहपृष्ठ", href: "/" }, { label: "सम्मान" }]} />
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {AWARDS.length === 0 ? (
            <EmptyState icon={<Trophy className="w-16 h-16" />} title="कुनै सम्मान उपलब्ध छैन।" />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {AWARDS.map((award, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow text-center">
                  <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-amber-500" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{award.title}</h3>
                  <div className="flex items-center justify-center gap-1 text-sm text-[var(--brand-primary)] mb-1">
                    <Medal className="w-3.5 h-3.5" />
                    <span>{award.awardedBy}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mb-3">
                    <Calendar className="w-3 h-3" />
                    <span>{award.year}</span>
                  </div>
                  <p className="text-sm text-gray-500">{award.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
