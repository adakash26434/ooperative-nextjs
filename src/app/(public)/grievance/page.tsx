"use client";

import { useState } from "react";
import { MessageSquare, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function GrievancePage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [trackingId, setTrackingId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/grievance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.trackingId) {
        setTrackingId(data.trackingId);
        toast.success("शिकायत दर्ता भयो!");
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">शिकायत दर्ता भयो!</h2>
          <p className="text-gray-500 mb-4">तपाईंको ट्र्याकिङ आईडी:</p>
          <div className="bg-green-50 border-2 border-[var(--brand-primary)] rounded-xl px-6 py-4 text-2xl font-mono font-bold text-[var(--brand-primary)] mb-6">{trackingId}</div>
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
          <div className="flex items-center gap-3 mb-2"><MessageSquare className="w-6 h-6" /><h1 className="text-3xl font-bold">शिकायत / गुनासो</h1></div>
          <p className="text-green-100">तपाईंको गुनासो हाम्रोलागि महत्त्वपूर्ण छ।</p>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">शिकायत दर्ता फारम</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">नाम *</label>
                  <input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">फोन</label>
                  <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                    value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">विषय *</label>
                <input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                  value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">विवरण *</label>
                <textarea required rows={5} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent resize-none"
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60">
                {loading ? "पठाउँदैछ..." : "शिकायत दर्ता गर्नुहोस्"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
