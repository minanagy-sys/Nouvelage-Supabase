/**
 * Small in-memory TTL cache for public content reads. Admin writes call
 * invalidate() with the affected table so the public site reflects edits
 * immediately, while anonymous traffic never stampedes the database.
 */
const store = new Map();

const DEFAULT_TTL_MS = 60_000;

export function cached(key, ttlMs, producer) {
  const hit = store.get(key);
  if (hit && hit.expires > Date.now()) return hit.value;
  const value = producer();
  store.set(key, { value, expires: Date.now() + (ttlMs ?? DEFAULT_TTL_MS) });
  // Cache the promise itself so concurrent requests share one query, but a
  // failed lookup must not be served for the whole TTL.
  if (value && typeof value.then === 'function') {
    value.catch(() => store.delete(key));
  }
  return value;
}

export function invalidate(prefix) {
  if (!prefix) {
    store.clear();
    return;
  }
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}
