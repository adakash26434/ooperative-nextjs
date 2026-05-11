"use client";

import { useState, useEffect } from "react";
import { PageBanner } from "@/components/ui/PageBanner";
import { Gavel, Calendar, CheckCircle } from "lucide-react";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export default function AuctionPage() {
  const [auctions, setAuctions] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/auction-bid").then((r) => r.json()).then((d) => Array.isArray(d) && setAuctions(d)).catch(() => {});
  }, []);

  const [bidForm, setBidForm] = useState({ auctionId: 0, bidderName: "", bidderPhone: "", bidderEmail: "", bidAmount: "", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleBid(e: React.FormEvent) {
    e.preventDefault(); setSubmitting(true);
    try {
      const res = await fetch("/api/auction-bid", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auctionId: bidForm.auctionId,
          bidderName: bidForm.bidderName,
          bidderPhone: bidForm.bidderPhone,
          bidderEmail: bidForm.bidderEmail,
          bidAmount: Number(bidForm.bidAmount),
          note: bidForm.note,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) { setSuccess(true); setBidForm({ auctionId: 0, bidderName: "", bidderPhone: "", bidderEmail: "", bidAmount: "", note: "" }); toast.success("बोलपत्र दर्ता भयो!"); }
      else toast.error(data.error || "त्रुटि भयो।");
    } catch { toast.error("सर्भर त्रुटि।"); }
    finally { setSubmitting(false); }
  }

  return (
    <div>
      <PageBanner title="लिलामी सूचना" subtitle="संस्थाका सम्पत्तिहरूको खुला लिलामी बिक्री"
        icon={<Gavel className="w-7 h-7" />}
        breadcrumbs={[{ label: "गृहपृष्ठ", href: "/" }, { label: "लिलामी सूचना" }]} />

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl space-y-6">
          {auctions.length === 0 ? (
            <div className="text-center py-16 text-gray-400"><Gavel className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>हाल कुनै लिलामी सूचना छैन।</p></div>
          ) : auctions.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">{a.title}</h3>
                    {a.isActive && <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">खुला</span>}
                  </div>
                  <p className="text-gray-500 text-sm mb-3">{a.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-[var(--brand-primary)]" />{a.auctionDate ? new Date(a.auctionDate).toLocaleDateString("ne-NP") : ""}</span>
                    <span className="font-semibold text-[var(--brand-primary)]">आधार मूल्य: {a.basePrice}</span>
                    <span>{a.location}</span>
                  </div>
                </div>
                {a.isActive && (
                  <button onClick={() => { setBidForm({ ...bidForm, auctionId: a.id }); setSuccess(false); }}
                    className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shrink-0">
                    बोलपत्र पेश गर्नुहोस्
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bid modal */}
      {bidForm.auctionId > 0 && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setBidForm({ ...bidForm, auctionId: 0 })}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            {success ? (
              <div className="text-center py-6">
                <CheckCircle className="w-14 h-14 text-[var(--brand-primary)] mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-1">बोलपत्र दर्ता भयो!</h3>
                <p className="text-gray-500 text-sm mb-4">कार्यालयले सम्पर्क गर्नेछ।</p>
                <button onClick={() => setBidForm({ ...bidForm, auctionId: 0 })} className="bg-[var(--brand-primary)] text-white px-6 py-2 rounded-xl text-sm font-semibold">ठीक छ</button>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-lg mb-4">बोलपत्र पेश गर्नुहोस्</h3>
                <form onSubmit={handleBid} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="नाम *" required value={bidForm.bidderName} onChange={(e) => setBidForm({ ...bidForm, bidderName: e.target.value })} />
                    <Input label="फोन *" required value={bidForm.bidderPhone} onChange={(e) => setBidForm({ ...bidForm, bidderPhone: e.target.value })} />
                  </div>
                  <Input label="इमेल" type="email" value={bidForm.bidderEmail} onChange={(e) => setBidForm({ ...bidForm, bidderEmail: e.target.value })} />
                  <Input label="बोलपत्र रकम (रु.) *" required type="number" value={bidForm.bidAmount} onChange={(e) => setBidForm({ ...bidForm, bidAmount: e.target.value })} placeholder="जस्तै: 1600000" />
                  <Textarea label="नोट" rows={2} value={bidForm.note} onChange={(e) => setBidForm({ ...bidForm, note: e.target.value })} />
                  <div className="flex gap-3 pt-1">
                    <Button type="submit" loading={submitting} className="flex-1">पेश गर्नुहोस्</Button>
                    <button type="button" onClick={() => setBidForm({ ...bidForm, auctionId: 0 })} className="px-4 border border-gray-300 rounded-xl text-sm text-gray-600">बन्द</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
