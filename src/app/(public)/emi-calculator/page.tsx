"use client";

import { useState, useCallback } from "react";
import { PageBanner } from "@/components/ui/PageBanner";
import { Card, CardBody } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Calculator, Printer } from "lucide-react";

const LOAN_TYPES = [
  { value: "11", label: "घर कर्जा (११%)" },
  { value: "14", label: "व्यापार कर्जा (१४%)" },
  { value: "16", label: "व्यक्तिगत कर्जा (१६%)" },
  { value: "10", label: "शिक्षा कर्जा (१०%)" },
  { value: "13", label: "सवारी कर्जा (१३%)" },
  { value: "9",  label: "कृषि कर्जा (९%)" },
  { value: "custom", label: "आफ्नै दर राख्ने" },
];

interface Schedule { month: number; emi: number; principal: number; interest: number; balance: number }

export default function EmiCalculatorPage() {
  const [principal, setPrincipal] = useState("500000");
  const [loanTypeRate, setLoanTypeRate] = useState("12");
  const [customRate, setCustomRate] = useState("12");
  const [isCustom, setIsCustom] = useState(false);
  const [tenure, setTenure] = useState("60");
  const [result, setResult] = useState<{ emi: number; totalInterest: number; totalPayment: number; schedule: Schedule[] } | null>(null);

  const calculate = useCallback(() => {
    const P = parseFloat(principal);
    const annualRate = parseFloat(isCustom ? customRate : loanTypeRate);
    const n = parseInt(tenure);
    if (!P || !annualRate || !n) return;

    const r = annualRate / 100 / 12;
    const emi = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    let balance = P;
    const schedule: Schedule[] = [];
    for (let i = 1; i <= n; i++) {
      const interest = balance * r;
      const principalPaid = emi - interest;
      balance -= principalPaid;
      schedule.push({ month: i, emi, principal: principalPaid, interest, balance: Math.max(0, balance) });
    }
    setResult({ emi, totalInterest, totalPayment, schedule });
  }, [principal, loanTypeRate, customRate, isCustom, tenure]);

  const fmt = (n: number) => "रु. " + Math.round(n).toLocaleString("en-IN");

  return (
    <div>
      <PageBanner
        title="EMI ऋण क्याल्कुलेटर"
        subtitle="मासिक किस्ता र ब्याज तुरुन्त गणना गर्नुहोस्"
        icon={<Calculator className="w-7 h-7" />}
        breadcrumbs={[{ label: "गृहपृष्ठ", href: "/" }, { label: "EMI क्याल्कुलेटर" }]}
      />
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input */}
            <Card>
              <CardBody className="space-y-5">
                <h2 className="font-bold text-gray-900 text-lg">ऋणको विवरण भर्नुहोस्</h2>
                <Input label="ऋण रकम (रु.) *" type="number" min="1000"
                  value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="जस्तै: 500000" />
                <Select label="ऋणको प्रकार" options={LOAN_TYPES} placeholder=""
                  value={isCustom ? "custom" : loanTypeRate}
                  onChange={(e) => { if (e.target.value === "custom") { setIsCustom(true); } else { setIsCustom(false); setLoanTypeRate(e.target.value); } }} />
                {isCustom && (
                  <Input label="वार्षिक ब्याज दर (%)" type="number" step="0.1" min="1" max="50"
                    value={customRate} onChange={(e) => setCustomRate(e.target.value)} placeholder="जस्तै: 12" />
                )}
                <Select label="अवधि (महिना)" options={[
                  { value: "12", label: "१२ महिना (१ वर्ष)" },
                  { value: "24", label: "२४ महिना (२ वर्ष)" },
                  { value: "36", label: "३६ महिना (३ वर्ष)" },
                  { value: "48", label: "४८ महिना (४ वर्ष)" },
                  { value: "60", label: "६० महिना (५ वर्ष)" },
                  { value: "84", label: "८४ महिना (७ वर्ष)" },
                  { value: "120", label: "१२० महिना (१० वर्ष)" },
                  { value: "180", label: "१८० महिना (१५ वर्ष)" },
                  { value: "240", label: "२४० महिना (२० वर्ष)" },
                ]} placeholder="" value={tenure} onChange={(e) => setTenure(e.target.value)} />
                <Button className="w-full" size="lg" leftIcon={<Calculator className="w-5 h-5" />} onClick={calculate}>
                  EMI गणना गर्नुहोस्
                </Button>
              </CardBody>
            </Card>

            {/* Result */}
            {result ? (
              <div className="space-y-4">
                <Card>
                  <CardBody>
                    <div className="text-center mb-5 pb-5 border-b border-gray-100">
                      <div className="text-xs text-gray-400 mb-1">मासिक EMI</div>
                      <div className="text-4xl font-bold text-[var(--brand-primary)]">{fmt(result.emi)}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-blue-50 rounded-xl p-4">
                        <div className="text-xs text-gray-500 mb-1">कुल ब्याज</div>
                        <div className="font-bold text-blue-700">{fmt(result.totalInterest)}</div>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4">
                        <div className="text-xs text-gray-500 mb-1">कुल भुक्तानी</div>
                        <div className="font-bold text-[var(--brand-primary)]">{fmt(result.totalPayment)}</div>
                      </div>
                    </div>
                    {/* Visual bar */}
                    <div className="mt-4">
                      <div className="text-xs text-gray-500 mb-1.5 flex justify-between">
                        <span>मूलधन</span><span>ब्याज</span>
                      </div>
                      <div className="h-3 rounded-full bg-gray-100 overflow-hidden flex">
                        <div className="bg-[var(--brand-primary)] h-full transition-all"
                          style={{ width: `${(parseFloat(principal) / result.totalPayment) * 100}%` }} />
                        <div className="bg-blue-400 h-full flex-1" />
                      </div>
                    </div>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody className="p-0">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-800">भुक्तानी तालिका</h3>
                      <button onClick={() => window.print()} className="flex items-center gap-1 text-xs text-gray-500 hover:text-[var(--brand-primary)]">
                        <Printer className="w-4 h-4" /> Print
                      </button>
                    </div>
                    <div className="overflow-x-auto max-h-64">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            {["महिना", "EMI", "मूलधन", "ब्याज", "बाँकी"].map((h) => (
                              <th key={h} className="px-3 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {result.schedule.map((row) => (
                            <tr key={row.month} className="hover:bg-gray-50">
                              <td className="px-3 py-1.5">{row.month}</td>
                              <td className="px-3 py-1.5 font-medium">{fmt(row.emi)}</td>
                              <td className="px-3 py-1.5 text-[var(--brand-primary)]">{fmt(row.principal)}</td>
                              <td className="px-3 py-1.5 text-blue-600">{fmt(row.interest)}</td>
                              <td className="px-3 py-1.5 text-gray-500">{fmt(row.balance)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>
              </div>
            ) : (
              <Card>
                <CardBody className="flex flex-col items-center justify-center py-16 text-center">
                  <Calculator className="w-16 h-16 text-gray-200 mb-4" />
                  <p className="text-gray-400 font-medium">ऋणको विवरण भरेर</p>
                  <p className="text-gray-400 text-sm">"EMI गणना गर्नुहोस्" थिच्नुहोस्</p>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
