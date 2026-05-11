import { prisma } from "@/lib/db";
import { Bell, Calendar, Paperclip } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "सूचनाहरू — Notices" };

export default async function NoticesPage() {
  const notices = await prisma.notice.findMany({
    where: { isActive: true },
    orderBy: [{ noticeDate: "desc" }, { createdAt: "desc" }],
  }).catch(() => []);

  return (
    <div>
      {/* Banner */}
      <section className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-light)] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-6 h-6" />
            <h1 className="text-3xl font-bold">सूचनाहरू</h1>
          </div>
          <p className="text-green-100">संस्थाका सबै सूचना तथा जानकारीहरू</p>
        </div>
      </section>

      {/* Notices list */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {notices.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>हाल कुनै सूचना छैन।</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notices.map((notice) => (
                <div key={notice.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {notice.titleNp || notice.title}
                        {notice.isPopup && (
                          <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">महत्त्वपूर्ण</span>
                        )}
                      </h3>
                      {(notice.contentNp || notice.content) && (
                        <p className="text-gray-600 text-sm mt-1 leading-relaxed">{notice.contentNp || notice.content}</p>
                      )}
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                        {notice.noticeDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(notice.noticeDate)}
                          </span>
                        )}
                        {notice.attachment && (
                          <a
                            href={`/${notice.attachment}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[var(--brand-primary)] hover:underline"
                          >
                            <Paperclip className="w-3 h-3" /> संलग्न फाइल
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
