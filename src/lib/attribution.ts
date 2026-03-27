export const ATTRIBUTION_PARAM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "li_fat_id",
] as const;

export type AttributionKey = (typeof ATTRIBUTION_PARAM_KEYS)[number];

export function extractAttribution(searchParams: URLSearchParams) {
  const attribution: Partial<Record<AttributionKey, string>> = {};

  for (const key of ATTRIBUTION_PARAM_KEYS) {
    const value = searchParams.get(key)?.trim();
    if (value) attribution[key] = value;
  }

  return attribution;
}

export function appendAttributionParams(href: string, searchParams: URLSearchParams) {
  if (/^(https?:|mailto:)/i.test(href)) return href;

  const [hrefWithoutHash, hash = ""] = href.split("#");
  const url = new URL(hrefWithoutHash || "/", "https://marengofinance.com");

  for (const key of ATTRIBUTION_PARAM_KEYS) {
    const value = searchParams.get(key)?.trim();
    if (value && !url.searchParams.has(key)) {
      url.searchParams.set(key, value);
    }
  }

  const query = url.searchParams.toString();
  const normalized = `${url.pathname}${query ? `?${query}` : ""}`;
  return hash ? `${normalized}#${hash}` : normalized;
}
