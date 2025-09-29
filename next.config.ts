import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    tsconfigPaths: true, // makes @/* work on Vercel build
  },
};

export default nextConfig;