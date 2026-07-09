import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(process.cwd(), "src"),
      "@nestia/fetcher$": path.resolve(
        process.cwd(),
        "node_modules/@nestia/fetcher/lib/index.js",
      ),
    };
    return config;
  },
};

export default nextConfig;
