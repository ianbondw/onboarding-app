export function GET() {
  const site = "https://marengofinance.com";
  return new Response(
    `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\nSitemap: ${site}/sitemap.xml\n`,
    {
      headers: { "Content-Type": "text/plain" },
    }
  );
}
