/** Shared fetch with retry. TTS endpoints rate-limit aggressively on free tiers. */
export async function postJson(url, { headers, body, accept = "application/json", retries = 6 }) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", accept, ...headers },
      body: JSON.stringify(body),
    });

    if (res.ok) return res;

    // Gemini's preview TTS intermittently returns 400 INVALID_ARGUMENT on a
    // request that succeeds verbatim on a later try. Treat 400 as transient.
    //
    // The failure probability scales with payload size, so it bites long chapter
    // pieces hardest. Measured 2026-08-30 on a warm key: a 1,455-char piece that
    // failed 6/6 at 1.5s spacing returned 400-then-200 at 20s spacing, and a
    // 2,900-char payload succeeded first try at 70s spacing. Short payloads
    // (~30 chars) never failed at any spacing. So the gap is what clears it, not
    // the retry count — which is why this backs off progressively rather than
    // hammering at a flat 2s.
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
    // rate-limit, so it uses its own gentler ladder: 5s, 10s, 20s, 40s, 80s, 90s.
    const wait = transient
      ? Math.min(90000, 5000 * 2 ** attempt)
      : Number(res.headers.get("retry-after")) * 1000 || 15000 * 2 ** attempt;
    process.stderr.write(`    ${res.status}; retrying in ${Math.round(wait / 1000)}s\n`);
    await new Promise((r) => setTimeout(r, wait));
  }
}
