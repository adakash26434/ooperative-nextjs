import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXTAUTH_URL || "https://upakar.bandanasigdel.com.np";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/admin/", "/member/dashboard"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
