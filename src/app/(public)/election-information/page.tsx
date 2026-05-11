import { PageBanner } from "@/components/ui/PageBanner";
import { Vote, Calendar, Users, FileText } from "lucide-react";

export const metadata = { title: "निर्वाचन सूचना — Election Information" };

const MILESTONES = [
  { label: "मतदाता नामावली प्रकाशन", date: "२०८१ भदौ १", status: "done" },
  { label: "उम्मेदवारी दर्ता", date: "२०८१ भदौ ५–१०", status: "done" },
  { label: "उम्मेदवारी नामावली प्रकाशन", date: "२०८१ भदौ १२", status: "done" },
  { label: "निर्वाचन प्रचार", date: "२०८१ भदौ १३–१७", status: "active" },
  { label: "मतदान दिन", date: "२०८१ भदौ १८", status: "upcoming" },
  { label: "मत गणना", date: "२०८१ भदौ १८", status: "upcoming" },
  { label: "नतिजा प्रकाशन", date: "२०८१ भदौ १९", status: "upcoming" },
];

const POSITIONS = [
  { title: "अध्यक्ष", count: 1 },
  { title: "उपाध्यक्ष", count: 1 },
  { title: "सचिव", count: 1 },
  { title: "कोषाध्यक्ष", count: 1 },
  { title: "सदस्य", count: 9 },
];

const STATUS_STYLE: Record<string, string> = {
  done: "bg-green-100 text-green-700",
  active: "bg-amber-100 text-amber-700",
  upcoming: "bg-gray-100 text-gray-500",
};
const STATUS_LABEL: Record<string, string> = {
  done: "सम्पन्न", active: "जारी", upcoming: "आगामी",
};

export default function ElectionInformationPage() {
  return (
    <div>
      <PageBanner title="निर्वाचन सूचना" subtitle="संस्थाको समिति निर्वाचन सम्बन्धी जानकारी"
        icon={<Vote className="w-7 h-7" />}
        breadcrumbs={[{ label: "गृहपृष्ठ", href: "/" }, { label: "निर्वाचन सूचना" }]} />

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Timeline */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[var(--brand-primary)]" /> निर्वाचन कार्यतालिका
              </h2>
              <div className="relative space-y-3">
                <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-100" />
                {MILESTONES.map((m, i) => (
                  <div key={i} className="flex gap-4 pl-10 relative">
                    <div className={`absolute left-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${STATUS_STYLE[m.status]} border-2 border-white shadow`}>
                      {i + 1}
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-gray-800">{m.label}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${STATUS_STYLE[m.status]}`}>{STATUS_LABEL[m.status]}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">{m.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {/* Positions */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[var(--brand-primary)]" /> निर्वाचित हुने पदहरू
                </h2>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">पद</th>
                        <th className="text-right px-4 py-3 font-semibold text-gray-700">संख्या</th>
                      </tr>
                    </thead>
                    <tbody>
                      {POSITIONS.map((p, i) => (
                        <tr key={i} className="border-t border-gray-50">
                          <td className="px-4 py-3 text-gray-800">{p.title}</td>
                          <td className="px-4 py-3 text-right font-bold text-[var(--brand-primary)]">{p.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Voter info */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> मतदाताको योग्यता
                </h3>
                <ul className="space-y-1 text-sm text-blue-800">
                  {["स्वीकृत सदस्य हुनुपर्ने", "कम्तीमा ६ महिनादेखि सदस्य", "बकाया नहुनु पर्ने", "सदस्यता नवीकरण गरेको हुनुपर्ने"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
