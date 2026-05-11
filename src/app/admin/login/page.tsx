"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Shield, User, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("admin_session", JSON.stringify(data));
        toast.success("लगिन सफल!");
        router.push("/admin/dashboard");
      } else {
        toast.error(data.error || "लगिन असफल भयो।");
      }
    } catch {
      toast.error("सर्भर त्रुटि भयो।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-[var(--brand-primary-dark)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[var(--brand-primary)] flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">प्रशासक लगिन</p>
        </div>
        <Card>
          <CardBody className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input label="प्रयोगकर्ता नाम" placeholder="username" required
                leftIcon={<User className="w-4 h-4" />}
                value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
              <div className="relative">
                <Input label="पासवर्ड" type={showPwd ? "text" : "password"} placeholder="••••••••" required
                  leftIcon={<Lock className="w-4 h-4" />}
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button type="submit" loading={loading} className="w-full" size="lg">लगिन गर्नुहोस्</Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
