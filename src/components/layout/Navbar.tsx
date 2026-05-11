"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown, Phone, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "गृहपृष्ठ", labelEn: "Home", href: "/" },
  {
    label: "हाम्रो बारेमा", labelEn: "About", href: "/about",
    children: [
      { label: "परिचय", labelEn: "Introduction", href: "/about" },
      { label: "संस्थागत प्रोफाइल", labelEn: "Institutional Profile", href: "/institutional-profile" },
      { label: "डिजिटल सेवा", labelEn: "Digital Services", href: "/digital-services" },
      { label: "समिति", labelEn: "Committee", href: "/committees" },
      { label: "टोली", labelEn: "Team", href: "/team" },
    ],
  },
  {
    label: "सेवाहरू", labelEn: "Services", href: "/services",
    children: [
      { label: "सबै सेवाहरू", labelEn: "All Services", href: "/services" },
      { label: "ब्याज दर", labelEn: "Interest Rates", href: "/interest-rates" },
      { label: "ऋण आवेदन", labelEn: "Loan Apply", href: "/loan-apply" },
      { label: "भेटघाट बुकिङ", labelEn: "Appointment", href: "/appointment" },
    ],
  },
  {
    label: "सूचना", labelEn: "Notices", href: "/notices",
    children: [
      { label: "सूचना", labelEn: "Notices", href: "/notices" },
      { label: "समाचार", labelEn: "News", href: "/news" },
      { label: "डाउनलोड", labelEn: "Downloads", href: "/downloads" },
    ],
  },
  { label: "ग्यालरी", labelEn: "Gallery", href: "/gallery" },
  { label: "सम्पर्क अधिकारी", labelEn: "Contact Officer", href: "/contact" },
  { label: "थप", labelEn: "More", href: "#",
    children: [
      { label: "क्यारियर", labelEn: "Career", href: "/careers" },
      { label: "FAQs", labelEn: "FAQs", href: "/faqs" },
      { label: "सेवा केन्द्र", labelEn: "Service Centers", href: "/service-centers" },
      { label: "सम्मान / पुरस्कार", labelEn: "Awards", href: "/awards" },
      { label: "विनिमय दर", labelEn: "Exchange Rate", href: "/exchange-rate" },
      { label: "साझेदार सुविधा", labelEn: "Partner Facilities", href: "/partner-facilities" },
      { label: "महत्त्वपूर्ण लिंक", labelEn: "Important Links", href: "/important-links" },
      { label: "सहकारी कार्यक्रम", labelEn: "Programs", href: "/cooperative-programs" },
      { label: "निर्वाचन सूचना", labelEn: "Election Info", href: "/election-information" },
      { label: "भेन्डर सूचीकरण", labelEn: "Vendor Enlistment", href: "/vendor-enlistment" },
      { label: "सदस्य सर्वेक्षण", labelEn: "Member Survey", href: "/member-survey" },
      { label: "सदस्य कल्याण", labelEn: "Member Welfare", href: "/member-welfare" },
      { label: "सम्पर्क", labelEn: "Contact", href: "/contact" },
    ],
  },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [lang, setLang] = useState<"ne" | "en">("ne");

  const t = (item: { label: string; labelEn: string }) =>
    lang === "ne" ? item.label : item.labelEn;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top bar */}
      <div className="bg-[var(--brand-primary)] text-white text-xs py-1.5 px-4 hidden md:flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3" /> 061-590067
          </span>
          <span>info@cooperative.com.np</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === "ne" ? "en" : "ne")}
            className="flex items-center gap-1 hover:text-green-200 transition-colors"
          >
            <Globe className="w-3 h-3" />
            {lang === "ne" ? "EN" : "NP"}
          </button>
          <Link
            href="/member/login"
            className="bg-white/20 hover:bg-white/30 px-3 py-0.5 rounded text-xs font-medium transition-colors"
          >
            {lang === "ne" ? "लगिन" : "Login"}
          </Link>
        </div>
      </div>

      {/* Main nav */}
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--brand-primary)] flex items-center justify-center text-white font-bold text-lg">
            स
          </div>
          <div className="hidden sm:block">
            <div className="font-bold text-[var(--brand-primary)] leading-tight text-sm">
              सहकारी संस्था
            </div>
            <div className="text-xs text-gray-500">Cooperative Society Ltd.</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <li
              key={item.href}
              className="relative"
              onMouseEnter={() => item.children && setOpenDropdown(item.href)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  "text-gray-700 hover:text-[var(--brand-primary)] hover:bg-green-50"
                )}
              >
                {t(item)}
                {item.children && <ChevronDown className="w-3 h-3" />}
              </Link>
              {item.children && openDropdown === item.href && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-[var(--brand-primary)] transition-colors"
                    >
                      {lang === "ne" ? child.label : child.labelEn}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* CTA buttons */}
        <div className="hidden lg:flex items-center gap-2">
          <Link
            href="/loan-apply"
            className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            {lang === "ne" ? "ऋण आवेदन" : "Apply Loan"}
          </Link>
          <Link
            href="/member/login"
            className="border-2 border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            {lang === "ne" ? "लगिन" : "Login"}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pb-4">
          {navItems.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                className="block py-3 text-sm font-medium text-gray-800 border-b border-gray-100 hover:text-[var(--brand-primary)]"
                onClick={() => setMobileOpen(false)}
              >
                {t(item)}
              </Link>
              {item.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="block py-2 pl-4 text-sm text-gray-600 hover:text-[var(--brand-primary)]"
                  onClick={() => setMobileOpen(false)}
                >
                  — {lang === "ne" ? child.label : child.labelEn}
                </Link>
              ))}
            </div>
          ))}
          <div className="flex gap-2 mt-4">
            <Link
              href="/loan-apply"
              className="flex-1 text-center bg-[var(--brand-primary)] text-white py-2 rounded-lg text-sm font-semibold"
              onClick={() => setMobileOpen(false)}
            >
              ऋण आवेदन
            </Link>
            <Link
              href="/member/login"
              className="flex-1 text-center border-2 border-[var(--brand-primary)] text-[var(--brand-primary)] py-2 rounded-lg text-sm font-semibold"
              onClick={() => setMobileOpen(false)}
            >
              लगिन
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
