"use client";

import { useState } from "react";
import { ShieldCheck, Search, CheckCircle, XCircle } from "lucide-react";
import { PageBanner } from "@/components/ui/PageBanner";

type VerifyResult = {
  found: boolean;
  name?: string;
  sadasyataNumber?: string;
  memberCardNo?: string;
  approvalStatus?: string;
  phone?: string;
};

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState("");

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch(`/api/member/verify?code=${encodeURIComponent(code.trim())}&cvv=${encodeURIComponent(cvv.trim())}`);
      const data = await res.json();
      if (res.ok) setResult(data);
      else setError(data.error || "सदस्य फेला परेन।");
    } catch { setError("सर्भर त्रुटि भयो।"); }
    finally { setLoading(false); }
  }

  return (
    <div>
      <PageBanner
        title="सदस्य परिचय पत्र प्रमाणीकरण"
        subtitle="ID Card को Verification Code प्रविष्ट गरेर सदस्यता प्रमाणित गर्नुहोस्"
        icon={<ShieldCheck className="w-7 h-7" />}
        breadcrumbs={[{ label: "गृहपृष्ठ", href: "/" }, { label: "सदस्य प्रमाणीकरण" }]}
      />

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-lg">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <p className="text-sm text-gray-500 mb-6 text-center">
              सदस्यले देखाएको ID Card मा भएको Verification Code र CVV प्रविष्ट गर्नुहोस्।
            </p>
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Verification Code *</label>
                <input
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  placeholder="जस्तै: AKS-XXXX-XXXX"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">CVV (४ अंक)</label>
                <input
                  maxLength={4}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  placeholder="••••"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/, ""))}
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-60">
                <Search className="w-4 h-4" />
                {loading ? "खोज्दैछ..." : "प्रमाणित गर्नुहोस्"}
              </button>
            </form>

            {error && (
              <div className="mt-5 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
                <XCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {result && (
              <div className="mt-5">
                {result.found ? (
                  <div className="bg-green-50 border-2 border-[var(--brand-primary)] rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="w-8 h-8 text-[var(--brand-primary)]" />
                      <div>
                        <div className="font-bold text-green-800">सक्रिय सदस्य ✓</div>
                        <div className="text-xs text-green-600">यो परिचयपत्र वैध छ</div>
                      </div>
                    </div>
                    <dl className="space-y-2 text-sm">
                      {[
                        { label: "नाम", value: result.name },
                        { label: "सदस्यता नं.", value: result.sadasyataNumber },
                        { label: "कार्ड नं.", value: result.memberCardNo },
                        { label: "स्थिति", value: result.approvalStatus === "approved" ? "स्वीकृत ✓" : result.approvalStatus },
                      ].map((item) => item.value && (
                        <div key={item.label} className="flex justify-between border-b border-green-100 pb-1">
                          <dt className="text-gray-500">{item.label}</dt>
                          <dd className="font-semibold text-gray-800">{item.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
                    <XCircle className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-medium">यो परिचयपत्र वैध छैन वा सदस्य सक्रिय छैन।</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
