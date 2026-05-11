"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { HelpCircle, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminFaqsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ questionNp: "", question: "", answerNp: "", answer: "", category: "", displayOrder: "0" });

  async function fetchData() {
    setLoading(true);
    try { setItems(await (await fetch("/api/admin/faqs")).json()); }
    catch { toast.error("लोड भएन।"); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchData(); }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      const res = await fetch("/api/admin/faqs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { toast.success("FAQ थपियो!"); setShowForm(false); setForm({ questionNp: "", question: "", answerNp: "", answer: "", category: "", displayOrder: "0" }); fetchData(); }
      else toast.error("त्रुटि भयो।");
    } catch { toast.error("सर्भर त्रुटि।"); }
    finally { setSaving(false); }
  }

  async function deleteItem(id: number) {
    if (!confirm("मेट्ने?")) return;
    try {
      await fetch("/api/admin/faqs", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      toast.success("मेटियो।"); fetchData();
    } catch { toast.error("त्रुटि।"); }
  }

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><HelpCircle className="w-5 h-5" /> बारम्बार सोधिने प्रश्नहरू (FAQs)</h1>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowForm(!showForm)}>नयाँ FAQ थप्नुहोस्</Button>
        </div>
        {showForm && (
          <Card><CardBody>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">नयाँ FAQ</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={save} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="श्रेणी" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="जस्तै: खाता, ऋण" />
                <Input label="क्रम" type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: e.target.value })} />
              </div>
              <Textarea label="प्रश्न (नेपाली) *" required rows={2} value={form.questionNp} onChange={(e) => setForm({ ...form, questionNp: e.target.value })} />
              <Textarea label="उत्तर (नेपाली) *" required rows={3} value={form.answerNp} onChange={(e) => setForm({ ...form, answerNp: e.target.value })} />
              <Button type="submit" loading={saving}>सुरक्षित गर्नुहोस्</Button>
            </form>
          </CardBody></Card>
        )}
        <DataTable loading={loading} data={items} emptyText="कुनै FAQ छैन।"
          columns={[
            { key: "questionNp", header: "प्रश्न", render: (row) => <span className="line-clamp-2 font-medium">{row.questionNp || row.question}</span> },
            { key: "category", header: "श्रेणी", render: (row) => row.category ? <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{row.category}</span> : "—" },
            { key: "displayOrder", header: "क्रम" },
            { key: "actions", header: "कार्य", render: (row) => <Button size="sm" variant="danger" leftIcon={<Trash2 className="w-3 h-3" />} onClick={() => deleteItem(row.id)}>मेट्नुहोस्</Button> },
          ]}
        />
      </div>
    </AdminLayout>
  );
}
