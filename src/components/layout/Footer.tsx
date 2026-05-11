import Link from "next/link";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[var(--brand-primary)] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                स
              </div>
              <div>
                <div className="font-bold leading-tight">सहकारी संस्था</div>
                <div className="text-green-200 text-xs">Cooperative Society Ltd.</div>
              </div>
            </div>
            <p className="text-green-100 text-sm leading-relaxed">
              समुदायमा आधारित सक्षम र दिगो वित्तीय सहकारी संस्था।
            </p>
            <div className="flex gap-3 mt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                <FacebookIcon />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                <YoutubeIcon />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold mb-4 text-green-100">त्वरित लिंकहरू</h4>
            <ul className="space-y-2 text-sm text-green-100">
              {[
                { label: "हाम्रो बारेमा", href: "/about" },
                { label: "सेवाहरू", href: "/services" },
                { label: "ब्याज दर", href: "/interest-rates" },
                { label: "समाचार", href: "/news" },
                { label: "सूचना", href: "/notices" },
                { label: "ग्यालरी", href: "/gallery" },
                { label: "सम्मान / पुरस्कार", href: "/awards" },
                { label: "विनिमय दर", href: "/exchange-rate" },
                { label: "महत्त्वपूर्ण लिंक", href: "/important-links" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors flex items-center gap-1">
                    <span className="text-green-300">›</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-4 text-green-100">सदस्य सेवाहरू</h4>
            <ul className="space-y-2 text-sm text-green-100">
              {[
                { label: "सदस्यता", href: "/member/login" },
                { label: "ऋण आवेदन", href: "/loan-apply" },
                { label: "KYC फारम", href: "/online-kyc" },
                { label: "खाता खोल्नुहोस्", href: "/online-account" },
                { label: "शिकायत", href: "/grievance" },
                { label: "डाउनलोड", href: "/downloads" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors flex items-center gap-1">
                    <span className="text-green-300">›</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-green-100">सम्पर्क</h4>
            <ul className="space-y-3 text-sm text-green-100">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-green-300" />
                काठमाडौं, नेपाल
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-green-300" />
                <a href="tel:061590067" className="hover:text-white">061-590067</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-green-300" />
                <a href="mailto:info@cooperative.com.np" className="hover:text-white">
                  info@cooperative.com.np
                </a>
              </li>
              <li className="flex items-center gap-2 text-xs text-green-200">
                आइत–शुक्र: बिहान १०:०० – साँझ ५:००
              </li>
            </ul>
            <div className="mt-4 flex gap-2">
              <a href="#" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded text-xs font-medium transition-colors">
                <ExternalLink className="w-3 h-3" /> Internet Banking
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-green-200">
          <p>© {year} सहकारी संस्था लि. सर्वाधिकार सुरक्षित।</p>
          <div className="flex gap-4">
            <Link href="/notices" className="hover:text-white transition-colors">गोपनीयता नीति</Link>
            <Link href="/contact" className="hover:text-white transition-colors">सम्पर्क</Link>
            <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
