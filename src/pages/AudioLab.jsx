import { useState, useEffect } from "react";

/**
 * Blind TTS bake-off. Dev-only — never registered in a production build.
 *
 * Plays the same sample chunk from each provider, labelled A/B/C/D in a random
 * order, so the choice is made on the voice rather than on the brand name.
 *
 *   node scripts/tts/generate.mjs --slug bond-broccoli --provider <p> --sample
 *   npm run dev -- --host      # then open the LAN URL on your phone
 */
const PROVIDERS = [
  { id: "elevenlabs", label: "ElevenLabs — Multilingual v2 (Daniel)", cost: "$5–6 for one month. Free tier can't cover the full piece and bars commercial use." },
  { id: "openai", label: "OpenAI — gpt-4o-mini-tts (Onyx)", cost: "≈$0.35, one-time. No free tier." },
  { id: "gemini", label: "Gemini — 2.5 Flash TTS (Charon)", cost: "Free (AI Studio key)." },
  { id: "googlecloud", label: "Google Cloud — Chirp 3 HD (en-GB Charon)", cost: "Free — 1M chars/mo, this piece uses 2%." },
];

// Shuffled once, at load, so the running order can't bias the ear.
const ORDER = (() => {
  const a = [...PROVIDERS];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
})();

const LETTERS = ["A", "B", "C", "D"];
const SLUG = "bond-broccoli";

export default function AudioLab() {
  const [available, setAvailable] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [picked, setPicked] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      ORDER.map((p) =>
        fetch(`/audio/samples/${SLUG}.${p.id}.mp3`, { method: "HEAD" })
          .then((r) => (r.ok ? p.id : null))
          .catch(() => null)
      )
    ).then((ids) => !cancelled && setAvailable(ids.filter(Boolean)));
    return () => { cancelled = true; };
  }, []);

  const ready = ORDER.filter((p) => available?.includes(p.id));

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0c", color: "#f2efe9", padding: "48px 20px 80px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 30, margin: "0 0 8px" }}>TTS bake-off</h1>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: "#c9c4ba", margin: "0 0 6px" }}>
          The same passage — the headline, the standfirst, and Chapter Zero — read by each engine.
          Labels are hidden and the order is shuffled. Listen on the phone you'd actually read this on,
          then reveal.
        </p>
        <p style={{ fontSize: 14, color: "#87827a", margin: "0 0 36px" }}>
          Judge: does it sound like a person reading, or a machine pronouncing? Listen for the proper
          nouns (Broccoli, Danjaq, 007), the em-dashes, and whether it rushes the full stops.
        </p>

        {available === null && <p style={{ color: "#87827a" }}>Looking for samples…</p>}

        {available !== null && ready.length === 0 && (
          <div style={{ padding: 20, border: "1px solid #2a2a30", borderRadius: 10, background: "#17171b" }}>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "#c9c4ba" }}>
              No samples yet. Add keys to <code>.env.local</code>, then generate one per provider:
            </p>
            <pre style={{ margin: "12px 0 0", fontSize: 12, color: "#87827a", overflowX: "auto" }}>
{`node scripts/tts/generate.mjs --slug ${SLUG} --provider gemini --sample`}
            </pre>
          </div>
        )}

        {ready.map((p, i) => (
          <div
            key={p.id}
            style={{
              marginBottom: 18, padding: 18, borderRadius: 12,
              background: picked === p.id ? "#1e1e24" : "#17171b",
              border: `1px solid ${picked === p.id ? "#c9a227" : "#2a2a30"}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{
                width: 34, height: 34, borderRadius: 999, flex: "none",
                background: "#c9a227", color: "#0a0a0c", fontWeight: 700, fontSize: 15,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{LETTERS[i]}</span>
              <span style={{ fontSize: 16, color: revealed ? "#f2efe9" : "#87827a" }}>
                {revealed ? p.label : "Hidden until reveal"}
              </span>
            </div>

            <audio controls preload="none" src={`/audio/samples/${SLUG}.${p.id}.mp3`} style={{ width: "100%" }} />

            {revealed && (
              <p style={{ margin: "10px 0 0", fontSize: 14, color: "#87827a" }}>{p.cost}</p>
            )}

            <button
              type="button"
              onClick={() => setPicked(picked === p.id ? null : p.id)}
              style={{
                marginTop: 12, padding: "9px 16px", fontSize: 14, cursor: "pointer",
                borderRadius: 8, border: `1px solid ${picked === p.id ? "#c9a227" : "#2a2a30"}`,
                background: "transparent", color: picked === p.id ? "#c9a227" : "#c9c4ba",
              }}
            >
              {picked === p.id ? `${LETTERS[i]} is my pick` : `Pick ${LETTERS[i]}`}
            </button>
          </div>
        ))}

        {ready.length > 0 && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            style={{
              marginTop: 12, padding: "12px 20px", fontSize: 16, cursor: "pointer",
              borderRadius: 8, border: "1px solid #2a2a30", background: "#17171b", color: "#f2efe9",
            }}
          >
            {revealed ? "Hide the names again" : "Reveal which is which"}
          </button>
        )}
      </div>
    </div>
  );
}
