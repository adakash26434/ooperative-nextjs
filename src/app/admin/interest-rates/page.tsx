"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { CreditCard, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminInterestRatesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ category: "saving", nameNp: "", name: "", rate: "", descriptionNp: "", displayOrder: "0" });

  async function fetchData() {
    setLoading(true);
    try { setItems(await (await fetch("/api/admin/interest-rates")).json()); }
    catch { toast.error("लोड भएन।"); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchData(); }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      const res = await fetch("/api/admin/interest-rates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { toast.success("ब्याज दर थपियो!"); setShowForm(false); setForm({ category: "saving", nameNp: "", name: "", rate: "", descriptionNp: "", displayOrder: "0" }); fetchData(); }
      else toast.error("त्रुटि भयो।");
    } catch { toast.error("सर्भर त्रुटि।"); }
    finally { setSaving(false); }
  }

  async function deleteItem(id: number) {
    if (!confirm("मेट्ने?")) return;
    try {
      await fetch("/api/admin/interest-rates", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      toast.success("मेटियो।"); fetchData();
    } catch { toast.error("त्रुटि।"); }
  }

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-4xl">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><CreditCard className="w-5 h-5" /> ब्याज दरहरू</h1>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowForm(!showForm)}>नयाँ दर थप्नुहोस्</Button>
        </div>
        {showForm && (
          <Card>
            <CardBody>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">नयाँ ब्याज दर</h2>
                <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <form onSubmit={save} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Select label="प्रकार *" required options={[{ value: "saving", label: "बचत" }, { value: "loan", label: "ऋण" }]} placeholder="" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                  <Input label="ब्याज दर (%) *" required type="number" step="0.01" value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} placeholder="जस्तै: 8.5" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="नाम (नेपाली) *" required value={form.nameNp} onChange={(e) => setForm({ ...form, nameNp: e.target.value })} />
                  <Input label="Name (English)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <Input label="विवरण (नेपाली)" value={form.descriptionNp} onChange={(e) => setForm({ ...form, descriptionNp: e.target.value })} />
                <Input label="क्रम (Display Order)" type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: e.target.value })} />
                <Button type="submit" loading={saving}>सुरक्षित गर्नुहोस्</Button>
              </form>
            </CardBody>
          </Card>
        )}
        <DataTable loading={loading} data={items} emptyText="कुनै ब्याज दर छैन।"
          columns={[
            { key: "type", header: "प्रकार", render: (row) => <span className={`text-xs font-semibold px-2 py-1 rounded-full ${row.type === "saving" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>{row.type === "saving" ? "बचत" : "ऋण"}</span> },
            { key: "nameNp", header: "नाम", render: (row) => row.nameNp || row.name },
            { key: "rate", header: "ब्याज दर", render: (row) => <span className="font-bold text-[var(--brand-primary)]">{row.rate}%</span> },
            { key: "descriptionNp", header: "विवरण", render: (row) => <span className="line-clamp-1 text-sm text-gray-500">{row.descriptionNp || "—"}</span> },
            { key: "actions", header: "कार्य", render: (row) => <Button size="sm" variant="danger" leftIcon={<Trash2 className="w-3 h-3" />} onClick={() => deleteItem(row.id)}>मेट्नुहोस्</Button> },
          ]}
        />
      </div>
    </AdminLayout>
  );
}
