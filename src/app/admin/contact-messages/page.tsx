"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Mail, Trash2, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminContactMessagesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/contact-messages?page=${page}`);
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch { toast.error("लोड भएन।"); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function deleteItem(id: number) {
    if (!confirm("मेट्ने?")) return;
    try {
      await fetch("/api/admin/contact-messages", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      toast.success("मेटियो।"); fetchData();
    } catch { toast.error("त्रुटि।"); }
  }

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-5xl">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Mail className="w-5 h-5" /> सम्पर्क सन्देशहरू</h1>
          <p className="text-gray-500 text-sm">कुल: {total}</p>
        </div>

        {selected && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
              <h2 className="font-bold text-lg mb-1">{selected.subject || "सम्पर्क सन्देश"}</h2>
              <p className="text-sm text-gray-500 mb-4">{selected.name} — {selected.email || selected.phone} — {formatDate(selected.createdAt)}</p>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap">{selected.message}</div>
              <Button className="mt-4" variant="outline" onClick={() => setSelected(null)}>बन्द गर्नुहोस्</Button>
            </div>
          </div>
        )}

        <DataTable loading={loading} data={items} emptyText="कुनै सन्देश छैन।"
          columns={[
            { key: "name", header: "नाम", render: (row) => <span className="font-medium">{row.name}</span> },
            { key: "email", header: "इमेल/फोन", render: (row) => row.email || row.phone || "—" },
            { key: "subject", header: "विषय", render: (row) => <span className="line-clamp-1">{row.subject || "—"}</span> },
            { key: "createdAt", header: "मिति", render: (row) => formatDate(row.createdAt) },
            { key: "actions", header: "कार्य", render: (row) => (
              <div className="flex gap-1.5">
                <Button size="sm" variant="outline" leftIcon={<Eye className="w-3 h-3" />} onClick={() => setSelected(row)}>हेर्नुहोस्</Button>
                <Button size="sm" variant="danger" leftIcon={<Trash2 className="w-3 h-3" />} onClick={() => deleteItem(row.id)}>मेट्नुहोस्</Button>
              </div>
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
