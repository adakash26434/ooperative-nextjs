"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Image as ImageIcon, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminGalleryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ titleNp: "", title: "", image: "", category: "" });

  async function fetchData() {
    setLoading(true);
    try { setItems(await (await fetch("/api/gallery")).json()); }
    catch { toast.error("लोड भएन।"); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchData(); }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      const res = await fetch("/api/admin/gallery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { toast.success("फोटो थपियो!"); setShowForm(false); setForm({ titleNp: "", title: "", image: "", category: "" }); fetchData(); }
      else toast.error("त्रुटि भयो।");
    } catch { toast.error("सर्भर त्रुटि।"); }
    finally { setSaving(false); }
  }

  async function deleteItem(id: number) {
    if (!confirm("मेट्ने?")) return;
    try {
      await fetch("/api/admin/gallery", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      toast.success("मेटियो।"); fetchData();
    } catch { toast.error("त्रुटि।"); }
  }

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><ImageIcon className="w-5 h-5" /> ग्यालरी</h1>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowForm(!showForm)}>फोटो थप्नुहोस्</Button>
        </div>
        {showForm && (
          <Card><CardBody>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">नयाँ फोटो</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={save} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="शीर्षक (नेपाली) *" required value={form.titleNp} onChange={(e) => setForm({ ...form, titleNp: e.target.value })} />
                <Input label="श्रेणी" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="जस्तै: कार्यक्रम" />
              </div>
              <Input label="Image URL *" required value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="/uploads/photo.jpg" />
              <Button type="submit" loading={saving}>सुरक्षित गर्नुहोस्</Button>
            </form>
          </CardBody></Card>
        )}
        {loading ? <div className="text-center py-12 text-gray-400">लोड हुँदैछ...</div> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.length === 0 ? <p className="text-gray-400 col-span-4 text-center py-12">कुनै फोटो छैन।</p> : items.map((item) => (
              <div key={item.id} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-100 aspect-square">
                <img src={`/${item.image}`} alt={item.titleNp || item.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/200x200?text=Photo"; }} />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => deleteItem(item.id)} className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-3 py-1.5 text-xs flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> मेट्नुहोस्
                  </button>
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 p-2">
                  <p className="text-white text-xs truncate">{item.titleNp || item.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
