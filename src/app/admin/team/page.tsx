"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { Users, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
  { value: "board", label: "सञ्चालक समिति" },
  { value: "management", label: "व्यवस्थापन" },
  { value: "staff", label: "कर्मचारी" },
];

export default function AdminTeamPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", nameEn: "", positionNp: "", position: "", category: "staff", phone: "", email: "", displayOrder: "0" });

  async function fetchData() {
    setLoading(true);
    try { setItems(await (await fetch("/api/admin/team")).json()); }
    catch { toast.error("लोड भएन।"); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchData(); }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      const res = await fetch("/api/admin/team", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { toast.success("सदस्य थपियो!"); setShowForm(false); setForm({ name: "", nameEn: "", positionNp: "", position: "", category: "staff", phone: "", email: "", displayOrder: "0" }); fetchData(); }
      else toast.error("त्रुटि भयो।");
    } catch { toast.error("सर्भर त्रुटि।"); }
    finally { setSaving(false); }
  }

  async function deleteItem(id: number) {
    if (!confirm("मेट्ने?")) return;
    try {
      await fetch("/api/admin/team", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      toast.success("मेटियो।"); fetchData();
    } catch { toast.error("त्रुटि।"); }
  }

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Users className="w-5 h-5" /> टोली व्यवस्थापन</h1>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowForm(!showForm)}>सदस्य थप्नुहोस्</Button>
        </div>
        {showForm && (
          <Card><CardBody>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">नयाँ सदस्य</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={save} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="नाम (नेपाली) *" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input label="Name (English)" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="पद (नेपाली) *" required value={form.positionNp} onChange={(e) => setForm({ ...form, positionNp: e.target.value })} />
                <Select label="श्रेणी *" required options={CATEGORIES} placeholder="" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <Input label="फोन" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <Input label="इमेल" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <Input label="क्रम" type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: e.target.value })} />
              </div>
              <Button type="submit" loading={saving}>सुरक्षित गर्नुहोस्</Button>
            </form>
          </CardBody></Card>
        )}
        <DataTable loading={loading} data={items} emptyText="कुनै सदस्य छैन।"
          columns={[
            { key: "name", header: "नाम", render: (row) => <span className="font-medium">{row.name}</span> },
            { key: "positionNp", header: "पद", render: (row) => row.positionNp || row.position },
            { key: "category", header: "श्रेणी", render: (row) => CATEGORIES.find(c => c.value === row.category)?.label || row.category },
            { key: "phone", header: "फोन", render: (row) => row.phone || "—" },
            { key: "actions", header: "कार्य", render: (row) => <Button size="sm" variant="danger" leftIcon={<Trash2 className="w-3 h-3" />} onClick={() => deleteItem(row.id)}>मेट्नुहोस्</Button> },
          ]}
        />
      </div>
    </AdminLayout>
  );
}
