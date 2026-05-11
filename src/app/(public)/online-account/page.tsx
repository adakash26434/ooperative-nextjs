"use client";

import { useState } from "react";
import { PageBanner } from "@/components/ui/PageBanner";
import { Card, CardBody } from "@/components/ui/Card";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CheckCircle, UserPlus } from "lucide-react";
import { toast } from "sonner";

const ACCOUNT_TYPES = [
  { value: "बचत खाता", label: "बचत खाता" },
  { value: "मुद्दती खाता", label: "मुद्दती खाता" },
  { value: "चल्ती खाता", label: "चल्ती खाता" },
  { value: "आवर्ती खाता", label: "आवर्ती खाता" },
];
const GENDERS = [
  { value: "male", label: "पुरुष" },
  { value: "female", label: "महिला" },
  { value: "other", label: "अन्य" },
];

export default function OnlineAccountPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    accountType: "", fullName: "", fullNameEn: "", dobAd: "", gender: "",
    maritalStatus: "", mobile: "", email: "", permanentAddress: "",
    temporaryAddress: "", citizenshipNo: "", citizenshipIssuedDate: "",
    citizenshipIssuedPlace: "", fatherName: "", motherName: "",
    occupation: "", monthlyIncome: "", initialDeposit: "",
    nomineeName: "", nomineeRelation: "", nomineePhone: "", branch: "",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/online-account", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.trackingId) { setTrackingId(data.trackingId); toast.success("आवेदन दर्ता भयो!"); }
      else toast.error(data.error || "त्रुटि भयो।");
    } catch { toast.error("सर्भर त्रुटि भयो।"); }
    finally { setLoading(false); }
  }

  if (trackingId) return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl border border-green-200 shadow-sm p-10 text-center max-w-md w-full">
        <CheckCircle className="w-16 h-16 text-[var(--brand-primary)] mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">आवेदन सफलतापूर्वक दर्ता भयो!</h2>
        <p className="text-gray-500 mb-4 text-sm">तपाईंको खाता खोल्ने आवेदन प्राप्त भयो। ट्र्याकिङ आईडी:</p>
        <div className="bg-green-50 border-2 border-[var(--brand-primary)] rounded-xl px-6 py-4 text-2xl font-mono font-bold text-[var(--brand-primary)] mb-4">{trackingId}</div>
        <p className="text-xs text-gray-400 mb-6">कार्यालयले सम्पर्क गर्नेछ। यो आईडी सुरक्षित राख्नुहोस्।</p>
        <a href="/track-application" className="inline-block bg-[var(--brand-primary)] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[var(--brand-primary-dark)] transition-colors">स्थिति जाँच्नुहोस्</a>
      </div>
    </div>
  );

  return (
    <div>
      <PageBanner title="अनलाइन खाता खोल्नुहोस्" subtitle="घरबाटै खाता खोल्ने सुविधा"
        icon={<UserPlus className="w-7 h-7" />}
        breadcrumbs={[{ label: "गृहपृष्ठ", href: "/" }, { label: "अनलाइन खाता खोल्नुहोस्" }]} />

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {["व्यक्तिगत", "सम्पर्क", "परिचय", "नमिनी"].map((label, i) => (
              <div key={i} className="flex items-center gap-2">
                <button onClick={() => step > i + 1 && setStep(i + 1)}
                  className={`w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center transition-colors ${step === i + 1 ? "bg-[var(--brand-primary)] text-white" : step > i + 1 ? "bg-green-200 text-[var(--brand-primary)] cursor-pointer" : "bg-gray-100 text-gray-400"}`}>
                  {step > i + 1 ? "✓" : i + 1}
                </button>
                <span className={`text-xs hidden sm:block ${step === i + 1 ? "text-[var(--brand-primary)] font-semibold" : "text-gray-400"}`}>{label}</span>
                {i < 3 && <div className="w-6 h-px bg-gray-200" />}
              </div>
            ))}
          </div>

          <Card>
            <CardBody>
              <form onSubmit={handleSubmit} className="space-y-5">
                {step === 1 && (
                  <>
                    <h3 className="font-semibold text-gray-800 mb-4">व्यक्तिगत जानकारी</h3>
                    <Select label="खाताको प्रकार *" required options={ACCOUNT_TYPES} placeholder="-- छान्नुहोस् --" value={form.accountType} onChange={set("accountType")} />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="पूरा नाम (नेपाली) *" required value={form.fullName} onChange={set("fullName")} placeholder="पूरा नाम" />
                      <Input label="Full Name (English)" value={form.fullNameEn} onChange={set("fullNameEn")} placeholder="Full Name" />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <Input label="जन्म मिति (ई.सं.)" type="date" value={form.dobAd} onChange={set("dobAd")} />
                      <Select label="लिङ्ग" options={GENDERS} placeholder="-- छान्नुहोस् --" value={form.gender} onChange={set("gender")} />
                      <Select label="वैवाहिक स्थिति" options={[{ value: "single", label: "अविवाहित" }, { value: "married", label: "विवाहित" }, { value: "widowed", label: "विधवा/विधुर" }]} placeholder="-- छान्नुहोस् --" value={form.maritalStatus} onChange={set("maritalStatus")} />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="पेशा" value={form.occupation} onChange={set("occupation")} />
                      <Input label="मासिक आय (रु.)" type="number" value={form.monthlyIncome} onChange={set("monthlyIncome")} />
                    </div>
                    <Input label="प्रारम्भिक जम्मा रकम (रु.)" type="number" value={form.initialDeposit} onChange={set("initialDeposit")} />
                  </>
                )}
                {step === 2 && (
                  <>
                    <h3 className="font-semibold text-gray-800 mb-4">सम्पर्क जानकारी</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="मोबाइल नम्बर *" required type="tel" value={form.mobile} onChange={set("mobile")} placeholder="९८xxxxxxxx" />
                      <Input label="इमेल" type="email" value={form.email} onChange={set("email")} placeholder="email@example.com" />
                    </div>
                    <Textarea label="स्थायी ठेगाना" rows={2} value={form.permanentAddress} onChange={set("permanentAddress")} placeholder="प्रदेश, जिल्ला, गाउँपालिका/नगरपालिका" />
                    <Textarea label="अस्थायी ठेगाना" rows={2} value={form.temporaryAddress} onChange={set("temporaryAddress")} placeholder="हालको बसोबास ठेगाना" />
                    <Select label="शाखा" options={[{ value: "main", label: "मुख्य शाखा" }, { value: "branch1", label: "शाखा १" }, { value: "branch2", label: "शाखा २" }]} placeholder="-- शाखा छान्नुहोस् --" value={form.branch} onChange={set("branch")} />
                  </>
                )}
                {step === 3 && (
                  <>
                    <h3 className="font-semibold text-gray-800 mb-4">परिचय विवरण</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="नागरिकता नम्बर" value={form.citizenshipNo} onChange={set("citizenshipNo")} />
                      <Input label="जारी मिति" type="date" value={form.citizenshipIssuedDate} onChange={set("citizenshipIssuedDate")} />
                    </div>
                    <Input label="जारी जिल्ला" value={form.citizenshipIssuedPlace} onChange={set("citizenshipIssuedPlace")} />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="बुवाको नाम" value={form.fatherName} onChange={set("fatherName")} />
                      <Input label="आमाको नाम" value={form.motherName} onChange={set("motherName")} />
                    </div>
                  </>
                )}
                {step === 4 && (
                  <>
                    <h3 className="font-semibold text-gray-800 mb-4">नमिनीको जानकारी</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="नमिनीको नाम" value={form.nomineeName} onChange={set("nomineeName")} />
                      <Input label="नमिनीसँगको सम्बन्ध" value={form.nomineeRelation} onChange={set("nomineeRelation")} />
                    </div>
                    <Input label="नमिनीको फोन" type="tel" value={form.nomineePhone} onChange={set("nomineePhone")} />
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                      सबै जानकारी सही छ भने "आवेदन दिनुहोस्" थिच्नुहोस्। कार्यालयले तपाईंलाई सम्पर्क गर्नेछ।
                    </div>
                  </>
                )}

                <div className="flex justify-between pt-2">
                  {step > 1 ? (
                    <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>← अघिल्लो</Button>
                  ) : <div />}
                  {step < 4 ? (
                    <Button type="button" onClick={() => setStep(step + 1)}>अर्को →</Button>
                  ) : (
                    <Button type="submit" loading={loading} size="lg">आवेदन दिनुहोस्</Button>
                  )}
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </section>
    </div>
  );
}
