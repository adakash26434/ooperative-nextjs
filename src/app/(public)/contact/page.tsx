"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("सन्देश सफलतापूर्वक पठाइयो!");
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        toast.error(data.error || "त्रुटि भयो।");
      }
    } catch {
      toast.error("सर्भर त्रुटि भयो।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <section className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-light)] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-6 h-6" />
            <h1 className="text-3xl font-bold">सम्पर्क गर्नुहोस्</h1>
          </div>
          <p className="text-green-100">हामीसँग जुनसुकै समय सम्पर्क गर्न सक्नुहुन्छ।</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Info */}
            <div className="space-y-4">
              {[
                { icon: <Phone className="w-5 h-5" />, label: "फोन", value: "061-590067 / 9827157000" },
                { icon: <Mail className="w-5 h-5" />, label: "इमेल", value: "info@cooperative.com.np" },
                { icon: <MapPin className="w-5 h-5" />, label: "ठेगाना", value: "काठमाडौं, नेपाल" },
                { icon: <Clock className="w-5 h-5" />, label: "कार्यालय समय", value: "आइत–शुक्र: १०:०० – ५:००" },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-xl border border-gray-100 p-5 flex gap-4 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-[var(--brand-primary)] shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-medium">{item.label}</div>
                    <div className="text-gray-800 font-medium">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">सन्देश पठाउनुहोस्</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">नाम *</label>
                    <input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                      value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="तपाईंको नाम" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">फोन</label>
                    <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                      value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="फोन नम्बर" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">इमेल</label>
                  <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">विषय</label>
                  <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                    value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="सन्देशको विषय" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">सन्देश *</label>
                  <textarea required rows={5} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent resize-none"
                    value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="तपाईंको सन्देश..." />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                  <Send className="w-4 h-4" />
                  {loading ? "पठाउँदैछ..." : "सन्देश पठाउनुहोस्"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
