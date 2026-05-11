"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { User, Phone, Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const GENDER_OPTIONS = [
  { value: "male", label: "पुरुष" },
  { value: "female", label: "महिला" },
  { value: "other", label: "अन्य" },
];

export default function MemberRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "success">("form");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", gender: "",
    password: "", confirmPassword: "",
  });

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("पासवर्ड मेल खाएन।"); return;
    }
    if (form.password.length < 6) {
      toast.error("पासवर्ड कम्तीमा ६ अक्षर हुनुपर्छ।"); return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/member/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, address: form.address, gender: form.gender, password: form.password }),
      });
      const data = await res.json();
      if (res.ok) { setStep("success"); }
      else toast.error(data.error || "दर्ता असफल भयो।");
    } catch { toast.error("सर्भर त्रुटि भयो।"); }
    finally { setLoading(false); }
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-[var(--brand-primary)]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">दर्ता सफल भयो!</h2>
          <p className="text-gray-500 mb-2">तपाईंको आवेदन स्वीकृतिको प्रतीक्षामा छ।</p>
          <p className="text-sm text-gray-400 mb-6">कार्यालयले तपाईंको खाता स्वीकृत गरेपछि मात्र लगिन गर्न सक्नुहुन्छ।</p>
          <Button onClick={() => router.push("/member/login")} className="w-full">लगिन पृष्ठमा जानुहोस्</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[var(--brand-primary)] flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3 shadow-lg">
            स
          </div>
          <h1 className="text-2xl font-bold text-gray-900">सदस्यता दर्ता</h1>
          <p className="text-gray-500 text-sm mt-1">नयाँ सदस्यता आवेदन</p>
        </div>

        <Card>
          <CardBody className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="पूरा नाम *" required value={form.name}
                onChange={(e) => set("name", e.target.value)}
                leftIcon={<User className="w-4 h-4" />} placeholder="पूरा नाम लेख्नुहोस्" />

              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="फोन *" required value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  leftIcon={<Phone className="w-4 h-4" />} placeholder="९८xxxxxxxx" />
                <Input label="इमेल" type="email" value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  leftIcon={<Mail className="w-4 h-4" />} placeholder="email@example.com" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="ठेगाना" value={form.address}
                  onChange={(e) => set("address", e.target.value)} placeholder="जिल्ला, गा.पा." />
                <Select label="लिङ्ग" options={GENDER_OPTIONS} placeholder="-- छान्नुहोस् --"
                  value={form.gender} onChange={(e) => set("gender", e.target.value)} />
              </div>

              <div className="relative">
                <Input label="पासवर्ड *" required
                  type={showPwd ? "text" : "password"} value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />} placeholder="कम्तीमा ६ अक्षर" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Input label="पासवर्ड पुन: लेख्नुहोस् *" required
                type="password" value={form.confirmPassword}
                onChange={(e) => set("confirmPassword", e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />} placeholder="••••••••" />

              <Button type="submit" loading={loading} className="w-full" size="lg">
                आवेदन दिनुहोस्
              </Button>
            </form>

            <div className="mt-5 pt-5 border-t border-gray-100 text-center space-y-2">
              <p className="text-sm text-gray-500">
                पहिलेदेखि सदस्य हुनुहुन्छ?{" "}
                <Link href="/member/login" className="text-[var(--brand-primary)] hover:underline font-medium">
                  लगिन गर्नुहोस्
                </Link>
              </p>
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
