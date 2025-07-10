import type { NextConfig } from "next";

const withPWA = require("@ducanh2912/next-pwa").default({
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  cacheStartUrl: true,
  swcMinify: true,
  dest: "public",
  workboxOptions: {
    disableDevLogs: true,
  },
  register: true,
  reloadOnOnline: true,
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["cdn.sanity.io", "image.mux.com"],
    minimumCacheTTL: 345600, // 3 days
    formats: ["image/webp"],
    qualities: [75],
  },
};

export default withPWA(nextConfig);
