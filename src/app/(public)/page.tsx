import Link from "next/link";
import { prisma } from "@/lib/db";
import { ArrowRight, PiggyBank, CreditCard, TrendingUp, Shield, Smartphone, RefreshCw, Bell, Users } from "lucide-react";

async function getHomeData() {
  try {
    const [services, notices, interestRates, settings] = await Promise.all([
      prisma.service.findMany({ where: { isActive: true }, orderBy: { displayOrder: "asc" }, take: 6 }),
      prisma.notice.findMany({ where: { isActive: true }, orderBy: { noticeDate: "desc" }, take: 5 }),
      prisma.interestRate.findMany({ where: { isActive: true }, orderBy: { displayOrder: "asc" }, take: 6 }),
      prisma.siteSetting.findMany({ where: { settingKey: { in: ["site_name", "site_slogan", "hero_title", "hero_subtitle", "about_short"] } } }),
    ]);
    const s: Record<string, string> = {};
    for (const item of settings) s[item.settingKey] = item.settingValue ?? "";
    return { services, notices, interestRates, settings: s };
  } catch {
    return { services: [], notices: [], interestRates: [], settings: {} };
  }
}

const iconMap: Record<string, React.ReactNode> = {
  "fas fa-piggy-bank": <PiggyBank className="w-8 h-8" />,
  "fas fa-hand-holding-usd": <CreditCard className="w-8 h-8" />,
  "fas fa-lock": <Shield className="w-8 h-8" />,
  "fas fa-mobile-alt": <Smartphone className="w-8 h-8" />,
  "fas fa-exchange-alt": <RefreshCw className="w-8 h-8" />,
  "fas fa-shield-alt": <Shield className="w-8 h-8" />,
};

export default async function HomePage() {
  const { services, notices, interestRates, settings } = await getHomeData();

  const savingRates = interestRates.filter((r) => r.category === "saving");
  const loanRates = interestRates.filter((r) => r.category === "loan");

  return (
    <div>
      {/* Marquee notices */}
      {notices.length > 0 && (
        <div className="bg-amber-50 border-b border-amber-200 py-2 overflow-hidden">
          <div className="flex items-center gap-3 px-4">
            <span className="bg-[var(--brand-primary)] text-white text-xs font-bold px-2 py-0.5 rounded shrink-0 flex items-center gap-1">
              <Bell className="w-3 h-3" /> सूचना
            </span>
            <div className="overflow-hidden flex-1">
              <div className="flex gap-8 animate-[marquee_30s_linear_infinite] whitespace-nowrap">
                {notices.map((n) => (
                  <Link key={n.id} href="/notices" className="text-sm text-amber-800 hover:text-[var(--brand-primary)] shrink-0">
                    {n.titleNp || n.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[var(--brand-primary)] via-[var(--brand-primary-light)] to-[var(--brand-primary-dark)] text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              स्थापना: २०७८ | सेवा जारी छ
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              {settings.hero_title || "तपाईंको भविष्यको लागि बचत गर्नुहोस्"}
            </h1>
            <p className="text-lg md:text-xl text-green-100 mb-8 leading-relaxed">
              {settings.hero_subtitle || "हामीसँग बचत गर्नुहोस्, सुरक्षित भविष्य बनाउनुहोस्"}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/online-account" className="bg-white text-[var(--brand-primary)] hover:bg-green-50 font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2">
                खाता खोल्नुहोस् <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/loan-apply" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm font-bold px-6 py-3 rounded-xl transition-all border border-white/30 flex items-center gap-2">
                ऋण आवेदन <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
        {/* Stats bar */}
        <div className="container mx-auto px-4 mt-12 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "सदस्यहरू", value: "५,०००+", icon: <Users className="w-5 h-5" /> },
              { label: "बचत (करोड)", value: "५०+", icon: <PiggyBank className="w-5 h-5" /> },
              { label: "ऋण वितरण (करोड)", value: "४५+", icon: <CreditCard className="w-5 h-5" /> },
              { label: "शाखाहरू", value: "१२+", icon: <TrendingUp className="w-5 h-5" /> },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="flex justify-center mb-1 text-green-200">{stat.icon}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-green-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">हाम्रा सेवाहरू</h2>
            <p className="text-gray-500 max-w-xl mx-auto">हामी तपाईंलाई उत्तम वित्तीय सेवाहरू प्रदान गर्छौं।</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc) => (
              <div key={svc.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-gray-100 group">
                <div className="w-14 h-14 rounded-xl bg-green-50 group-hover:bg-[var(--brand-primary)] flex items-center justify-center text-[var(--brand-primary)] group-hover:text-white transition-all mb-4">
                  {iconMap[svc.icon] ?? <Shield className="w-8 h-8" />}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{svc.titleNp || svc.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{svc.descriptionNp || svc.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/services" className="inline-flex items-center gap-2 text-[var(--brand-primary)] font-semibold hover:underline">
              सबै सेवाहरू हेर्नुहोस् <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Interest Rates Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">ब्याज दरहरू</h2>
            <p className="text-gray-500">आकर्षक ब्याज दरमा बचत गर्नुहोस् र ऋण लिनुहोस्।</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Saving */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-[var(--brand-primary)] text-white px-6 py-4 flex items-center gap-2">
                <PiggyBank className="w-5 h-5" />
                <h3 className="font-bold">बचत ब्याज दर</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {savingRates.map((r) => (
                  <div key={r.id} className="flex justify-between items-center px-6 py-3 hover:bg-gray-50">
                    <span className="text-gray-700 text-sm">{r.nameNp || r.name}</span>
                    <span className="font-bold text-[var(--brand-primary)] text-lg">{Number(r.rate).toFixed(2)}%</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Loan */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-[var(--brand-secondary)] text-white px-6 py-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                <h3 className="font-bold">ऋण ब्याज दर</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {loanRates.map((r) => (
                  <div key={r.id} className="flex justify-between items-center px-6 py-3 hover:bg-gray-50">
                    <span className="text-gray-700 text-sm">{r.nameNp || r.name}</span>
                    <span className="font-bold text-orange-600 text-lg">{Number(r.rate).toFixed(2)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="text-center mt-6">
            <Link href="/interest-rates" className="inline-flex items-center gap-2 text-[var(--brand-primary)] font-semibold hover:underline">
              पूर्ण ब्याज दर तालिका <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[var(--brand-primary)]">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">आज नै सदस्य बन्नुहोस्</h2>
          <p className="text-green-100 mb-8 max-w-xl mx-auto">हाम्रो सहकारी परिवारमा सामेल हुनुहोस् र वित्तीय स्वतन्त्रता पाउनुहोस्।</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/online-account" className="bg-white text-[var(--brand-primary)] font-bold px-8 py-3 rounded-xl hover:bg-green-50 transition-all shadow-lg">
              खाता खोल्नुहोस्
            </Link>
            <Link href="/contact" className="border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-white/10 transition-all">
              सम्पर्क गर्नुहोस्
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
