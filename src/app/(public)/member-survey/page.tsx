"use client";

import { useState } from "react";
import { PageBanner } from "@/components/ui/PageBanner";
import { ClipboardList, CheckCircle } from "lucide-react";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

const SATISFACTION = [
  { value: "5", label: "⭐⭐⭐⭐⭐ — अत्यन्त सन्तुष्ट" },
  { value: "4", label: "⭐⭐⭐⭐ — सन्तुष्ट" },
  { value: "3", label: "⭐⭐⭐ — ठीकै छ" },
  { value: "2", label: "⭐⭐ — असन्तुष्ट" },
  { value: "1", label: "⭐ — अत्यन्त असन्तुष्ट" },
];

export default function MemberSurveyPage() {
  const [form, setForm] = useState({ name: "", phone: "", memberId: "", satisfaction: "", suggestion: "", complaint: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSubmitting(true);
    try {
      const res = await fetch("/api/member-survey", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          memberId: form.memberId,
          satisfaction: Number(form.satisfaction),
          suggestion: form.suggestion,
          complaint: form.complaint,
        }),
      });
      const data = await res.json();
      if (res.ok) { setDone(true); toast.success("सर्वेक्षण पठाइयो!"); }
      else toast.error(data.error || "त्रुटि भयो।");
    } catch { toast.error("सर्भर त्रुटि।"); }
    finally { setSubmitting(false); }
  }

  return (
    <div>
      <PageBanner title="सदस्य सुझाव तथा प्रतिक्रिया" subtitle="तपाईंको प्रतिक्रियाले हामीलाई सुधार गर्न मद्दत गर्छ"
        icon={<ClipboardList className="w-7 h-7" />}
        breadcrumbs={[{ label: "गृहपृष्ठ", href: "/" }, { label: "सदस्य सर्वेक्षण" }]} />

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-xl">
          {done ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-[var(--brand-primary)] mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">धन्यवाद!</h2>
              <p className="text-gray-500">तपाईंको बहुमूल्य सुझावको लागि हार्दिक धन्यवाद।</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="नाम *" required value={form.name} onChange={(e) => set("name", e.target.value)} />
                  <Input label="फोन *" required value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                </div>
                <Input label="सदस्यता नं. (वैकल्पिक)" value={form.memberId} onChange={(e) => set("memberId", e.target.value)} />
                <Select label="सेवाप्रति सन्तुष्टि *" required options={SATISFACTION} placeholder="-- छान्नुहोस् --"
                  value={form.satisfaction} onChange={(e) => set("satisfaction", e.target.value)} />
                <Textarea label="सुझाव / प्रतिक्रिया" rows={3} placeholder="सेवा सुधारका लागि सुझाव..."
                  value={form.suggestion} onChange={(e) => set("suggestion", e.target.value)} />
                <Textarea label="गुनासो (वैकल्पिक)" rows={2} placeholder="कुनै समस्या वा गुनासो..."
                  value={form.complaint} onChange={(e) => set("complaint", e.target.value)} />
                <Button type="submit" loading={submitting} className="w-full" size="lg">पठाउनुहोस्</Button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
