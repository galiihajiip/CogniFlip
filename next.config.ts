import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // AGENTS.md is a curated, competition-reviewed agent document; `next dev`
  // must not inject its own managed block into it.
  agentRules: false,
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
