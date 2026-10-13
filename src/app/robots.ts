import type { MetadataRoute } from "next";

const base = process.env.APP_BASE_URL ?? "http://localhost:3000";

/** Only public pages are indexable; APIs and any future private areas are not. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${base}/sitemap.xml`,
  };
}
