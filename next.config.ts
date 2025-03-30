import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["cdn.sanity.io", "image.mux.com"],
    minimumCacheTTL: 345600, // 3 days
    formats: ["image/webp"],
    qualities: [75],
  },
};

export default nextConfig;
