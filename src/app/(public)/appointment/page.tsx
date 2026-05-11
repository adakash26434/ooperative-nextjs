"use client";

import { useState } from "react";
import { PageBanner } from "@/components/ui/PageBanner";
import { Card, CardBody } from "@/components/ui/Card";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CheckCircle, CalendarDays } from "lucide-react";
import { toast } from "sonner";

const PURPOSES = [
  { value: "account_inquiry",  label: "खाता सम्बन्धी जानकारी" },
  { value: "loan_inquiry",     label: "ऋण सम्बन्धी जानकारी" },
  { value: "kyc_update",       label: "KYC अद्यावधिक" },
  { value: "loan_repayment",   label: "ऋण भुक्तानी" },
  { value: "account_opening",  label: "नयाँ खाता खोल्ने" },
  { value: "other",            label: "अन्य" },
];

const TIME_SLOTS = [
  { value: "10:00", label: "बिहान १०:०० बजे" },
  { value: "11:00", label: "बिहान ११:०० बजे" },
  { value: "12:00", label: "दिउँसो १२:०० बजे" },
  { value: "14:00", label: "दिउँसो २:०० बजे" },
  { value: "15:00", label: "दिउँसो ३:०० बजे" },
  { value: "16:00", label: "साँझ ४:०० बजे" },
];

export default function AppointmentPage() {
  const [loading, setLoading] = useState(false);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", memberId: "",
    purpose: "", purposeDetail: "", preferredDate: "", preferredTime: "", branch: "",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/appointment", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.trackingId) { setTrackingId(data.trackingId); toast.success("भेटघाट बुकिङ सफल भयो!"); }
      else toast.error(data.error || "त्रुटि भयो।");
    } catch { toast.error("सर्भर त्रुटि भयो।"); }
    finally { setLoading(false); }
  }

  if (trackingId) return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl border border-green-200 shadow-sm p-10 text-center max-w-md w-full">
        <CheckCircle className="w-16 h-16 text-[var(--brand-primary)] mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">भेटघाट बुकिङ सफल!</h2>
        <p className="text-gray-500 mb-3 text-sm">तपाईंको बुकिङ ट्र्याकिङ आईडी:</p>
        <div className="bg-green-50 border-2 border-[var(--brand-primary)] rounded-xl px-6 py-4 text-2xl font-mono font-bold text-[var(--brand-primary)] mb-4">{trackingId}</div>
        <p className="text-xs text-gray-400 mb-6">कार्यालयले confirm गर्नेछ। यो नम्बर सुरक्षित राख्नुहोस्।</p>
        <a href="/" className="inline-block bg-[var(--brand-primary)] text-white font-semibold px-6 py-3 rounded-xl">गृहपृष्ठमा जानुहोस्</a>
      </div>
    </div>
  );

  return (
    <div>
      <PageBanner title="भेटघाट बुक गर्नुहोस्" subtitle="कार्यालय भेटको लागि समय बुक गर्नुहोस्"
        icon={<CalendarDays className="w-7 h-7" />}
        breadcrumbs={[{ label: "गृहपृष्ठ", href: "/" }, { label: "भेटघाट बुकिङ" }]} />
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardBody>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="नाम *" required value={form.name} onChange={set("name")} placeholder="तपाईंको नाम" />
                  <Input label="फोन नम्बर *" required type="tel" value={form.phone} onChange={set("phone")} placeholder="९८xxxxxxxx" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="इमेल" type="email" value={form.email} onChange={set("email")} />
                  <Input label="सदस्य नम्बर (भएमा)" value={form.memberId} onChange={set("memberId")} />
                </div>
                <Select label="भेटको उद्देश्य *" required options={PURPOSES} placeholder="-- उद्देश्य छान्नुहोस् --" value={form.purpose} onChange={set("purpose")} />
                <Textarea label="थप विवरण" rows={3} value={form.purposeDetail} onChange={set("purposeDetail")} placeholder="कुनै थप जानकारी..." />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="मनपर्ने मिति *" required type="date" value={form.preferredDate} onChange={set("preferredDate")} min={new Date().toISOString().split("T")[0]} />
                  <Select label="मनपर्ने समय" options={TIME_SLOTS} placeholder="-- समय छान्नुहोस् --" value={form.preferredTime} onChange={set("preferredTime")} />
                </div>
                <Select label="शाखा" options={[{ value: "main", label: "मुख्य शाखा" }, { value: "branch1", label: "शाखा १" }, { value: "branch2", label: "शाखा २" }]} placeholder="-- शाखा छान्नुहोस् --" value={form.branch} onChange={set("branch")} />
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                  बुकिङ confirm हुनका लागि कार्यालयले फोन वा SMS पठाउनेछ।
                </div>
                <Button type="submit" loading={loading} className="w-full" size="lg">भेटघाट बुक गर्नुहोस्</Button>
              </form>
            </CardBody>
          </Card>
        </div>
      </section>
    </div>
  );
}
