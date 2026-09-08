import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  images: { formats: ["image/avif", "image/webp"] },
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
    serverActions: {
      bodySizeLimit: "5mb", // match your Blob max if you want
    },
  },
};
export default nextConfig;
