"use client";

import { useState } from "react";
import { Search, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  pending:  { label: "विचाराधीन", icon: <Clock className="w-5 h-5" />, color: "text-amber-600 bg-amber-50 border-amber-200" },
  approved: { label: "स्वीकृत",   icon: <CheckCircle className="w-5 h-5" />, color: "text-green-600 bg-green-50 border-green-200" },
  rejected: { label: "अस्वीकृत", icon: <XCircle className="w-5 h-5" />, color: "text-red-600 bg-red-50 border-red-200" },
  in_review:{ label: "समीक्षामा", icon: <AlertCircle className="w-5 h-5" />, color: "text-blue-600 bg-blue-50 border-blue-200" },
};

export default function TrackApplicationPage() {
  const [trackingId, setTrackingId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!trackingId.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch(`/api/track?id=${encodeURIComponent(trackingId.trim())}`);
      const data = await res.json();
      if (res.ok) setResult(data);
      else setError(data.error || "फेला परेन।");
    } catch {
      setError("सर्भर त्रुटि भयो।");
    } finally {
      setLoading(false);
    }
  }

  const statusInfo = result ? (STATUS_CONFIG[result.status] ?? { label: result.status, icon: <Clock className="w-5 h-5" />, color: "text-gray-600 bg-gray-50 border-gray-200" }) : null;

  return (
    <div>
      <section className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-light)] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Search className="w-6 h-6" />
            <h1 className="text-3xl font-bold">आवेदन ट्र्याक</h1>
          </div>
          <p className="text-green-100">आफ्नो आवेदनको स्थिति जाँच्नुहोस्</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-xl">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <form onSubmit={handleSearch} className="flex gap-3">
              <input
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent font-mono uppercase"
                placeholder="ट्र्याकिङ आईडी (जस्तै: LN260511xxxx)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
              />
              <button type="submit" disabled={loading}
                className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] text-white px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-60 flex items-center gap-2">
                <Search className="w-4 h-4" />
                {loading ? "खोज्दैछ..." : "खोज्नुहोस्"}
              </button>
            </form>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{error}</div>
            )}

            {result && statusInfo && (
              <div className="mt-6 space-y-4">
                <div className={`flex items-center gap-3 border rounded-xl px-5 py-4 ${statusInfo.color}`}>
                  {statusInfo.icon}
                  <div>
                    <div className="text-xs font-medium opacity-70">आवेदनको स्थिति</div>
                    <div className="font-bold text-lg">{statusInfo.label}</div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">ट्र्याकिङ आईडी</span>
                    <span className="font-mono font-bold">{result.trackingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">प्रकार</span>
                    <span className="font-medium capitalize">{result.type === "loan" ? "ऋण आवेदन" : result.type === "kyc" ? "KYC" : "शिकायत"}</span>
                  </div>
                  {result.loanType && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">ऋणको प्रकार</span>
                      <span className="font-medium">{result.loanType}</span>
                    </div>
                  )}
                  {result.subject && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">विषय</span>
                      <span className="font-medium">{result.subject}</span>
                    </div>
                  )}
                  {result.remarks && (
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-gray-500 mb-1">कार्यालयको टिप्पणी</div>
                      <div className="text-gray-800">{result.remarks}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
