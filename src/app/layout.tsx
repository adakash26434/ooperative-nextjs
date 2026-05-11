import type { Metadata } from "next";
import { Noto_Sans_Devanagari, Mukta } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const mukta = Mukta({
  variable: "--font-mukta",
  subsets: ["devanagari", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const notoSans = Noto_Sans_Devanagari({
  variable: "--font-noto",
  subsets: ["devanagari"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "सहकारी संस्था — Cooperative Society",
  description: "आकाश बचत तथा ऋण सहकारी संस्था — Banking & Financial Services",
  keywords: "cooperative, sahakari, banking, loan, savings, Nepal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ne">
      <body className={`${mukta.variable} ${notoSans.variable} antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
