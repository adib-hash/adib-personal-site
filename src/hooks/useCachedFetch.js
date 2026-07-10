import { useState, useEffect } from "react";

const DEFAULT_TTL = 5 * 60 * 1000;

function readCache(key, ttl) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    return { data, isStale: Date.now() - timestamp > ttl };
  } catch {
    return null;
  }
}

function writeCache(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // sessionStorage full or unavailable — skip caching
  }
}

// Renders cached data instantly (if present) and revalidates in the
// background when the cache is missing or older than `ttl`.
export function useCachedFetch(url, ttl = DEFAULT_TTL) {
  const cacheKey = `cache:${url}`;
  const initial = readCache(cacheKey, ttl);

  const [data, setData] = useState(initial ? initial.data : null);
  const [loading, setLoading] = useState(!initial);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cached = readCache(cacheKey, ttl);
    let ignore = false;

    async function load() {
      if (!cached) setLoading(true);
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch ${url}`);
        const json = await res.json();
        if (ignore) return;
        setData(json);
        setError(null);
        writeCache(cacheKey, json);
      } catch (err) {
        if (!ignore && !cached) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    if (!cached || cached.isStale) {
      load();
    } else {
      setLoading(false);
    }

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ttl]);

  return { data, loading, error };
}
