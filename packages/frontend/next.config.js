/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_HOST:
      process.env.NEXT_PUBLIC_API_HOST || "http://127.0.0.1:37001",
  },
};

module.exports = nextConfig;
