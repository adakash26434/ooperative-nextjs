"use client";

import { useState } from "react";
import { PageBanner } from "@/components/ui/PageBanner";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar, ArrowLeftRight } from "lucide-react";

// BS to AD conversion data (simplified - key years)
// Full NepaliDate algorithm
const BS_MONTH_DAYS: number[][] = [
  [],
  [30,32,31,32,31,30,30,30,29,30,29,31], // 2000
  [31,31,32,31,31,31,30,29,30,29,30,30], // 2001
  [31,31,32,32,31,30,30,29,30,29,30,30], // 2002
  [31,32,31,32,31,30,30,30,29,30,29,31], // 2003
  [30,32,31,32,31,30,30,30,29,30,29,31], // 2004
  [31,31,32,31,31,30,30,30,29,30,29,30], // 2005
  [31,32,31,32,31,30,30,30,29,30,29,31], // 2006
  [31,31,31,32,31,31,29,30,29,29,30,31], // 2007
  [31,31,32,31,31,31,30,29,29,30,29,31], // 2008
  [31,31,32,31,32,30,30,29,30,29,30,30], // 2009
  [31,31,32,32,31,30,30,29,30,29,30,30], // 2010 - index 10
];

const NP_MONTHS = ["बैशाख","जेठ","असार","श्रावण","भाद्र","आश्विन","कार्तिक","मंसिर","पौष","माघ","फाल्गुन","चैत्र"];
const EN_MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function adToWords(date: Date): string {
  return `${date.getDate()} ${EN_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function bsToAd(year: number, month: number, day: number): Date | null {
  try {
    // Reference: 2000 BS = April 13/14, 1943 AD
    const refBsYear = 2000, refBsMonth = 1, refBsDay = 1;
    const refAd = new Date(1943, 3, 14); // April 14, 1943

    let totalDays = 0;
    for (let y = refBsYear; y < year; y++) {
      const idx = y - 2000;
      if (idx < 0 || idx >= BS_MONTH_DAYS.length) return null;
      for (let m = 1; m <= 12; m++) totalDays += BS_MONTH_DAYS[idx][m - 1] ?? 30;
    }
    const idx2 = year - 2000;
    if (idx2 < 0 || idx2 >= BS_MONTH_DAYS.length) return null;
    for (let m = 1; m < month; m++) totalDays += BS_MONTH_DAYS[idx2][m - 1] ?? 30;
    totalDays += day - refBsDay;

    const result = new Date(refAd);
    result.setDate(result.getDate() + totalDays);
    return result;
  } catch { return null; }
}

export default function DateConverterPage() {
  const [bsY, setBsY] = useState("2082");
  const [bsM, setBsM] = useState("1");
  const [bsD, setBsD] = useState("1");
  const [adResult, setAdResult] = useState<string | null>(null);

  const [adDate, setAdDate] = useState(new Date().toISOString().split("T")[0]);
  const [bsResult, setBsResult] = useState<string | null>(null);

  function convertBsToAd() {
    const result = bsToAd(parseInt(bsY), parseInt(bsM), parseInt(bsD));
    if (result) setAdResult(adToWords(result));
    else setAdResult("रूपान्तरण गर्न सकिएन (समर्थित दायरा: २०००–२०१०)");
  }

  function convertAdToBs() {
    // Simple reverse lookup
    const ad = new Date(adDate);
    const refAd = new Date(1943, 3, 14);
    const diffDays = Math.floor((ad.getTime() - refAd.getTime()) / 86400000);
    let remaining = diffDays;
    let bsYear = 2000;
    for (let y = 2000; y < 2010; y++) {
      const idx = y - 2000;
      let yearDays = 0;
      for (let m = 0; m < 12; m++) yearDays += BS_MONTH_DAYS[idx][m] ?? 30;
      if (remaining < yearDays) { bsYear = y; break; }
      remaining -= yearDays;
      bsYear = y + 1;
    }
    const idx = bsYear - 2000;
    if (idx < 0 || idx >= BS_MONTH_DAYS.length) { setBsResult("रूपान्तरण गर्न सकिएन"); return; }
    let bsMonth = 1;
    for (let m = 0; m < 12; m++) {
      const mdays = BS_MONTH_DAYS[idx][m] ?? 30;
      if (remaining < mdays) { bsMonth = m + 1; break; }
      remaining -= mdays;
    }
    const bsDay = remaining + 1;
    setBsResult(`${bsYear} ${NP_MONTHS[bsMonth - 1]} ${bsDay}`);
  }

  return (
    <div>
      <PageBanner
        title="मिति रूपान्तरण"
        subtitle="विक्रम संवत (बि.सं.) र इस्वी सन् (ई.सं.) बीच रूपान्तरण"
        icon={<Calendar className="w-7 h-7" />}
        breadcrumbs={[{ label: "गृहपृष्ठ", href: "/" }, { label: "मिति रूपान्तरण" }]}
      />
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-6">
            {/* BS to AD */}
            <Card>
              <CardBody className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowLeftRight className="w-5 h-5 text-[var(--brand-primary)]" />
                  <h2 className="font-bold text-gray-900">बि.सं. → ई.सं.</h2>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">वर्ष</label>
                    <input type="number" min="2000" max="2090" value={bsY} onChange={(e) => setBsY(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">महिना</label>
                    <select value={bsM} onChange={(e) => setBsM(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] bg-white">
                      {NP_MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">गते</label>
                    <input type="number" min="1" max="32" value={bsD} onChange={(e) => setBsD(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]" />
                  </div>
                </div>
                <Button className="w-full" onClick={convertBsToAd}>रूपान्तरण गर्नुहोस्</Button>
                {adResult && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <div className="text-xs text-gray-500 mb-1">ई.सं. मिति</div>
                    <div className="text-xl font-bold text-[var(--brand-primary)]">{adResult}</div>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* AD to BS */}
            <Card>
              <CardBody className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowLeftRight className="w-5 h-5 text-orange-500" />
                  <h2 className="font-bold text-gray-900">ई.सं. → बि.सं.</h2>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">ई.सं. मिति छान्नुहोस्</label>
                  <input type="date" value={adDate} onChange={(e) => setAdDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]" />
                </div>
                <Button className="w-full" variant="secondary" onClick={convertAdToBs}>रूपान्तरण गर्नुहोस्</Button>
                {bsResult && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
                    <div className="text-xs text-gray-500 mb-1">बि.सं. मिति</div>
                    <div className="text-xl font-bold text-orange-600">{bsResult}</div>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">नोट: यो calculator ले साधारण algorithm प्रयोग गर्छ। सटीक मिति नेपाल सरकारको official calendar हेर्नुहोस्।</p>
        </div>
      </section>
    </div>
  );
}
