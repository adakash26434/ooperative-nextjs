import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXTAUTH_URL || "https://upakar.bandanasigdel.com.np";

  const staticPages = [
    "/", "/about", "/institutional-profile", "/committees", "/team",
    "/services", "/digital-services", "/interest-rates",
    "/news", "/notices", "/gallery", "/downloads", "/faqs",
    "/careers", "/contact", "/service-centers",
    "/awards", "/exchange-rate", "/partner-facilities", "/important-links",
    "/loan-apply", "/online-account", "/online-kyc", "/appointment",
    "/grievance", "/track-application", "/emi-calculator", "/date-converter",
    "/member/login",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));

  let newsPages: MetadataRoute.Sitemap = [];
  try {
    const news = await prisma.news.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } });
    newsPages = news.map((n) => ({
      url: `${base}/news/${n.slug}`,
      lastModified: n.updatedAt ?? new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {}

  return [...staticPages, ...newsPages];
}
