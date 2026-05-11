import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div className={cn(
      "bg-white rounded-2xl border border-gray-100 shadow-sm",
      hover && "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200",
      className
    )}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-6 py-4 border-b border-gray-100", className)}>{children}</div>;
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: "green" | "blue" | "orange" | "red";
  sub?: string;
}

const colorMap = {
  green:  { bg: "bg-green-50",  icon: "text-[var(--brand-primary)]", border: "border-green-100" },
  blue:   { bg: "bg-blue-50",   icon: "text-blue-600",               border: "border-blue-100"  },
  orange: { bg: "bg-orange-50", icon: "text-orange-600",             border: "border-orange-100"},
  red:    { bg: "bg-red-50",    icon: "text-red-600",                border: "border-red-100"   },
};

export function StatCard({ title, value, icon, color = "green", sub }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className={cn("bg-white rounded-2xl border p-5 flex items-center gap-4", c.border)}>
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", c.bg, c.icon)}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{title}</div>
        {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}
