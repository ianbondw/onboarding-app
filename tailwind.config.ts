// tailwind.config.ts (root)
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: { 600: "#1f2937" }, // optional
      },
      boxShadow: {
        card: "0 6px 30px -12px rgba(2, 6, 23, 0.25)",
      },
    },
  },
  plugins: [],
} satisfies Config;