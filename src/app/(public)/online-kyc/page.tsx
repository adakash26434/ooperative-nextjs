"use client";

import { useState } from "react";
import { PageBanner } from "@/components/ui/PageBanner";
import { Card, CardBody } from "@/components/ui/Card";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CheckCircle, FileText } from "lucide-react";
import { toast } from "sonner";

const GENDERS = [
  { value: "male", label: "पुरुष" },
  { value: "female", label: "महिला" },
  { value: "other", label: "अन्य" },
];

export default function OnlineKycPage() {
  const [loading, setLoading] = useState(false);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "", fullNameEn: "", dobAd: "", gender: "", maritalStatus: "",
    mobile: "", email: "", permanentAddress: "", temporaryAddress: "",
    citizenshipNo: "", citizenshipIssuedDate: "", citizenshipIssuedPlace: "",
    fatherName: "", motherName: "", occupation: "", memberId: "",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/grievance", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.fullName, phone: form.mobile, email: form.email,
          subject: "KYC अद्यावधिक अनुरोध",
          description: `सदस्य नं: ${form.memberId || "—"}\nनाम: ${form.fullName} / ${form.fullNameEn}\nजन्म मिति: ${form.dobAd}\nनागरिकता नं: ${form.citizenshipNo}\nठेगाना: ${form.permanentAddress}`,
        }),
      });
      const data = await res.json();
      if (data.trackingId) { setTrackingId(data.trackingId); toast.success("KYC आवेदन दर्ता भयो!"); }
      else toast.error(data.error || "त्रुटि भयो।");
    } catch { toast.error("सर्भर त्रुटि भयो।"); }
    finally { setLoading(false); }
  }

  if (trackingId) return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl border border-green-200 shadow-sm p-10 text-center max-w-md w-full">
        <CheckCircle className="w-16 h-16 text-[var(--brand-primary)] mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">KYC आवेदन दर्ता भयो!</h2>
        <div className="bg-green-50 border-2 border-[var(--brand-primary)] rounded-xl px-6 py-4 text-2xl font-mono font-bold text-[var(--brand-primary)] my-4">{trackingId}</div>
        <p className="text-xs text-gray-400 mb-6">कार्यालयले छिट्टै सम्पर्क गर्नेछ। यो नम्बर सुरक्षित राख्नुहोस्।</p>
        <a href="/track-application" className="inline-block bg-[var(--brand-primary)] text-white font-semibold px-6 py-3 rounded-xl">स्थिति जाँच्नुहोस्</a>
      </div>
    </div>
  );

  return (
    <div>
      <PageBanner title="अनलाइन KYC फारम" subtitle="Know Your Customer — ग्राहक परिचय फारम"
        icon={<FileText className="w-7 h-7" />}
        breadcrumbs={[{ label: "गृहपृष्ठ", href: "/" }, { label: "अनलाइन KYC" }]} />
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 mb-6">
            <strong>आवश्यक कागजात:</strong> नागरिकता प्रमाणपत्र, पासपोर्ट साइज फोटो, सदस्य परिचयपत्र (भएमा)
          </div>
          <Card>
            <CardBody>
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="font-semibold text-gray-800 text-lg border-b pb-3">व्यक्तिगत विवरण</h3>
                <Input label="सदस्य नम्बर (भएमा)" value={form.memberId} onChange={set("memberId")} placeholder="सदस्य नम्बर" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="पूरा नाम (नेपाली) *" required value={form.fullName} onChange={set("fullName")} />
                  <Input label="Full Name (English)" value={form.fullNameEn} onChange={set("fullNameEn")} />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Input label="जन्म मिति" type="date" value={form.dobAd} onChange={set("dobAd")} />
                  <Select label="लिङ्ग" options={GENDERS} placeholder="-- छान्नुहोस् --" value={form.gender} onChange={set("gender")} />
                  <Select label="वैवाहिक स्थिति" options={[{ value: "single", label: "अविवाहित" }, { value: "married", label: "विवाहित" }, { value: "widowed", label: "विधवा/विधुर" }]} placeholder="-- छान्नुहोस् --" value={form.maritalStatus} onChange={set("maritalStatus")} />
                </div>

                <h3 className="font-semibold text-gray-800 text-lg border-b pb-3 pt-2">सम्पर्क विवरण</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="मोबाइल *" required type="tel" value={form.mobile} onChange={set("mobile")} placeholder="९८xxxxxxxx" />
                  <Input label="इमेल" type="email" value={form.email} onChange={set("email")} />
                </div>
                <Textarea label="स्थायी ठेगाना" rows={2} value={form.permanentAddress} onChange={set("permanentAddress")} />
                <Textarea label="अस्थायी ठेगाना" rows={2} value={form.temporaryAddress} onChange={set("temporaryAddress")} />

                <h3 className="font-semibold text-gray-800 text-lg border-b pb-3 pt-2">परिचयपत्र विवरण</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="नागरिकता नम्बर" value={form.citizenshipNo} onChange={set("citizenshipNo")} />
                  <Input label="जारी मिति" type="date" value={form.citizenshipIssuedDate} onChange={set("citizenshipIssuedDate")} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="जारी जिल्ला" value={form.citizenshipIssuedPlace} onChange={set("citizenshipIssuedPlace")} />
                  <Input label="पेशा" value={form.occupation} onChange={set("occupation")} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="बुवाको नाम" value={form.fatherName} onChange={set("fatherName")} />
                  <Input label="आमाको नाम" value={form.motherName} onChange={set("motherName")} />
                </div>

                <Button type="submit" loading={loading} className="w-full" size="lg">KYC आवेदन पठाउनुहोस्</Button>
              </form>
            </CardBody>
          </Card>
        </div>
      </section>
    </div>
  );
}
