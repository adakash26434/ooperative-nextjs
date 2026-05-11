"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { MapPin, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminServiceCentersPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nameNp: "", name: "", address: "", phone: "", email: "", mapUrl: "" });

  async function fetchData() {
    setLoading(true);
    try { setItems(await (await fetch("/api/service-centers")).json()); }
    catch { toast.error("लोड भएन।"); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchData(); }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      const res = await fetch("/api/admin/service-centers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { toast.success("सेवा केन्द्र थपियो!"); setShowForm(false); setForm({ nameNp: "", name: "", address: "", phone: "", email: "", mapUrl: "" }); fetchData(); }
      else toast.error("त्रुटि भयो।");
    } catch { toast.error("सर्भर त्रुटि।"); }
    finally { setSaving(false); }
  }

  async function deleteItem(id: number) {
    if (!confirm("मेट्ने?")) return;
    try {
      await fetch("/api/admin/service-centers", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      toast.success("मेटियो।"); fetchData();
    } catch { toast.error("त्रुटि।"); }
  }

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><MapPin className="w-5 h-5" /> सेवा केन्द्रहरू</h1>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowForm(!showForm)}>सेवा केन्द्र थप्नुहोस्</Button>
        </div>
        {showForm && (
          <Card><CardBody>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">नयाँ सेवा केन्द्र</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={save} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="नाम (नेपाली) *" required value={form.nameNp} onChange={(e) => setForm({ ...form, nameNp: e.target.value })} />
                <Input label="Name (English)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <Input label="ठेगाना" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="फोन" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <Input label="इमेल" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <Input label="Google Map URL" value={form.mapUrl} onChange={(e) => setForm({ ...form, mapUrl: e.target.value })} placeholder="https://maps.google.com/..." />
              <Button type="submit" loading={saving}>सुरक्षित गर्नुहोस्</Button>
            </form>
          </CardBody></Card>
        )}
        <DataTable loading={loading} data={items} emptyText="कुनै सेवा केन्द्र छैन।"
          columns={[
            { key: "nameNp", header: "नाम", render: (row) => <span className="font-medium">{row.nameNp || row.name}</span> },
            { key: "address", header: "ठेगाना", render: (row) => row.address || "—" },
            { key: "phone", header: "फोन", render: (row) => row.phone || "—" },
            { key: "email", header: "इमेल", render: (row) => row.email || "—" },
            { key: "actions", header: "कार्य", render: (row) => <Button size="sm" variant="danger" leftIcon={<Trash2 className="w-3 h-3" />} onClick={() => deleteItem(row.id)}>मेट्नुहोस्</Button> },
          ]}
        />
      </div>
    </AdminLayout>
  );
}
