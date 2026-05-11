"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MessageSquare, Check, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

const STATUS_FILTERS = [
  { value: "", label: "सबै" },
  { value: "pending", label: "विचाराधीन" },
  { value: "in_review", label: "समीक्षामा" },
  { value: "closed", label: "बन्द" },
];

export default function AdminGrievancesPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [data, setData] = useState<{ items: any[]; total: number; pages: number }>({ items: [], total: 0, pages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/grievances?${params}`);
      setData(await res.json());
    } catch { toast.error("डेटा लोड हुन सकेन।"); }
    finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function updateStatus(id: number, status: string) {
    try {
      await fetch("/api/admin/grievances", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      toast.success("स्थिति अद्यावधिक भयो।");
      fetchData();
    } catch { toast.error("त्रुटि भयो।"); }
  }

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-6xl">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" /> शिकायतहरू
          </h1>
          <p className="text-gray-500 text-sm">कुल: {data.total}</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button key={f.value} onClick={() => { setStatusFilter(f.value); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                statusFilter === f.value
                  ? "bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[var(--brand-primary)]"
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        <DataTable
          loading={loading}
          data={data.items}
          emptyText="कुनै शिकायत छैन।"
          columns={[
            { key: "trackingId", header: "ट्र्याकिङ आईडी", render: (row) => <span className="font-mono text-xs">{row.trackingId}</span> },
            { key: "name", header: "नाम" },
            { key: "phone", header: "फोन" },
            { key: "subject", header: "विषय", render: (row) => <span className="line-clamp-1 max-w-[200px]">{row.subject}</span> },
            { key: "createdAt", header: "मिति", render: (row) => formatDate(row.createdAt) },
            { key: "status", header: "स्थिति", render: (row) => <StatusBadge status={row.status} /> },
            {
              key: "actions", header: "कार्य",
              render: (row) => row.status !== "closed" ? (
                <div className="flex gap-1.5">
                  <Button size="sm" variant="outline" leftIcon={<Check className="w-3 h-3" />} onClick={() => updateStatus(row.id, "in_review")}>समीक्षा</Button>
                  <Button size="sm" variant="danger" leftIcon={<X className="w-3 h-3" />} onClick={() => updateStatus(row.id, "closed")}>बन्द</Button>
                </div>
              ) : <span className="text-xs text-gray-400">बन्द</span>,
            },
          ]}
        />

        {data.pages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>← अघिल्लो</Button>
            <span className="text-sm text-gray-600">{page} / {data.pages}</span>
            <Button variant="outline" size="sm" disabled={page === data.pages} onClick={() => setPage(page + 1)}>अर्को →</Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
