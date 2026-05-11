"use client";

import { useEffect, useState } from "react";
import { PageBanner } from "@/components/ui/PageBanner";
import { TrendingUp, RefreshCw } from "lucide-react";

const CURRENCIES = [
  { code: "USD", flag: "🇺🇸", name: "अमेरिकी डलर" },
  { code: "EUR", flag: "🇪🇺", name: "युरो" },
  { code: "GBP", flag: "🇬🇧", name: "बेलायती पाउन्ड" },
  { code: "AUD", flag: "🇦🇺", name: "अष्ट्रेलियन डलर" },
  { code: "CAD", flag: "🇨🇦", name: "क्यानडियन डलर" },
  { code: "SGD", flag: "🇸🇬", name: "सिंगापुर डलर" },
  { code: "JPY", flag: "🇯🇵", name: "जापानी येन" },
  { code: "CHF", flag: "🇨🇭", name: "स्विस फ्र्याङ्क" },
  { code: "CNY", flag: "🇨🇳", name: "चिनियाँ युआन" },
  { code: "INR", flag: "🇮🇳", name: "भारतीय रुपैयाँ" },
  { code: "QAR", flag: "🇶🇦", name: "कतारी रियाल" },
  { code: "SAR", flag: "🇸🇦", name: "साउदी रियाल" },
  { code: "AED", flag: "🇦🇪", name: "यूएई दिरहाम" },
  { code: "KWD", flag: "🇰🇼", name: "कुवेती दिनार" },
  { code: "MYR", flag: "🇲🇾", name: "मलेसियन रिङ्गिट" },
  { code: "KRW", flag: "🇰🇷", name: "दक्षिण कोरियाली वन" },
];

interface Rate { code: string; buy: number; sell: number; }

export default function ExchangeRatePage() {
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState("");

  async function fetchRates() {
    setLoading(true);
    try {
      const res = await fetch("https://www.nrb.org.np/api/forex/v1/rates?page=1&per_page=20&from=&to=", { cache: "no-store" });
      const data = await res.json();
      const payload = data?.data?.payload?.[0];
      if (payload) {
        setUpdated(payload.date || "");
        const parsed: Rate[] = (payload.rates || [])
          .filter((r: any) => CURRENCIES.some(c => c.code === r.currency?.iso3))
          .map((r: any) => ({ code: r.currency.iso3, buy: parseFloat(r.buy), sell: parseFloat(r.sell) }));
        setRates(parsed);
      }
    } catch {
      setRates([]);
    } finally { setLoading(false); }
  }

  useEffect(() => { fetchRates(); }, []);

  return (
    <div>
      <PageBanner title="विनिमय दर" subtitle="नेपाल राष्ट्र बैंकको आधिकारिक विदेशी मुद्रा विनिमय दर"
        icon={<TrendingUp className="w-7 h-7" />}
        breadcrumbs={[{ label: "गृहपृष्ठ", href: "/" }, { label: "विनिमय दर" }]} />
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            {updated && <p className="text-sm text-gray-500">अद्यावधिक: {updated}</p>}
            <button onClick={fetchRates} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> ताजा गर्नुहोस्
            </button>
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-400">
              <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin" />
              <p>लोड हुँदैछ...</p>
            </div>
          ) : rates.length === 0 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center text-amber-800">
              <p>विनिमय दर लोड गर्न सकिएन। NRB API अनुपलब्ध हुन सक्छ।</p>
              <a href="https://www.nrb.org.np/forex/" target="_blank" rel="noopener noreferrer"
                className="inline-block mt-3 text-sm text-[var(--brand-primary)] underline">
                NRB वेबसाइटमा हेर्नुहोस् →
              </a>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">मुद्रा</th>
                    <th className="text-left px-4 py-3 font-semibold">नाम</th>
                    <th className="text-right px-4 py-3 font-semibold">खरिद (रु.)</th>
                    <th className="text-right px-4 py-3 font-semibold">बिक्री (रु.)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rates.map((rate) => {
                    const curr = CURRENCIES.find(c => c.code === rate.code);
                    return (
                      <tr key={rate.code} className="hover:bg-green-50 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-gray-800">
                          <span className="mr-2">{curr?.flag}</span>{rate.code}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{curr?.name || rate.code}</td>
                        <td className="px-4 py-3 text-right text-green-700 font-semibold">{rate.buy.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-red-600 font-semibold">{rate.sell.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <p className="text-xs text-gray-400 mt-4 text-center">स्रोत: नेपाल राष्ट्र बैंक (NRB) • यो दर सूचनामूलक मात्र हो।</p>
        </div>
      </section>
    </div>
  );
}
