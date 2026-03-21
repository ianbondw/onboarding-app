const defaultSiteOrigin = "https://marengofinance.com";
const defaultAdminOrigin = "https://marengofinance-admin.com";
const fallbackMailbox = "support@marengofinance.com";

function clean(value: string | undefined | null, fallback = "") {
  return (value || "").trim() || fallback;
}

function origin(value: string | undefined | null, fallback: string) {
  return clean(value, fallback).replace(/\/+$/, "");
}

export const SITE_ORIGIN = origin(process.env.NEXT_PUBLIC_SITE_ORIGIN, defaultSiteOrigin);
export const ADMIN_ORIGIN = origin(process.env.NEXT_PUBLIC_ADMIN_ORIGIN, defaultAdminOrigin);
export const APP_ORIGIN = clean(process.env.NEXT_PUBLIC_APP_ORIGIN).replace(/\/+$/, "");

const defaultContact = clean(process.env.CONTACT_TO, fallbackMailbox);

export const SALES_EMAIL = clean(process.env.CONTACT_TO, defaultContact);
export const PRIVACY_EMAIL = clean(process.env.PRIVACY_CONTACT_EMAIL, defaultContact);
export const LEGAL_EMAIL = clean(process.env.LEGAL_CONTACT_EMAIL, defaultContact);
export const SECURITY_EMAIL = clean(process.env.SECURITY_CONTACT_EMAIL, defaultContact);
export const TRUST_EMAIL = clean(process.env.TRUST_CONTACT_EMAIL, SECURITY_EMAIL || defaultContact);

export const LEGAL_LAST_UPDATED = "March 20, 2026";

export function toMailto(address: string, subject?: string) {
  const email = clean(address, defaultContact);
  if (!subject) return `mailto:${email}`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}
