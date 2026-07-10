import withTtsc from "@ttsc/unplugin/next";
import type { NextConfig } from "next";

const nextConfig = {
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
} satisfies NextConfig;

export default withTtsc(nextConfig);
