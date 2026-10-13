import type { MetadataRoute } from "next";

const base = process.env.APP_BASE_URL ?? "http://localhost:3000";

/** Public pages only. Learner sessions, profiles and history are never listed. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: base, changeFrequency: "weekly", priority: 1 }];
}
