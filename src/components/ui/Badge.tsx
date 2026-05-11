import { cn } from "@/lib/utils";
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

type StatusType = "pending" | "approved" | "rejected" | "in_review" | "closed" | "active" | "inactive";

const statusConfig: Record<StatusType, { label: string; className: string; icon: React.ReactNode }> = {
  pending:   { label: "विचाराधीन", className: "bg-amber-100 text-amber-700 border-amber-200",   icon: <Clock className="w-3 h-3" /> },
  approved:  { label: "स्वीकृत",   className: "bg-green-100 text-green-700 border-green-200",   icon: <CheckCircle className="w-3 h-3" /> },
  rejected:  { label: "अस्वीकृत", className: "bg-red-100 text-red-700 border-red-200",         icon: <XCircle className="w-3 h-3" /> },
  in_review: { label: "समीक्षामा", className: "bg-blue-100 text-blue-700 border-blue-200",      icon: <AlertCircle className="w-3 h-3" /> },
  closed:    { label: "बन्द",      className: "bg-gray-100 text-gray-600 border-gray-200",      icon: <XCircle className="w-3 h-3" /> },
  active:    { label: "सक्रिय",    className: "bg-green-100 text-green-700 border-green-200",   icon: <CheckCircle className="w-3 h-3" /> },
  inactive:  { label: "निष्क्रिय", className: "bg-gray-100 text-gray-500 border-gray-200",     icon: <XCircle className="w-3 h-3" /> },
};

export function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status as StatusType] ?? {
    label: status,
    className: "bg-gray-100 text-gray-600 border-gray-200",
    icon: <Clock className="w-3 h-3" />,
  };
  return (
    <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border", cfg.className)}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  color?: "green" | "blue" | "red" | "orange" | "gray";
  className?: string;
}

const badgeColors = {
  green:  "bg-green-100 text-green-700",
  blue:   "bg-blue-100 text-blue-700",
  red:    "bg-red-100 text-red-700",
  orange: "bg-orange-100 text-orange-700",
  gray:   "bg-gray-100 text-gray-600",
};

export function Badge({ children, color = "gray", className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold", badgeColors[color], className)}>
      {children}
    </span>
  );
}
