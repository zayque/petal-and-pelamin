import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  experimental: {
    // admin image uploads go through server actions (5 MB max + form overhead)
    serverActions: { bodySizeLimit: "6mb" },
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
