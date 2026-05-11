"use client";

import { useState } from "react";
import { PageBanner } from "@/components/ui/PageBanner";
import { Heart, CheckCircle } from "lucide-react";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

const CLAIM_TYPES = [
  { value: "maternity", label: "सुत्केरी सहायता" },
  { value: "death", label: "मृत्यु सहायता" },
  { value: "insurance", label: "बीमा दाबी" },
  { value: "medical", label: "उपचार सहायता" },
  { value: "other", label: "अन्य कल्याण दाबी" },
];

export default function MemberWelfarePage() {
  const [form, setForm] = useState({ name: "", phone: "", memberId: "", claimType: "", description: "", bankAccount: "" });
  const [submitting, setSubmitting] = useState(false);
  const [trackingId, setTrackingId] = useState("");

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSubmitting(true);
    try {
      const res = await fetch("/api/grievance", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          subject: `कल्याण दाबी — ${form.claimType}`,
          description: `सदस्यता नं.: ${form.memberId}\nखाता नं.: ${form.bankAccount || "—"}\nविवरण: ${form.description}`,
        }),
      });
      const data = await res.json();
      if (data.trackingId) { setTrackingId(data.trackingId); toast.success("दाबी दर्ता भयो!"); }
      else toast.error(data.error || "त्रुटि भयो।");
    } catch { toast.error("सर्भर त्रुटि।"); }
    finally { setSubmitting(false); }
  }

  return (
    <div>
      <PageBanner title="सदस्य कल्याण दाबी" subtitle="सुत्केरी, मृत्यु, बीमा तथा उपचार सहायताका लागि आवेदन"
        icon={<Heart className="w-7 h-7" />}
        breadcrumbs={[{ label: "गृहपृष्ठ", href: "/" }, { label: "सदस्य कल्याण" }]} />

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-xl">
          {trackingId ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-[var(--brand-primary)] mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">दाबी दर्ता भयो!</h2>
              <p className="text-gray-500 mb-3">ट्र्याकिङ आईडी:</p>
              <div className="bg-green-50 border-2 border-[var(--brand-primary)] rounded-xl px-6 py-3 inline-block font-mono font-bold text-[var(--brand-primary)] text-xl mb-4">{trackingId}</div>
              <p className="text-xs text-gray-400">कार्यालयले समीक्षापछि सम्पर्क गर्नेछ।</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-5">
                दाबी गर्नु अघि सम्बन्धित कागजातहरू (मृत्युदर्ता, अस्पताल बिल, आदि) तयार राख्नुहोस्।
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="पूरा नाम *" required value={form.name} onChange={(e) => set("name", e.target.value)} />
                  <Input label="फोन *" required value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="सदस्यता नं. *" required value={form.memberId} onChange={(e) => set("memberId", e.target.value)} />
                  <Input label="बैंक खाता नं." value={form.bankAccount} onChange={(e) => set("bankAccount", e.target.value)} />
                </div>
                <Select label="दाबीको प्रकार *" required options={CLAIM_TYPES} placeholder="-- छान्नुहोस् --"
                  value={form.claimType} onChange={(e) => set("claimType", e.target.value)} />
                <Textarea label="विस्तृत विवरण *" required rows={4}
                  placeholder="दाबीको कारण र परिस्थिति विस्तृतमा लेख्नुहोस्..."
                  value={form.description} onChange={(e) => set("description", e.target.value)} />
                <Button type="submit" loading={submitting} className="w-full" size="lg">दाबी पठाउनुहोस्</Button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
