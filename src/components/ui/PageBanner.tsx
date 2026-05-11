import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Crumb { label: string; href?: string }

interface PageBannerProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  breadcrumbs?: Crumb[];
  className?: string;
}

export function PageBanner({ title, subtitle, icon, breadcrumbs, className }: PageBannerProps) {
  return (
    <section className={cn(
      "bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-light)] text-white py-10 md:py-14",
      className
    )}>
      <div className="container mx-auto px-4">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 text-xs text-green-200 mb-3 flex-wrap">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="w-3 h-3" />}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-white transition-colors">{crumb.label}</Link>
                ) : (
                  <span className="text-white font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <div className="flex items-center gap-3">
          {icon && <div className="opacity-90">{icon}</div>}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
            {subtitle && <p className="text-green-100 mt-1 text-sm md:text-base">{subtitle}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
