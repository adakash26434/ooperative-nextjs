"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function MemberLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/member/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        // Store session in localStorage for now (replace with NextAuth in production)
        localStorage.setItem("member_session", JSON.stringify(data));
        toast.success(`स्वागत छ, ${data.name}!`);
        router.push("/member/dashboard");
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[var(--brand-primary)] flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3 shadow-lg">
            स
          </div>
          <h1 className="text-2xl font-bold text-gray-900">सदस्य लगिन</h1>
          <p className="text-gray-500 text-sm mt-1">सहकारी सदस्य पोर्टल</p>
        </div>

        <Card>
          <CardBody className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="फोन / इमेल / सदस्य नं."
                placeholder="९८xxxxxxxx वा email@example.com"
                value={form.identifier}
                onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                leftIcon={<User className="w-4 h-4" />}
                required
              />
              <div className="relative">
                <Input
                  label="पासवर्ड"
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button type="submit" loading={loading} className="w-full" size="lg">
                लगिन गर्नुहोस्
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100 text-center space-y-2">
              <Link href="/online-account" className="block text-sm text-[var(--brand-primary)] hover:underline">
                नयाँ खाता खोल्नुहोस्
              </Link>
              <Link href="/" className="block text-sm text-gray-400 hover:text-gray-600">
                ← मुख्य वेबसाइटमा फिर्ता
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
