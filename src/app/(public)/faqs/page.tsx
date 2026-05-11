import { prisma } from "@/lib/db";
import { HelpCircle, ChevronDown } from "lucide-react";

export const metadata = { title: "FAQs — बारम्बार सोधिने प्रश्नहरू" };

export default async function FaqsPage() {
  const faqs = await prisma.faq.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { displayOrder: "asc" }],
  }).catch(() => []);

  return (
    <div>
      <section className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-light)] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2"><HelpCircle className="w-6 h-6" /><h1 className="text-3xl font-bold">बारम्बार सोधिने प्रश्नहरू</h1></div>
          <p className="text-green-100">सामान्य प्रश्न र उत्तरहरू</p>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {faqs.length === 0 ? (
            <div className="text-center py-16 text-gray-400"><HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-30" /><p>कुनै प्रश्न छैन।</p></div>
          ) : (
            <div className="space-y-3">
              {faqs.map((faq) => (
                <details key={faq.id} className="bg-white rounded-xl border border-gray-200 group">
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-medium text-gray-800 hover:text-[var(--brand-primary)] list-none">
                    {faq.questionNp || faq.question}
                    <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-3" />
                  </summary>
                  <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
                    {faq.answerNp || faq.answer}
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
