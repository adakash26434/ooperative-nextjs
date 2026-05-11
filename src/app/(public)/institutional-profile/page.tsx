import { PageBanner } from "@/components/ui/PageBanner";
import { Building2, TrendingUp, Users, Banknote, Award, CheckCircle } from "lucide-react";

export const metadata = { title: "संस्थागत प्रोफाइल — Institutional Profile" };

const STATS = [
  { label: "स्थापना वर्ष", value: "२०५५", icon: <Building2 className="w-5 h-5" /> },
  { label: "सदस्य संख्या", value: "५,२००+", icon: <Users className="w-5 h-5" /> },
  { label: "शेयर पुँजी", value: "रू. ३.५ करोड+", icon: <Banknote className="w-5 h-5" /> },
  { label: "बचत संकलन", value: "रू. ४५ करोड+", icon: <TrendingUp className="w-5 h-5" /> },
  { label: "ऋण लगानी", value: "रू. ३८ करोड+", icon: <TrendingUp className="w-5 h-5" /> },
  { label: "शाखा संख्या", value: "५", icon: <Building2 className="w-5 h-5" /> },
];

const SERVICES_LIST = [
  "बचत तथा निक्षेप सेवा",
  "ऋण तथा लगानी सेवा",
  "रेमिट्यान्स सेवा",
  "बीमा सेवा",
  "डिजिटल बैंकिङ",
  "सामाजिक सुरक्षा कोष",
  "शिक्षा ऋण",
  "कृषि ऋण",
];

const MILESTONES = [
  { year: "२०५५", event: "संस्था स्थापना" },
  { year: "२०६०", event: "पहिलो शाखा विस्तार" },
  { year: "२०६८", event: "डिजिटल सेवा सुरुवात" },
  { year: "२०७२", event: "सदस्य संख्या २,००० पुग्यो" },
  { year: "२०७७", event: "अनलाइन बैंकिङ लागू" },
  { year: "२०८०", event: "सदस्य संख्या ५,०००+ पुग्यो" },
];

export default function InstitutionalProfilePage() {
  return (
    <div>
      <PageBanner
        title="संस्थागत प्रोफाइल"
        subtitle="संस्थाको वित्तीय तथा संस्थागत जानकारी"
        icon={<Building2 className="w-7 h-7" />}
        breadcrumbs={[{ label: "गृहपृष्ठ", href: "/" }, { label: "हाम्रो बारेमा", href: "/about" }, { label: "संस्थागत प्रोफाइल" }]}
      />

      {/* Key Stats */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-8">मुख्य तथ्याङ्क</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {STATS.map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-[var(--brand-primary)] mx-auto mb-3">
                  {stat.icon}
                </div>
                <div className="text-xl font-bold text-[var(--brand-primary)] mb-1">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Mission */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-light)] rounded-2xl p-7 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6" />
                <h3 className="font-bold text-lg">हाम्रो दृष्टिकोण</h3>
              </div>
              <p className="text-green-100 leading-relaxed">
                समुदायमा आर्थिक समृद्धि ल्याउने उद्देश्यले स्थापित यो संस्था नेपालको सहकारी क्षेत्रमा एक भरपर्दो वित्तीय संस्थाको रूपमा स्थापित छ।
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-[var(--brand-primary)]" />
                <h3 className="font-bold text-lg text-gray-900">हाम्रो लक्ष्य</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                सदस्यहरूको आर्थिक उत्थानका लागि सहज, पारदर्शी र भरपर्दो वित्तीय सेवाहरू प्रदान गर्ने।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-xl font-bold text-gray-900 mb-8 text-center">प्रमुख सेवाहरू</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES_LIST.map((svc, i) => (
              <div key={i} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
                <CheckCircle className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
                <span className="text-sm font-medium text-gray-700">{svc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-xl font-bold text-gray-900 mb-8 text-center">संस्थाको यात्रा</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-green-100" />
            <div className="space-y-6">
              {MILESTONES.map((m, i) => (
                <div key={i} className="flex gap-6 pl-12 relative">
                  <div className="absolute left-0 w-8 h-8 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3 flex-1">
                    <span className="text-xs font-mono text-[var(--brand-primary)] font-bold">{m.year}</span>
                    <p className="text-gray-700 font-medium mt-0.5">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
