"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { Bell, Plus, Trash2, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", titleNp: "", content: "", contentNp: "", noticeDate: "", isPopup: false });
  const [saving, setSaving] = useState(false);

  async function fetchNotices() {
    setLoading(true);
    try {
      const res = await fetch("/api/notices");
      setNotices(await res.json());
    } catch { toast.error("लोड भएन।"); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchNotices(); }, []);

  async function saveNotice(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      const res = await fetch("/api/admin/notices", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      if (res.ok) { toast.success("सूचना थपियो!"); setShowForm(false); setForm({ title: "", titleNp: "", content: "", contentNp: "", noticeDate: "", isPopup: false }); fetchNotices(); }
      else toast.error("त्रुटि भयो।");
    } catch { toast.error("सर्भर त्रुटि।"); }
    finally { setSaving(false); }
  }

  async function deleteNotice(id: number) {
    if (!confirm("यो सूचना मेट्ने?")) return;
    try {
      await fetch(`/api/admin/notices/${id}`, { method: "DELETE" });
      toast.success("मेटियो।"); fetchNotices();
    } catch { toast.error("त्रुटि भयो।"); }
  }

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Bell className="w-5 h-5" /> सूचनाहरू</h1>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowForm(!showForm)}>
            {showForm ? "बन्द गर्नुहोस्" : "नयाँ सूचना"}
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardBody>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800">नयाँ सूचना थप्नुहोस्</h2>
                <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <form onSubmit={saveNotice} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="शीर्षक (नेपाली) *" required value={form.titleNp} onChange={(e) => setForm({ ...form, titleNp: e.target.value })} />
                  <Input label="Title (English)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <Textarea label="सूचना (नेपाली)" rows={3} value={form.contentNp} onChange={(e) => setForm({ ...form, contentNp: e.target.value })} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="मिति" type="date" value={form.noticeDate} onChange={(e) => setForm({ ...form, noticeDate: e.target.value })} />
                  <div className="flex items-center gap-3 pt-6">
                    <input type="checkbox" id="popup" checked={form.isPopup} onChange={(e) => setForm({ ...form, isPopup: e.target.checked })} className="w-4 h-4 accent-[var(--brand-primary)]" />
                    <label htmlFor="popup" className="text-sm font-medium text-gray-700">Popup सूचना</label>
                  </div>
                </div>
                <Button type="submit" loading={saving}>सूचना सुरक्षित गर्नुहोस्</Button>
              </form>
            </CardBody>
          </Card>
        )}

        <DataTable
          loading={loading}
          data={notices}
          emptyText="कुनै सूचना छैन।"
          columns={[
            { key: "titleNp", header: "शीर्षक", render: (row) => <span className="font-medium">{row.titleNp || row.title}</span> },
            { key: "noticeDate", header: "मिति", render: (row) => row.noticeDate ? formatDate(row.noticeDate) : "—" },
            { key: "isPopup", header: "Popup", render: (row) => row.isPopup ? <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">हो</span> : "—" },
            {
              key: "actions", header: "कार्य",
              render: (row) => (
                <Button size="sm" variant="danger" leftIcon={<Trash2 className="w-3 h-3" />} onClick={() => deleteNotice(row.id)}>मेट्नुहोस्</Button>
              ),
            },
          ]}
        />
      </div>
    </AdminLayout>
  );
}
