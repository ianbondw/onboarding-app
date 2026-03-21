// next.config.ts
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Keep your existing tracing root
  outputFileTracingRoot: path.join(__dirname),

  // Security headers (easy win)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },

  // Silence the noisy Prisma/OpenTelemetry warning while keeping Sentry
  webpack: (config) => {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /@opentelemetry\/instrumentation/ },
    ];
    return config;
  },
};

export default nextConfig;
