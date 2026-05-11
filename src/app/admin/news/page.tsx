"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { BookOpen, Plus, Trash2, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminNewsPage() {
  const [data, setData] = useState<{ items: any[]; total: number; pages: number }>({ items: [], total: 0, pages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ titleNp: "", title: "", contentNp: "", content: "", image: "" });

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/news?page=${page}`);
      setData(await res.json());
    } catch { toast.error("लोड भएन।"); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchData(); }, [page]);

  async function saveNews(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      const res = await fetch("/api/admin/news", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { toast.success("समाचार थपियो!"); setShowForm(false); setForm({ titleNp: "", title: "", contentNp: "", content: "", image: "" }); fetchData(); }
      else toast.error("त्रुटि भयो।");
    } catch { toast.error("सर्भर त्रुटि।"); }
    finally { setSaving(false); }
  }

  async function deleteNews(id: number) {
    if (!confirm("यो समाचार मेट्ने?")) return;
    try {
      await fetch("/api/admin/news", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      toast.success("मेटियो।"); fetchData();
    } catch { toast.error("त्रुटि भयो।"); }
  }

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><BookOpen className="w-5 h-5" /> समाचार</h1>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowForm(!showForm)}>नयाँ समाचार</Button>
        </div>

        {showForm && (
          <Card>
            <CardBody>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800">नयाँ समाचार थप्नुहोस्</h2>
                <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <form onSubmit={saveNews} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="शीर्षक (नेपाली) *" required value={form.titleNp} onChange={(e) => setForm({ ...form, titleNp: e.target.value })} />
                  <Input label="Title (English)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <Textarea label="सामग्री (नेपाली)" rows={4} value={form.contentNp} onChange={(e) => setForm({ ...form, contentNp: e.target.value })} />
                <Input label="Image URL (optional)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="/uploads/news-image.jpg" />
                <Button type="submit" loading={saving}>समाचार सुरक्षित गर्नुहोस्</Button>
              </form>
            </CardBody>
          </Card>
        )}

        <DataTable loading={loading} data={data.items} emptyText="कुनै समाचार छैन।"
          columns={[
            { key: "titleNp", header: "शीर्षक", render: (row) => <span className="font-medium line-clamp-1">{row.titleNp || row.title}</span> },
            { key: "createdAt", header: "मिति", render: (row) => formatDate(row.createdAt) },
            { key: "isActive", header: "स्थिति", render: (row) => row.isActive ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">सक्रिय</span> : <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">निष्क्रिय</span> },
            { key: "actions", header: "कार्य", render: (row) => <Button size="sm" variant="danger" leftIcon={<Trash2 className="w-3 h-3" />} onClick={() => deleteNews(row.id)}>मेट्नुहोस्</Button> },
          ]}
        />
        {data.pages > 1 && (
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>← अघिल्लो</Button>
            <span className="text-sm self-center text-gray-600">{page} / {data.pages}</span>
            <Button variant="outline" size="sm" disabled={page === data.pages} onClick={() => setPage(page + 1)}>अर्को →</Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
