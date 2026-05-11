"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { toast } from "sonner";
import {
  User, CreditCard, FileText, MessageSquare,
  Bell, LogOut, Home, Menu, X, CheckCircle,
} from "lucide-react";

type Tab = "overview" | "loans" | "kyc" | "grievance" | "profile" | "activity";

const LOAN_TYPES = [
  { value: "व्यक्तिगत ऋण", label: "व्यक्तिगत ऋण" },
  { value: "व्यवसायिक ऋण", label: "व्यवसायिक ऋण" },
  { value: "शैक्षिक ऋण", label: "शैक्षिक ऋण" },
  { value: "घर कर्जा", label: "घर कर्जा" },
  { value: "कृषि ऋण", label: "कृषि ऋण" },
];

export default function MemberDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<Record<string, string> | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loanForm, setLoanForm] = useState({ fullName: "", phone: "", loanType: "", loanAmount: "", loanPurpose: "" });
  const [kycForm, setKycForm] = useState({ fullName: "", phone: "", subject: "KYC अद्यावधिक" });
  const [grievanceForm, setGrievanceForm] = useState({ name: "", phone: "", subject: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [trackingResult, setTrackingResult] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "", address: "", gender: "", currentPassword: "", newPassword: "" });
  const [activity, setActivity] = useState<{ loans: any[]; kyc: any[]; grievances: any[] } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("member_session");
    if (!stored) { router.push("/member/login"); return; }
    const parsed = JSON.parse(stored);
    setSession(parsed);
    setLoanForm((f) => ({ ...f, fullName: parsed.name || "", phone: parsed.phone || "" }));
    setGrievanceForm((f) => ({ ...f, name: parsed.name || "", phone: parsed.phone || "" }));
    setKycForm((f) => ({ ...f, fullName: parsed.name || "", phone: parsed.phone || "" }));
    setProfileForm((f) => ({ ...f, name: parsed.name || "", phone: parsed.phone || "", address: parsed.address || "", gender: parsed.gender || "" }));
    // fetch activity
    if (parsed.id) {
      fetch(`/api/member/profile?id=${parsed.id}`)
        .then((r) => r.json())
        .then((d) => setActivity({ loans: d.loanApplications || [], kyc: d.kycApplications || [], grievances: d.grievances || [] }))
        .catch(() => {});
    }
  }, [router]);

  function logout() {
    localStorage.removeItem("member_session");
    router.push("/member/login");
  }

  async function submitLoan(e: React.FormEvent) {
    e.preventDefault(); setSubmitting(true);
    try {
      const res = await fetch("/api/loan-apply", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...loanForm, loanAmount: parseFloat(loanForm.loanAmount) }),
      });
      const data = await res.json();
      if (data.trackingId) { setTrackingResult(data.trackingId); toast.success("ऋण आवेदन दर्ता भयो!"); }
      else toast.error(data.error || "त्रुटि भयो।");
    } catch { toast.error("सर्भर त्रुटि भयो।"); }
    finally { setSubmitting(false); }
  }

  async function submitGrievance(e: React.FormEvent) {
    e.preventDefault(); setSubmitting(true);
    try {
      const res = await fetch("/api/grievance", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(grievanceForm),
      });
      const data = await res.json();
      if (data.trackingId) { setTrackingResult(data.trackingId); toast.success("शिकायत दर्ता भयो!"); }
      else toast.error(data.error || "त्रुटि भयो।");
    } catch { toast.error("सर्भर त्रुटि भयो।"); }
    finally { setSubmitting(false); }
  }

  if (!session) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin" /></div>;
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault(); setSubmitting(true);
    try {
      const res = await fetch("/api/member/profile", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: session?.id, ...profileForm }),
      });
      const data = await res.json();
      if (res.ok) {
        const updated = { ...session, ...data };
        localStorage.setItem("member_session", JSON.stringify(updated));
        setSession(updated);
        toast.success("प्रोफाइल अपडेट भयो!");
        setProfileForm((f) => ({ ...f, currentPassword: "", newPassword: "" }));
      } else toast.error(data.error || "त्रुटि भयो।");
    } catch { toast.error("सर्भर त्रुटि।"); } finally { setSubmitting(false); }
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "overview",   label: "डासबोर्ड",  icon: <Home className="w-4 h-4" /> },
    { key: "activity",   label: "गतिविधि",   icon: <Bell className="w-4 h-4" /> },
    { key: "loans",      label: "ऋण आवेदन",  icon: <CreditCard className="w-4 h-4" /> },
    { key: "kyc",        label: "KYC",        icon: <FileText className="w-4 h-4" /> },
    { key: "grievance",  label: "शिकायत",    icon: <MessageSquare className="w-4 h-4" /> },
    { key: "profile",    label: "प्रोफाइल",  icon: <User className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[var(--brand-primary)] text-white flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:flex`}>
        <div className="p-5 border-b border-white/20 flex items-center justify-between">
          <div>
            <div className="font-bold text-lg">सदस्य पोर्टल</div>
            <div className="text-green-200 text-xs">Cooperative Society</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden"><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSidebarOpen(false); setTrackingResult(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left ${activeTab === tab.key ? "bg-white/20 text-white" : "text-green-100 hover:bg-white/10"}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/20">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-green-100 hover:bg-white/10 transition-colors">
            <LogOut className="w-4 h-4" /> लगआउट
          </button>
        </div>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <Bell className="w-5 h-5 text-gray-400" />
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-[var(--brand-primary)] font-bold text-sm">
              {session.name?.[0]?.toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">{session.name}</span>
          </div>
        </header>

        {/* Mobile tab bar */}
        <div className="lg:hidden flex overflow-x-auto bg-white border-b border-gray-200 gap-1 px-2 py-2 sticky top-14 z-20">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setTrackingResult(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${activeTab === tab.key ? "bg-[var(--brand-primary)] text-white" : "text-gray-600 hover:bg-gray-100"}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <main className="flex-1 p-4 md:p-6 max-w-4xl w-full mx-auto">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">नमस्ते, {session.name} 👋</h2>
                <p className="text-gray-500 text-sm mt-1">तपाईंको सदस्य डासबोर्डमा स्वागत छ।</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Card>
                  <CardBody className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-[var(--brand-primary)]"><User className="w-6 h-6" /></div>
                    <div>
                      <div className="text-xs text-gray-400">सदस्य नं.</div>
                      <div className="font-bold text-gray-900 font-mono">{session.sadasyataNumber || "N/A"}</div>
                    </div>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><CreditCard className="w-6 h-6" /></div>
                    <div>
                      <div className="text-xs text-gray-400">खाता स्थिति</div>
                      <StatusBadge status={session.approvalStatus || "pending"} />
                    </div>
                  </CardBody>
                </Card>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "ऋण आवेदन दिनुहोस्", icon: <CreditCard className="w-5 h-5" />, tab: "loans" as Tab },
                  { label: "शिकायत दर्ता", icon: <MessageSquare className="w-5 h-5" />, tab: "grievance" as Tab },
                  { label: "KYC अद्यावधिक", icon: <FileText className="w-5 h-5" />, tab: "kyc" as Tab },
                  { label: "प्रोफाइल हेर्नुहोस्", icon: <User className="w-5 h-5" />, tab: "profile" as Tab },
                ].map((item) => (
                  <button key={item.label} onClick={() => { setActiveTab(item.tab); setTrackingResult(null); }}
                    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-[var(--brand-primary)] hover:shadow-sm transition-all text-left group">
                    <div className="w-10 h-10 rounded-lg bg-green-50 group-hover:bg-[var(--brand-primary)] flex items-center justify-center text-[var(--brand-primary)] group-hover:text-white transition-colors">
                      {item.icon}
                    </div>
                    <span className="font-medium text-gray-800 text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* LOAN APPLICATION */}
          {activeTab === "loans" && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-5">ऋण आवेदन</h2>
              {trackingResult ? (
                <Card>
                  <CardBody className="text-center py-10">
                    <CheckCircle className="w-14 h-14 text-[var(--brand-primary)] mx-auto mb-3" />
                    <h3 className="font-bold text-lg mb-1">ऋण आवेदन दर्ता भयो!</h3>
                    <p className="text-gray-500 text-sm mb-3">ट्र्याकिङ आईडी:</p>
                    <div className="bg-green-50 border-2 border-[var(--brand-primary)] rounded-xl px-6 py-3 text-xl font-mono font-bold text-[var(--brand-primary)] inline-block mb-4">{trackingResult}</div>
                    <p className="text-xs text-gray-400">यो आईडी सुरक्षित राख्नुहोस्।</p>
                    <Button variant="outline" size="sm" className="mt-4" onClick={() => setTrackingResult(null)}>नयाँ आवेदन</Button>
                  </CardBody>
                </Card>
              ) : (
                <Card>
                  <CardBody>
                    <form onSubmit={submitLoan} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Input label="पूरा नाम *" required value={loanForm.fullName} onChange={(e) => setLoanForm({ ...loanForm, fullName: e.target.value })} />
                        <Input label="फोन नम्बर *" required value={loanForm.phone} onChange={(e) => setLoanForm({ ...loanForm, phone: e.target.value })} />
                      </div>
                      <Select label="ऋणको प्रकार *" required placeholder="-- छान्नुहोस् --" options={LOAN_TYPES}
                        value={loanForm.loanType} onChange={(e) => setLoanForm({ ...loanForm, loanType: e.target.value })} />
                      <Input label="ऋण रकम (रु.) *" type="number" required min="1000"
                        value={loanForm.loanAmount} onChange={(e) => setLoanForm({ ...loanForm, loanAmount: e.target.value })} placeholder="जस्तै: 100000" />
                      <Textarea label="ऋणको उद्देश्य" rows={3} value={loanForm.loanPurpose} onChange={(e) => setLoanForm({ ...loanForm, loanPurpose: e.target.value })} />
                      <Button type="submit" loading={submitting} className="w-full" size="lg">आवेदन दिनुहोस्</Button>
                    </form>
                  </CardBody>
                </Card>
              )}
            </div>
          )}

          {/* KYC */}
          {activeTab === "kyc" && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-5">KYC अद्यावधिक</h2>
              <Card>
                <CardBody>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 mb-5">
                    KYC फारम भर्नु अघि सबै आवश्यक कागजातहरू तयार राख्नुहोस्: नागरिकता, फोटो, पासपोर्ट साइज।
                  </div>
                  <form onSubmit={async (e) => {
                    e.preventDefault(); setSubmitting(true);
                    try {
                      const res = await fetch("/api/grievance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...kycForm, description: "KYC अद्यावधिकको लागि अनुरोध" }) });
                      const data = await res.json();
                      if (data.trackingId) { setTrackingResult(data.trackingId); toast.success("KYC अनुरोध दर्ता भयो!"); }
                      else toast.error(data.error || "त्रुटि भयो।");
                    } catch { toast.error("त्रुटि भयो।"); } finally { setSubmitting(false); }
                  }} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="पूरा नाम *" required value={kycForm.fullName} onChange={(e) => setKycForm({ ...kycForm, fullName: e.target.value })} />
                      <Input label="फोन *" required value={kycForm.phone} onChange={(e) => setKycForm({ ...kycForm, phone: e.target.value })} />
                    </div>
                    <Button type="submit" loading={submitting} className="w-full" size="lg">KYC अनुरोध पठाउनुहोस्</Button>
                  </form>
                </CardBody>
              </Card>
            </div>
          )}

          {/* GRIEVANCE */}
          {activeTab === "grievance" && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-5">शिकायत / गुनासो</h2>
              {trackingResult ? (
                <Card>
                  <CardBody className="text-center py-10">
                    <CheckCircle className="w-14 h-14 text-[var(--brand-primary)] mx-auto mb-3" />
                    <h3 className="font-bold text-lg mb-1">शिकायत दर्ता भयो!</h3>
                    <div className="bg-green-50 border-2 border-[var(--brand-primary)] rounded-xl px-6 py-3 text-xl font-mono font-bold text-[var(--brand-primary)] inline-block my-3">{trackingResult}</div>
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => setTrackingResult(null)}>नयाँ शिकायत</Button>
                  </CardBody>
                </Card>
              ) : (
                <Card>
                  <CardBody>
                    <form onSubmit={submitGrievance} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Input label="नाम *" required value={grievanceForm.name} onChange={(e) => setGrievanceForm({ ...grievanceForm, name: e.target.value })} />
                        <Input label="फोन" value={grievanceForm.phone} onChange={(e) => setGrievanceForm({ ...grievanceForm, phone: e.target.value })} />
                      </div>
                      <Input label="विषय *" required value={grievanceForm.subject} onChange={(e) => setGrievanceForm({ ...grievanceForm, subject: e.target.value })} />
                      <Textarea label="विवरण *" required rows={4} value={grievanceForm.description} onChange={(e) => setGrievanceForm({ ...grievanceForm, description: e.target.value })} />
                      <Button type="submit" loading={submitting} className="w-full" size="lg">शिकायत दर्ता गर्नुहोस्</Button>
                    </form>
                  </CardBody>
                </Card>
              )}
            </div>
          )}

          {/* ACTIVITY */}
          {activeTab === "activity" && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-5">मेरो गतिविधि</h2>
              {!activity ? (
                <div className="text-center py-10 text-gray-400">लोड हुँदैछ...</div>
              ) : (
                <div className="space-y-6">
                  {/* Loans */}
                  <Card>
                    <CardHeader><h3 className="font-semibold flex items-center gap-2"><CreditCard className="w-4 h-4" /> ऋण आवेदनहरू</h3></CardHeader>
                    <CardBody>
                      {activity.loans.length === 0 ? <p className="text-sm text-gray-400">कुनै आवेदन छैन।</p> : (
                        <div className="space-y-2">
                          {activity.loans.map((l: any) => (
                            <div key={l.id} className="flex items-center justify-between text-sm border-b border-gray-50 pb-2">
                              <div>
                                <span className="font-mono text-xs text-gray-400">{l.trackingId}</span>
                                <span className="ml-2 text-gray-700">{l.loanType}</span>
                              </div>
                              <StatusBadge status={l.status} />
                            </div>
                          ))}
                        </div>
                      )}
                    </CardBody>
                  </Card>
                  {/* Grievances */}
                  <Card>
                    <CardHeader><h3 className="font-semibold flex items-center gap-2"><MessageSquare className="w-4 h-4" /> शिकायतहरू</h3></CardHeader>
                    <CardBody>
                      {activity.grievances.length === 0 ? <p className="text-sm text-gray-400">कुनै शिकायत छैन।</p> : (
                        <div className="space-y-2">
                          {activity.grievances.map((g: any) => (
                            <div key={g.id} className="flex items-center justify-between text-sm border-b border-gray-50 pb-2">
                              <div>
                                <span className="font-mono text-xs text-gray-400">{g.trackingId}</span>
                                <span className="ml-2 text-gray-700 line-clamp-1">{g.subject}</span>
                              </div>
                              <StatusBadge status={g.status} />
                            </div>
                          ))}
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* PROFILE */}
          {activeTab === "profile" && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-5">मेरो प्रोफाइल</h2>
              <div className="space-y-5">
                {/* Info card */}
                <Card>
                  <CardBody>
                    <div className="flex items-center gap-4 pb-5 mb-5 border-b border-gray-100">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-[var(--brand-primary)] font-bold text-2xl">
                        {session.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">{session.name}</div>
                        <div className="text-gray-500 text-sm">{session.email}</div>
                        <StatusBadge status={session.approvalStatus || "pending"} />
                      </div>
                    </div>
                    <dl className="space-y-2 text-sm">
                      {[
                        { label: "सदस्य नं.", value: session.sadasyataNumber },
                        { label: "कार्ड नं.", value: session.memberCardNo },
                        { label: "फोन", value: session.phone },
                        { label: "इमेल", value: session.email },
                      ].map((item) => item.value && (
                        <div key={item.label} className="flex justify-between py-2 border-b border-gray-50">
                          <dt className="text-gray-500">{item.label}</dt>
                          <dd className="font-medium text-gray-900">{item.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </CardBody>
                </Card>
                {/* Edit form */}
                <Card>
                  <CardHeader><h3 className="font-semibold">प्रोफाइल सम्पादन</h3></CardHeader>
                  <CardBody>
                    <form onSubmit={saveProfile} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Input label="नाम *" required value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
                        <Input label="फोन *" required value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Input label="ठेगाना" value={profileForm.address} onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} />
                        <Select label="लिङ्ग" value={profileForm.gender} onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                          placeholder="-- छान्नुहोस् --"
                          options={[{ value: "male", label: "पुरुष" }, { value: "female", label: "महिला" }, { value: "other", label: "अन्य" }]} />
                      </div>
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-xs text-gray-500 mb-3">पासवर्ड परिवर्तन (वैकल्पिक)</p>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <Input label="पुरानो पासवर्ड" type="password" value={profileForm.currentPassword} onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })} />
                          <Input label="नयाँ पासवर्ड" type="password" value={profileForm.newPassword} onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })} />
                        </div>
                      </div>
                      <Button type="submit" loading={submitting}>सुरक्षित गर्नुहोस्</Button>
                    </form>
                  </CardBody>
                </Card>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
