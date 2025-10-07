// next.config.ts
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Optional: silences the extra lockfile warning below by telling Next
  // what you consider the project root for tracing.
  outputFileTracingRoot: path.join(__dirname), // your app folder
  // reactStrictMode: true, // optional
};

export default nextConfig;