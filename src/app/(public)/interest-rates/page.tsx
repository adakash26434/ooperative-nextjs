import { prisma } from "@/lib/db";
import { PiggyBank, CreditCard, TrendingUp } from "lucide-react";

export const metadata = { title: "ब्याज दरहरू — Interest Rates" };

export default async function InterestRatesPage() {
  const rates = await prisma.interestRate.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { displayOrder: "asc" }],
  }).catch(() => []);

  const saving = rates.filter((r) => r.category === "saving");
  const loan = rates.filter((r) => r.category === "loan");

  return (
    <div>
      <section className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-light)] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6" />
            <h1 className="text-3xl font-bold">ब्याज दरहरू</h1>
          </div>
          <p className="text-green-100">हालको बचत तथा ऋण ब्याज दर तालिका</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Saving */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-[var(--brand-primary)] text-white px-6 py-4 flex items-center gap-2">
                <PiggyBank className="w-5 h-5" />
                <h2 className="font-bold text-lg">बचत ब्याज दर</h2>
              </div>
              <div className="divide-y">
                {saving.length === 0 ? (
                  <p className="p-6 text-center text-gray-400">डेटा उपलब्ध छैन।</p>
                ) : (
                  saving.map((r) => (
                    <div key={r.id} className="flex justify-between items-center px-6 py-4 hover:bg-gray-50">
                      <div>
                        <div className="font-medium text-gray-800">{r.nameNp || r.name}</div>
                        {(r.descriptionNp || r.description) && (
                          <div className="text-xs text-gray-400 mt-0.5">{r.descriptionNp || r.description}</div>
                        )}
                      </div>
                      <div className="text-2xl font-bold text-[var(--brand-primary)]">{Number(r.rate).toFixed(2)}%</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Loan */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-[var(--brand-secondary)] text-white px-6 py-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                <h2 className="font-bold text-lg">ऋण ब्याज दर</h2>
              </div>
              <div className="divide-y">
                {loan.length === 0 ? (
                  <p className="p-6 text-center text-gray-400">डेटा उपलब्ध छैन।</p>
                ) : (
                  loan.map((r) => (
                    <div key={r.id} className="flex justify-between items-center px-6 py-4 hover:bg-gray-50">
                      <div>
                        <div className="font-medium text-gray-800">{r.nameNp || r.name}</div>
                        {(r.descriptionNp || r.description) && (
                          <div className="text-xs text-gray-400 mt-0.5">{r.descriptionNp || r.description}</div>
                        )}
                      </div>
                      <div className="text-2xl font-bold text-orange-600">{Number(r.rate).toFixed(2)}%</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
            <strong>नोट:</strong> माथि उल्लेखित ब्याज दरहरू परिवर्तन हुन सक्छन्। थप जानकारीको लागि कार्यालयमा सम्पर्क गर्नुहोस्।
          </div>
        </div>
      </section>
    </div>
  );
}
