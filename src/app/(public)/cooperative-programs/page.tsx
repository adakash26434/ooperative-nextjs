"use client";

import { useState } from "react";
import { PageBanner } from "@/components/ui/PageBanner";
import { CalendarDays, MapPin, Users, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const PROGRAMS = [
  { id: 1, title: "वार्षिक साधारण सभा २०८१", date: "२०८१ असार १५", location: "केन्द्रीय कार्यालय, काठमाडौं", seats: 500, open: true, desc: "संस्थाको वार्षिक साधारण सभामा सहभागी हुन आमन्त्रण।" },
  { id: 2, title: "सदस्य प्रशिक्षण कार्यक्रम", date: "२०८१ साउन ५", location: "पोखरा, गण्डकी", seats: 50, open: true, desc: "बचत तथा ऋण व्यवस्थापनमा व्यावहारिक प्रशिक्षण।" },
  { id: 3, title: "महिला उद्यमशीलता कार्यशाला", date: "२०८१ भदौ १०", location: "बुटवल, लुम्बिनी", seats: 30, open: false, desc: "महिला सदस्यहरूका लागि उद्यमशीलता विकास कार्यशाला।" },
];

export default function CooperativeProgramsPage() {
  const [regForm, setRegForm] = useState({ programId: 0, memberId: "", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handlePreReg(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/grievance", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regForm.memberId,
          subject: `कार्यक्रम pre-registration — ID: ${regForm.programId}`,
          description: regForm.note || "Pre-registration अनुरोध",
          phone: "",
        }),
      });
      const data = await res.json();
      if (data.trackingId) { setSuccess(true); toast.success("Pre-registration सफल भयो!"); }
      else toast.error("त्रुटि भयो।");
    } catch { toast.error("सर्भर त्रुटि।"); }
    finally { setSubmitting(false); }
  }

  return (
    <div>
      <PageBanner title="सहकारी कार्यक्रमहरू" subtitle="आगामी तथा चलिरहेका कार्यक्रमहरू"
        icon={<CalendarDays className="w-7 h-7" />}
        breadcrumbs={[{ label: "गृहपृष्ठ", href: "/" }, { label: "सहकारी कार्यक्रम" }]} />

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl space-y-6">
          {PROGRAMS.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-lg">{p.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${p.open ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.open ? "खुला" : "बन्द"}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-3">{p.desc}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><CalendarDays className="w-4 h-4 text-[var(--brand-primary)]" />{p.date}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-[var(--brand-primary)]" />{p.location}</span>
                    <span className="flex items-center gap-1"><Users className="w-4 h-4 text-[var(--brand-primary)]" />सिट: {p.seats}</span>
                  </div>
                </div>
                {p.open && (
                  <button onClick={() => setRegForm({ programId: p.id, memberId: "", note: "" })}
                    className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shrink-0">
                    Pre-register
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pre-reg modal */}
      {regForm.programId > 0 && !success && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setRegForm({ ...regForm, programId: 0 })}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4">Pre-registration</h3>
            <form onSubmit={handlePreReg} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">सदस्यता नं. / कार्ड नं. *</label>
                <input required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  placeholder="सदस्यता नम्बर"
                  value={regForm.memberId} onChange={(e) => setRegForm({ ...regForm, memberId: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">नोट (वैकल्पिक)</label>
                <textarea className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]" rows={2}
                  value={regForm.note} onChange={(e) => setRegForm({ ...regForm, note: e.target.value })} />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-[var(--brand-primary)] text-white py-2.5 rounded-xl font-semibold text-sm disabled:opacity-60">
                  {submitting ? "पठाउँदैछ..." : "दर्ता गर्नुहोस्"}
                </button>
                <button type="button" onClick={() => setRegForm({ ...regForm, programId: 0 })}
                  className="px-5 border border-gray-300 rounded-xl text-sm font-medium text-gray-600">बन्द</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {success && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSuccess(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
            <CheckCircle className="w-14 h-14 text-[var(--brand-primary)] mx-auto mb-3" />
            <h3 className="font-bold text-lg">Pre-registration सफल!</h3>
            <p className="text-gray-500 text-sm mt-2 mb-4">तपाईंको अनुरोध दर्ता भयो।</p>
            <button onClick={() => setSuccess(false)} className="bg-[var(--brand-primary)] text-white px-6 py-2 rounded-xl text-sm font-semibold">ठीक छ</button>
          </div>
        </div>
      )}
    </div>
  );
}
