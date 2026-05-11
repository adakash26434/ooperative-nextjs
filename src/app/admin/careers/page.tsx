"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { Briefcase, Plus, Trash2, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminCareersPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ titleNp: "", title: "", descriptionNp: "", requirements: "", salary: "", deadline: "", applyUrl: "", isActive: "true" });

  async function fetchData() {
    setLoading(true);
    try { setItems(await (await fetch("/api/admin/careers")).json()); }
    catch { toast.error("लोड भएन।"); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchData(); }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      const res = await fetch("/api/admin/careers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, isActive: form.isActive === "true" }) });
      if (res.ok) { toast.success("जागिर थपियो!"); setShowForm(false); setForm({ titleNp: "", title: "", descriptionNp: "", requirements: "", salary: "", deadline: "", applyUrl: "", isActive: "true" }); fetchData(); }
      else toast.error("त्रुटि भयो।");
    } catch { toast.error("सर्भर त्रुटि।"); }
    finally { setSaving(false); }
  }

  async function deleteItem(id: number) {
    if (!confirm("मेट्ने?")) return;
    try {
      await fetch("/api/admin/careers", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      toast.success("मेटियो।"); fetchData();
    } catch { toast.error("त्रुटि।"); }
  }

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Briefcase className="w-5 h-5" /> करियर / रोजगारी</h1>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowForm(!showForm)}>नयाँ पद थप्नुहोस्</Button>
        </div>
        {showForm && (
          <Card><CardBody>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">नयाँ रोजगारी</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={save} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="पद (नेपाली) *" required value={form.titleNp} onChange={(e) => setForm({ ...form, titleNp: e.target.value })} />
                <Input label="Position (English)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <Textarea label="विवरण" rows={3} value={form.descriptionNp} onChange={(e) => setForm({ ...form, descriptionNp: e.target.value })} />
              <Textarea label="आवश्यकताहरू" rows={2} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
              <div className="grid sm:grid-cols-3 gap-4">
                <Input label="तलब" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="जस्तै: ३०,०००-५०,०००" />
                <Input label="अन्तिम मिति" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
                <Select label="स्थिति" options={[{ value: "true", label: "सक्रिय" }, { value: "false", label: "निष्क्रिय" }]} placeholder="" value={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.value })} />
              </div>
              <Input label="Apply URL" value={form.applyUrl} onChange={(e) => setForm({ ...form, applyUrl: e.target.value })} placeholder="https://..." />
              <Button type="submit" loading={saving}>सुरक्षित गर्नुहोस्</Button>
            </form>
          </CardBody></Card>
        )}
        <DataTable loading={loading} data={items} emptyText="कुनै रोजगारी छैन।"
          columns={[
            { key: "titleNp", header: "पद", render: (row) => row.titleNp || row.title },
            { key: "salary", header: "तलब", render: (row) => row.salary || "—" },
            { key: "deadline", header: "अन्तिम मिति", render: (row) => row.deadline ? formatDate(row.deadline) : "—" },
            { key: "isActive", header: "स्थिति", render: (row) => row.isActive ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">सक्रिय</span> : <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">बन्द</span> },
            { key: "actions", header: "कार्य", render: (row) => <Button size="sm" variant="danger" leftIcon={<Trash2 className="w-3 h-3" />} onClick={() => deleteItem(row.id)}>मेट्नुहोस्</Button> },
          ]}
        />
      </div>
    </AdminLayout>
  );
}
