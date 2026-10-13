import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // AGENTS.md is a curated, competition-reviewed agent document; `next dev`
  // must not inject its own managed block into it.
  agentRules: false,
  poweredByHeader: false,
  // Baseline security headers for every route (BLOCK 53).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
          },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Microphone/camera/location are off until a reviewed feature needs them.
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
