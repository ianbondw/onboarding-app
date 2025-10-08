/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      boxShadow: {
        card: "0 6px 30px -12px rgba(2, 6, 23, 0.25)",
      },
    },
  },
  plugins: [],
};