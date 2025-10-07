export const metadata = {
  title: "Onboarding App",
  description: "Client onboarding wizard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const domain = process.env.PLAUSIBLE_DOMAIN;
  return (
    <html lang="en">
      <head>
        {domain ? (
          <script defer data-domain={domain} src="https://plausible.io/js/script.js" />
        ) : null}
      </head>
      <body className="min-h-screen bg-white text-gray-900">{children}</body>
    </html>
  );
}