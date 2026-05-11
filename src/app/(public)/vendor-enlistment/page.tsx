"use client";

import { useState } from "react";
import { PageBanner } from "@/components/ui/PageBanner";
import { Briefcase, CheckCircle } from "lucide-react";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

const BUSINESS_TYPES = [
  { value: "construction", label: "निर्माण" },
  { value: "supply", label: "आपूर्ति" },
  { value: "services", label: "सेवा" },
  { value: "it", label: "सूचना प्रविधि" },
  { value: "printing", label: "मुद्रण" },
  { value: "other", label: "अन्य" },
];

export default function VendorEnlistmentPage() {
  const [form, setForm] = useState({ companyName: "", ownerName: "", phone: "", email: "", address: "", panNo: "", businessType: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [trackingId, setTrackingId] = useState("");

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.ownerName,
          email: form.email || "noreply@vendor.com",
          phone: form.phone,
          subject: `भेन्डर सूचीकरण — ${form.companyName}`,
          message: `व्यवसाय: ${form.businessType}\nPAN: ${form.panNo}\nठेगाना: ${form.address}\n${form.description}`,
        }),
      });
      const data = await res.json();
      if (res.ok) { setTrackingId("VND" + Date.now().toString().slice(-6)); toast.success("आवेदन दर्ता भयो!"); }
      else toast.error(data.error || "त्रुटि भयो।");
    } catch { toast.error("सर्भर त्रुटि।"); }
    finally { setSubmitting(false); }
  }

  if (trackingId) {
    return (
      <div>
        <PageBanner title="भेन्डर सूचीकरण" subtitle="" icon={<Briefcase className="w-7 h-7" />}
          breadcrumbs={[{ label: "गृहपृष्ठ", href: "/" }, { label: "भेन्डर सूचीकरण" }]} />
        <div className="container mx-auto px-4 max-w-lg py-16 text-center">
          <CheckCircle className="w-16 h-16 text-[var(--brand-primary)] mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">आवेदन दर्ता भयो!</h2>
          <p className="text-gray-500 mb-3">तपाईंको भेन्डर सूचीकरण आवेदन प्राप्त भयो।</p>
          <div className="bg-green-50 border-2 border-[var(--brand-primary)] rounded-xl px-6 py-3 inline-block font-mono font-bold text-[var(--brand-primary)] text-xl mb-4">{trackingId}</div>
          <p className="text-xs text-gray-400">यो नम्बर सुरक्षित राख्नुहोस्।</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBanner title="भेन्डर / आपूर्तिकर्ता सूचीकरण" subtitle="संस्थाको आपूर्तिकर्ता सूचीमा दर्ता हुनुहोस्"
        icon={<Briefcase className="w-7 h-7" />}
        breadcrumbs={[{ label: "गृहपृष्ठ", href: "/" }, { label: "भेन्डर सूचीकरण" }]} />

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 mb-6">
            संस्थाको स्वीकृत आपूर्तिकर्ता सूचीमा सामेल हुन तलको फारम भर्नुहोस्। समीक्षापछि सम्पर्क गरिनेछ।
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="कम्पनी / संस्थाको नाम *" required value={form.companyName} onChange={(e) => set("companyName", e.target.value)} />
                <Input label="मालिकको नाम *" required value={form.ownerName} onChange={(e) => set("ownerName", e.target.value)} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="फोन *" required value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                <Input label="इमेल" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="ठेगाना *" required value={form.address} onChange={(e) => set("address", e.target.value)} />
                <Input label="PAN नम्बर" value={form.panNo} onChange={(e) => set("panNo", e.target.value)} />
              </div>
              <Select label="व्यवसायको प्रकार *" required options={BUSINESS_TYPES} placeholder="-- छान्नुहोस् --"
                value={form.businessType} onChange={(e) => set("businessType", e.target.value)} />
              <Textarea label="व्यवसायको विवरण" rows={3} value={form.description} onChange={(e) => set("description", e.target.value)}
                placeholder="प्रमुख सेवाहरू, अनुभव, आदि..." />
              <Button type="submit" loading={submitting} className="w-full" size="lg">आवेदन पठाउनुहोस्</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
