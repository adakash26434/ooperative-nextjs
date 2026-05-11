"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Calendar, Eye, CheckCircle, XCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminAppointmentsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/appointments?page=${page}`);
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch { toast.error("लोड भएन।"); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function updateStatus(id: number, status: string) {
    try {
      await fetch("/api/admin/appointments", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
      toast.success("स्थिति अपडेट भयो।");
      fetchData();
      setSelected(null);
    } catch { toast.error("त्रुटि भयो।"); }
  }

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-5xl">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Calendar className="w-5 h-5" /> भेटघाट बुकिङहरू</h1>
          <p className="text-gray-500 text-sm">कुल: {total}</p>
        </div>

        {selected && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
              <h2 className="font-bold text-lg mb-1">{selected.subject}</h2>
              <p className="text-sm text-gray-500 mb-1">{selected.name} — {selected.phone || selected.email || "—"}</p>
              <p className="text-xs text-gray-400 mb-4">{formatDate(selected.createdAt)}</p>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap mb-4">{selected.description}</div>
              <div className="flex gap-2">
                <Button size="sm" leftIcon={<CheckCircle className="w-3.5 h-3.5" />} onClick={() => updateStatus(selected.id, "approved")}>स्वीकृत</Button>
                <Button size="sm" variant="danger" leftIcon={<XCircle className="w-3.5 h-3.5" />} onClick={() => updateStatus(selected.id, "rejected")}>अस्वीकृत</Button>
                <Button size="sm" variant="outline" onClick={() => setSelected(null)}>बन्द</Button>
              </div>
            </div>
          </div>
        )}

        <DataTable loading={loading} data={items} emptyText="कुनै भेटघाट बुकिङ छैन।"
          columns={[
            { key: "name", header: "नाम", render: (row) => <span className="font-medium">{row.name}</span> },
            { key: "phone", header: "फोन", render: (row) => row.phone || "—" },
            { key: "subject", header: "उद्देश्य", render: (row) => <span className="line-clamp-1 text-sm">{row.subject?.replace("भेटघाट बुकिङ — ", "")}</span> },
            { key: "status", header: "स्थिति", render: (row) => <StatusBadge status={row.status} /> },
            { key: "createdAt", header: "मिति", render: (row) => formatDate(row.createdAt) },
            { key: "actions", header: "कार्य", render: (row) => (
              <Button size="sm" variant="outline" leftIcon={<Eye className="w-3 h-3" />} onClick={() => setSelected(row)}>हेर्नुहोस्</Button>
            )},
          ]}
        />
        {pages > 1 && (
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>← अघिल्लो</Button>
            <span className="text-sm self-center text-gray-600">{page} / {pages}</span>
            <Button variant="outline" size="sm" disabled={page === pages} onClick={() => setPage(page + 1)}>अर्को →</Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
