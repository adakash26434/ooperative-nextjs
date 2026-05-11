"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, CreditCard, FileText,
  Bell, Settings, LogOut, Menu, X, MessageSquare,
  Briefcase, Download, Image, BookOpen, Shield,
} from "lucide-react";
import { toast } from "sonner";

const navItems = [
  { href: "/admin/dashboard",       label: "डासबोर्ड",      icon: <LayoutDashboard className="w-4 h-4" /> },
  { href: "/admin/members",         label: "सदस्यहरू",      icon: <Users className="w-4 h-4" /> },
  { href: "/admin/loans",           label: "ऋण आवेदन",      icon: <CreditCard className="w-4 h-4" /> },
  { href: "/admin/kyc",             label: "KYC",            icon: <FileText className="w-4 h-4" /> },
  { href: "/admin/grievances",      label: "शिकायतहरू",     icon: <MessageSquare className="w-4 h-4" /> },
  { href: "/admin/notices",         label: "सूचनाहरू",      icon: <Bell className="w-4 h-4" /> },
  { href: "/admin/news",            label: "समाचार",         icon: <BookOpen className="w-4 h-4" /> },
  { href: "/admin/interest-rates",  label: "ब्याज दर",      icon: <CreditCard className="w-4 h-4" /> },
  { href: "/admin/team",            label: "टोली",           icon: <Users className="w-4 h-4" /> },
  { href: "/admin/gallery",         label: "ग्यालरी",       icon: <Image className="w-4 h-4" /> },
  { href: "/admin/careers",         label: "क्यारियर",      icon: <Briefcase className="w-4 h-4" /> },
  { href: "/admin/downloads",       label: "डाउनलोड",       icon: <Download className="w-4 h-4" /> },
  { href: "/admin/settings",        label: "सेटिङ",         icon: <Settings className="w-4 h-4" /> },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("admin_session");
    if (!stored) { router.push("/admin/login"); return; }
    setAdmin(JSON.parse(stored));
  }, [router]);

  function logout() {
    localStorage.removeItem("admin_session");
    toast.success("लगआउट भयो।");
    router.push("/admin/login");
  }

  if (!admin) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-60 bg-gray-900 text-white flex flex-col transition-transform duration-300",
        "lg:translate-x-0 lg:static",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)] flex items-center justify-center"><Shield className="w-4 h-4" /></div>
            <div>
              <div className="font-bold text-sm">Admin Panel</div>
              <div className="text-gray-400 text-xs">Cooperative</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active ? "bg-[var(--brand-primary)] text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white")}>
                {item.icon} {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-2 border-t border-gray-700">
          <div className="px-3 py-2 text-xs text-gray-500 truncate">{admin.fullName}</div>
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" /> लगआउट
          </button>
        </div>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 h-14 px-4 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-sm">
              {admin.fullName?.[0]?.toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">{admin.fullName}</span>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
