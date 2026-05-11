"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard } from "@/components/ui/Card";
import { Users, CreditCard, FileText, MessageSquare, Clock } from "lucide-react";
import Link from "next/link";

interface Stats {
  totalMembers: number; pendingMembers: number;
  totalLoans: number; pendingLoans: number;
  totalKyc: number; pendingKyc: number;
  totalGrievances: number; openGrievances: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard").then((r) => r.json()).then(setStats).catch(() => {});
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">डासबोर्ड</h1>
          <p className="text-gray-500 text-sm mt-1">सबै गतिविधिको सारांश</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="कुल सदस्य" value={stats?.totalMembers ?? "—"} icon={<Users className="w-6 h-6" />} color="green"
            sub={stats ? `${stats.pendingMembers} विचाराधीन` : undefined} />
          <StatCard title="ऋण आवेदन" value={stats?.totalLoans ?? "—"} icon={<CreditCard className="w-6 h-6" />} color="blue"
            sub={stats ? `${stats.pendingLoans} नयाँ` : undefined} />
          <StatCard title="KYC आवेदन" value={stats?.totalKyc ?? "—"} icon={<FileText className="w-6 h-6" />} color="orange"
            sub={stats ? `${stats.pendingKyc} विचाराधीन` : undefined} />
          <StatCard title="शिकायतहरू" value={stats?.totalGrievances ?? "—"} icon={<MessageSquare className="w-6 h-6" />} color="red"
            sub={stats ? `${stats.openGrievances} खुला` : undefined} />
        </div>

        {/* Pending alerts */}
        {stats && (stats.pendingMembers > 0 || stats.pendingLoans > 0 || stats.openGrievances > 0) && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2"><Clock className="w-4 h-4" /> ध्यान दिनुपर्ने</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {stats.pendingMembers > 0 && (
                <Link href="/admin/members?status=pending" className="bg-white border border-amber-200 rounded-xl p-3 hover:shadow-sm transition-shadow text-center">
                  <div className="text-2xl font-bold text-amber-700">{stats.pendingMembers}</div>
                  <div className="text-xs text-amber-600 mt-0.5">सदस्य स्वीकृतिको लागि</div>
                </Link>
              )}
              {stats.pendingLoans > 0 && (
                <Link href="/admin/loans?status=pending" className="bg-white border border-amber-200 rounded-xl p-3 hover:shadow-sm transition-shadow text-center">
                  <div className="text-2xl font-bold text-amber-700">{stats.pendingLoans}</div>
                  <div className="text-xs text-amber-600 mt-0.5">ऋण आवेदन बाँकी</div>
                </Link>
              )}
              {stats.openGrievances > 0 && (
                <Link href="/admin/grievances?status=pending" className="bg-white border border-amber-200 rounded-xl p-3 hover:shadow-sm transition-shadow text-center">
                  <div className="text-2xl font-bold text-amber-700">{stats.openGrievances}</div>
                  <div className="text-xs text-amber-600 mt-0.5">शिकायत खुला</div>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Quick links grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { label: "सदस्यहरू",   href: "/admin/members",        icon: <Users className="w-6 h-6" /> },
            { label: "ऋण आवेदन",  href: "/admin/loans",          icon: <CreditCard className="w-6 h-6" /> },
            { label: "शिकायत",    href: "/admin/grievances",     icon: <MessageSquare className="w-6 h-6" /> },
            { label: "सेटिङ",     href: "/admin/settings",       icon: <FileText className="w-6 h-6" /> },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center gap-3 hover:shadow-md hover:border-[var(--brand-primary)] transition-all group text-center">
              <div className="w-12 h-12 rounded-xl bg-green-50 group-hover:bg-[var(--brand-primary)] flex items-center justify-center text-[var(--brand-primary)] group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <span className="text-sm font-semibold text-gray-700">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
