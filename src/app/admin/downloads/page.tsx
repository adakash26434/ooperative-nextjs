"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { Download, Plus, Trash2, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminDownloadsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ titleNp: "", title: "", fileUrl: "", category: "", fileType: "pdf" });

  async function fetchData() {
    setLoading(true);
    try { setItems(await (await fetch("/api/admin/downloads")).json()); }
    catch { toast.error("लोड भएन।"); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchData(); }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      const res = await fetch("/api/admin/downloads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { toast.success("थपियो!"); setShowForm(false); setForm({ titleNp: "", title: "", fileUrl: "", category: "", fileType: "pdf" }); fetchData(); }
      else toast.error("त्रुटि भयो।");
    } catch { toast.error("सर्भर त्रुटि।"); }
    finally { setSaving(false); }
  }

  async function deleteItem(id: number) {
    if (!confirm("मेट्ने?")) return;
    try {
      await fetch("/api/admin/downloads", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      toast.success("मेटियो।"); fetchData();
    } catch { toast.error("त्रुटि।"); }
  }

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Download className="w-5 h-5" /> डाउनलोडहरू</h1>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowForm(!showForm)}>नयाँ थप्नुहोस्</Button>
        </div>
        {showForm && (
          <Card><CardBody>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">नयाँ डाउनलोड</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={save} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="शीर्षक (नेपाली) *" required value={form.titleNp} onChange={(e) => setForm({ ...form, titleNp: e.target.value })} />
                <Input label="Title (English)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <Input label="File URL / Path *" required value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} placeholder="/uploads/document.pdf" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="श्रेणी" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="जस्तै: फारम, प्रतिवेदन" />
                <Select label="फाइल प्रकार" options={[{ value: "pdf", label: "PDF" }, { value: "doc", label: "DOC/DOCX" }, { value: "excel", label: "Excel" }, { value: "image", label: "Image" }, { value: "other", label: "Other" }]} placeholder="" value={form.fileType} onChange={(e) => setForm({ ...form, fileType: e.target.value })} />
              </div>
              <Button type="submit" loading={saving}>सुरक्षित गर्नुहोस्</Button>
            </form>
          </CardBody></Card>
        )}
        <DataTable loading={loading} data={items} emptyText="कुनै डाउनलोड छैन।"
          columns={[
            { key: "titleNp", header: "शीर्षक", render: (row) => row.titleNp || row.title },
            { key: "category", header: "श्रेणी", render: (row) => row.category || "—" },
            { key: "fileType", header: "प्रकार", render: (row) => <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase">{row.fileType}</span> },
            { key: "createdAt", header: "मिति", render: (row) => formatDate(row.createdAt) },
            { key: "actions", header: "कार्य", render: (row) => <Button size="sm" variant="danger" leftIcon={<Trash2 className="w-3 h-3" />} onClick={() => deleteItem(row.id)}>मेट्नुहोस्</Button> },
          ]}
        />
      </div>
    </AdminLayout>
  );
}
