"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Users, Search, Check, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

const STATUS_FILTERS = [
  { value: "", label: "सबै" },
  { value: "pending", label: "विचाराधीन" },
  { value: "approved", label: "स्वीकृत" },
  { value: "rejected", label: "अस्वीकृत" },
];

function AdminMembersInner() {
  const searchParams = useSearchParams();
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");
  const [search, setSearch] = useState("");
  const [data, setData] = useState<{ items: any[]; total: number; pages: number }>({ items: [], total: 0, pages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/members?${params}`);
      const json = await res.json();
      setData(json);
    } catch { toast.error("डेटा लोड हुन सकेन।"); }
    finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function updateStatus(id: number, approvalStatus: string) {
    try {
      await fetch("/api/admin/members", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, approvalStatus }) });
      toast.success("स्थिति अद्यावधिक भयो।");
      fetchData();
    } catch { toast.error("त्रुटि भयो।"); }
  }

  const filtered = search
    ? data.items.filter((m) => m.name?.toLowerCase().includes(search.toLowerCase()) || m.phone?.includes(search) || m.sadasyataNumber?.includes(search))
    : data.items;

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-6xl">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Users className="w-5 h-5" /> सदस्यहरू</h1>
            <p className="text-gray-500 text-sm">कुल: {data.total}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button key={f.value} onClick={() => { setStatusFilter(f.value); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${statusFilter === f.value ? "bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]" : "bg-white text-gray-600 border-gray-200 hover:border-[var(--brand-primary)]"}`}>
              {f.label}
            </button>
          ))}
          <div className="ml-auto w-56">
            <Input placeholder="नाम / फोन खोज्नुहोस्" leftIcon={<Search className="w-4 h-4" />}
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <DataTable
          loading={loading}
          data={filtered}
          emptyText="कुनै सदस्य छैन।"
          columns={[
            { key: "sadasyataNumber", header: "सदस्य नं." },
            { key: "name", header: "नाम" },
            { key: "phone", header: "फोन" },
            { key: "createdAt", header: "दर्ता मिति", render: (row) => formatDate(row.createdAt) },
            { key: "approvalStatus", header: "स्थिति", render: (row) => <StatusBadge status={row.approvalStatus} /> },
            {
              key: "actions", header: "कार्य",
              render: (row) => row.approvalStatus === "pending" ? (
                <div className="flex gap-2">
                  <Button size="sm" variant="primary" leftIcon={<Check className="w-3 h-3" />} onClick={() => updateStatus(row.id, "approved")}>स्वीकृत</Button>
                  <Button size="sm" variant="danger" leftIcon={<X className="w-3 h-3" />} onClick={() => updateStatus(row.id, "rejected")}>अस्वीकृत</Button>
                </div>
              ) : <span className="text-xs text-gray-400">—</span>,
            },
          ]}
        />

        {/* Pagination */}
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

export default function AdminMembersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin" /></div>}>
      <AdminMembersInner />
    </Suspense>
  );
}
