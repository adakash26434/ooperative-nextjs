"use client";

import { useState } from "react";
import { CreditCard, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const LOAN_TYPES = [
  "व्यक्तिगत ऋण", "व्यवसायिक ऋण", "शैक्षिक ऋण",
  "घर कर्जा", "सवारी साधन ऋण", "कृषि ऋण", "अन्य",
];

export default function LoanApplyPage() {
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", loanType: "", loanAmount: "", loanPurpose: "" });
  const [loading, setLoading] = useState(false);
  const [trackingId, setTrackingId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/loan-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, loanAmount: parseFloat(form.loanAmount) }),
      });
      const data = await res.json();
      if (data.trackingId) {
        setTrackingId(data.trackingId);
        toast.success("आवेदन सफलतापूर्वक दर्ता भयो!");
      } else {
        toast.error(data.error || "त्रुटि भयो।");
      }
    } catch {
      toast.error("सर्भर त्रुटि भयो।");
    } finally {
      setLoading(false);
    }
  }

  if (trackingId) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl border border-green-200 shadow-sm p-10 text-center max-w-md w-full">
          <CheckCircle className="w-16 h-16 text-[var(--brand-primary)] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">आवेदन दर्ता भयो!</h2>
          <p className="text-gray-500 mb-6">तपाईंको ट्र्याकिङ आईडी:</p>
          <div className="bg-green-50 border-2 border-[var(--brand-primary)] rounded-xl px-6 py-4 text-2xl font-mono font-bold text-[var(--brand-primary)] mb-6">
            {trackingId}
          </div>
          <p className="text-sm text-gray-500 mb-6">यो आईडी सुरक्षित राख्नुहोस्। आवेदनको स्थिति जाँच्न प्रयोग गर्नुहोस्।</p>
          <a href="/track-application" className="inline-block bg-[var(--brand-primary)] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[var(--brand-primary-dark)] transition-colors">
            स्थिति जाँच्नुहोस्
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-light)] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-6 h-6" />
            <h1 className="text-3xl font-bold">ऋण आवेदन</h1>
          </div>
          <p className="text-green-100">सजिलो र छिटो ऋण आवेदन प्रक्रिया</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">ऋण आवेदन फारम</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">पूरा नाम *</label>
                  <input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                    value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="पूरा नाम" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">फोन नम्बर *</label>
                  <input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                    value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="९८xxxxxxxx" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">इमेल</label>
                <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ऋणको प्रकार *</label>
                <select required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent bg-white"
                  value={form.loanType} onChange={(e) => setForm({ ...form, loanType: e.target.value })}>
                  <option value="">-- ऋणको प्रकार छान्नुहोस् --</option>
                  {LOAN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ऋण रकम (रु.) *</label>
                <input required type="number" min="1000" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                  value={form.loanAmount} onChange={(e) => setForm({ ...form, loanAmount: e.target.value })} placeholder="जस्तै: 100000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ऋणको उद्देश्य</label>
                <textarea rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent resize-none"
                  value={form.loanPurpose} onChange={(e) => setForm({ ...form, loanPurpose: e.target.value })} placeholder="ऋण किन लिन चाहनुहुन्छ?" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60">
                {loading ? "आवेदन पठाउँदैछ..." : "आवेदन दिनुहोस्"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
