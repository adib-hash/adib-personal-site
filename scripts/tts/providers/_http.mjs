/** Shared fetch with retry. TTS endpoints rate-limit aggressively on free tiers. */
export async function postJson(url, { headers, body, accept = "application/json", retries = 4 }) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", accept, ...headers },
      body: JSON.stringify(body),
    });

    if (res.ok) return res;

    // Gemini's preview TTS intermittently returns 400 INVALID_ARGUMENT on a
    // request that succeeds verbatim on the very next try (~1 in 4 on the free
    // tier). Treat 400 as transient too — but retry it FAST: unlike a 429, an
    // immediate retry clears it. 429/5xx remain real rate-limit/outage windows.
    const transient = res.status === 400;
    const retryable = res.status === 429 || res.status >= 500 || transient;
    const text = await res.text().catch(() => "");
    if (!retryable || attempt >= retries) {
      throw new Error(`${res.status} ${res.statusText} — ${text.slice(0, 400)}`);
    }
    // Honour Retry-After when present, else back off in long steps. Rate-limit
    // windows here are per-minute and rolling, and rejected attempts count
    // against them — short retries just re-trip the same window, so patience
    // beats persistence: 15s, 30s, 60s, 120s, 240s. A transient 400 is not a
    // rate-limit, so it skips the long backoff and retries in 2s.
    const wait = transient
      ? 2000
      : Number(res.headers.get("retry-after")) * 1000 || 15000 * 2 ** attempt;
    process.stderr.write(`    ${res.status}; retrying in ${Math.round(wait / 1000)}s\n`);
    await new Promise((r) => setTimeout(r, wait));
  }
}
