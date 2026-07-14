/** Shared fetch with retry. TTS endpoints rate-limit aggressively on free tiers. */
export async function postJson(url, { headers, body, accept = "application/json", retries = 4 }) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", accept, ...headers },
      body: JSON.stringify(body),
    });

    if (res.ok) return res;

    const retryable = res.status === 429 || res.status >= 500;
    const text = await res.text().catch(() => "");
    if (!retryable || attempt >= retries) {
      throw new Error(`${res.status} ${res.statusText} — ${text.slice(0, 400)}`);
    }
    // Honour Retry-After when present, else exponential backoff.
    const wait = Number(res.headers.get("retry-after")) * 1000 || 2000 * 2 ** attempt;
    process.stderr.write(`    ${res.status}; retrying in ${Math.round(wait / 1000)}s\n`);
    await new Promise((r) => setTimeout(r, wait));
  }
}
