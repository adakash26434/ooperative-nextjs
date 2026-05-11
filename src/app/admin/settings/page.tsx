"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Settings, Save } from "lucide-react";
import { toast } from "sonner";

const SETTING_GROUPS = [
  {
    label: "मूल जानकारी",
    keys: [
      { key: "site_name",     label: "संस्थाको नाम",      type: "text" },
      { key: "site_name_en",  label: "Name (English)",     type: "text" },
      { key: "site_slogan",   label: "नाराभाका / Slogan", type: "text" },
      { key: "reg_no",        label: "दर्ता नम्बर",        type: "text" },
      { key: "pan_no",        label: "PAN नम्बर",          type: "text" },
    ],
  },
  {
    label: "सम्पर्क",
    keys: [
      { key: "phone",         label: "फोन",               type: "text" },
      { key: "email",         label: "इमेल",              type: "text" },
      { key: "address",       label: "ठेगाना",             type: "text" },
      { key: "facebook_url",  label: "Facebook URL",       type: "text" },
      { key: "office_hours",  label: "कार्यालय समय",      type: "text" },
    ],
  },
  {
    label: "मुख्यपृष्ठ",
    keys: [
      { key: "hero_title",    label: "Hero Title",         type: "text" },
      { key: "hero_subtitle", label: "Hero Subtitle",      type: "text" },
      { key: "about_short",   label: "परिचय (छोटो)",      type: "textarea" },
    ],
  },
  {
    label: "थिम रंग",
    keys: [
      { key: "primary_color", label: "Primary Color",      type: "color" },
      { key: "footer_color",  label: "Footer Color",       type: "color" },
    ],
  },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then(setSettings).catch(() => {});
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      toast.success("सेटिङ सुरक्षित गरियो!");
    } catch {
      toast.error("सुरक्षित गर्न सकिएन।");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Settings className="w-5 h-5" /> सेटिङ</h1>
            <p className="text-gray-500 text-sm">वेबसाइटको जानकारी अद्यावधिक गर्नुहोस्</p>
          </div>
          <Button onClick={handleSave} loading={saving} leftIcon={<Save className="w-4 h-4" />}>सुरक्षित</Button>
        </div>

        {SETTING_GROUPS.map((group) => (
          <Card key={group.label}>
            <CardHeader>
              <h2 className="font-semibold text-gray-800">{group.label}</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              {group.keys.map((field) =>
                field.type === "textarea" ? (
                  <Textarea key={field.key} label={field.label} rows={3}
                    value={settings[field.key] || ""}
                    onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })} />
                ) : field.type === "color" ? (
                  <div key={field.key} className="flex items-center gap-3">
                    <input type="color" className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
                      value={settings[field.key] || "#1a5f2a"}
                      onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })} />
                    <Input label={field.label} value={settings[field.key] || ""}
                      onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })} />
                  </div>
                ) : (
                  <Input key={field.key} label={field.label}
                    value={settings[field.key] || ""}
                    onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })} />
                )
              )}
            </CardBody>
          </Card>
        ))}

        <Button onClick={handleSave} loading={saving} leftIcon={<Save className="w-4 h-4" />} size="lg" className="w-full">सेटिङ सुरक्षित गर्नुहोस्</Button>
      </div>
    </AdminLayout>
  );
}
