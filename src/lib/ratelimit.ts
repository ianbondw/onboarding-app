// src/lib/rateLimit.ts
const WINDOW_MS = 60_000; // 1 minute
const MAX = 60;           // 60 requests / minute / key
const store = new Map<string, number[]>();

export function rateLimit(key: string, max = MAX, windowMs = WINDOW_MS) {
  const now = Date.now();
  const hits = (store.get(key) || []).filter((t) => now - t < windowMs);
  if (hits.length >= max) {
    const resetIn = windowMs - (now - hits[0]);
    return { ok: false, resetIn };
  }
  hits.push(now);
  store.set(key, hits);
  return { ok: true, remaining: max - hits.length };
}