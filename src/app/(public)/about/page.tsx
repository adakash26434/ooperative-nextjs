import { prisma } from "@/lib/db";
import { Users, Target, Eye, Star } from "lucide-react";

export const metadata = { title: "हाम्रो बारेमा — About Us" };

export default async function AboutPage() {
  const [teamMembers, settings] = await Promise.all([
    prisma.teamMember.findMany({ where: { isActive: true, category: "board" }, orderBy: { displayOrder: "asc" }, take: 12 }).catch(() => []),
    prisma.siteSetting.findMany({ where: { settingKey: { in: ["about_short", "site_name"] } } }).catch(() => []),
  ]);
  const s: Record<string, string> = {};
  for (const item of settings) s[item.settingKey] = item.settingValue ?? "";

  return (
    <div>
      <section className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-light)] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2"><Users className="w-6 h-6" /><h1 className="text-3xl font-bold">हाम्रो बारेमा</h1></div>
          <p className="text-green-100">संस्थाको परिचय र इतिहास</p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">परिचय</h2>
            <p className="text-gray-600 leading-relaxed text-lg">{s.about_short || "हाम्रो सहकारी संस्था समुदायमा आधारित सक्षम र दिगो वित्तीय सेवा प्रदान गर्छ।"}</p>
          </div>
        </div>
      </section>

      {/* Vision Mission Values */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Eye className="w-8 h-8" />, title: "हाम्रो दृष्टिकोण", content: "एक समृद्ध र आत्मनिर्भर समुदायको निर्माणमा सहयोग पुर्याउनु।" },
              { icon: <Target className="w-8 h-8" />, title: "हाम्रो लक्ष्य", content: "सदस्यहरूलाई सुलभ वित्तीय सेवा प्रदान गरी जीवनस्तर उकास्नु।" },
              { icon: <Star className="w-8 h-8" />, title: "हाम्रो मूल्य", content: "इमानदारिता, पारदर्शिता, सहयोग र समर्पण हाम्रा मूल मान्यताहरू हुन्।" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl border border-gray-100 p-6 text-center shadow-sm">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-[var(--brand-primary)] mx-auto mb-4">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Board Members */}
      {teamMembers.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">सञ्चालक समिति</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3 overflow-hidden">
                    {member.photo ? <img src={`/${member.photo}`} alt={member.name} className="w-full h-full object-cover" /> : <Users className="w-8 h-8 text-[var(--brand-primary)]" />}
                  </div>
                  <div className="font-semibold text-gray-900 text-sm">{member.name}</div>
                  <div className="text-xs text-[var(--brand-primary)] mt-1">{member.positionNp || member.position}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
