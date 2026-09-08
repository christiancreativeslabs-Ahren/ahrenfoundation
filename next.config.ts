import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
    serverActions: {
      bodySizeLimit: "5mb", // match your Blob max if you want
    },
  },
};
export default nextConfig;
