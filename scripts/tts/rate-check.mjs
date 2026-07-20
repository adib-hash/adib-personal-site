/**
 * Rate check — flags chapters whose narration pace drifts from the piece.
 *
 *   node scripts/tts/rate-check.mjs <slug>
 *
 * Reads the manifest (per-chapter offsets) and the script (spoken text) and
 * reports each chapter's speaking rate in chars/sec and approx words/min. A
 * chapter more than TOL from the median is flagged FAST/SLOW — the symptom of
 * Gemini rushing an over-long chunk. The fix is a smaller MAX_SYNTH_CHARS in
 * generate.mjs (sub-chunk the long chapter) and re-synthesis. Exits non-zero if
 * anything is flagged, so it can gate the verify step.
 */
import { readFileSync } from "node:fs";
import { renderChunks } from "./render.mjs";

const TOL = 0.12;             // >12% off the median reads as a pace break
const CHARS_PER_WORD = 5.3;   // avg incl. spaces, for a wpm approximation

const slug = process.argv[2] ?? "bond-broccoli";
const man = JSON.parse(readFileSync(`src/data/audio/${slug}.json`, "utf8"));
const script = JSON.parse(readFileSync(`src/data/audio/${slug}.script.json`, "utf8"));
const chars = Object.fromEntries(renderChunks(script).map((c) => [c.id, c.text.length]));

const rows = man.chapters.map((c) => {
  const dur = c.end - c.start;
  const n = chars[c.id] ?? 0;
  return { id: c.id, num: c.num, title: c.title, dur, chars: n, cps: n / dur, wpm: (n / CHARS_PER_WORD) / (dur / 60) };
});
const sorted = rows.map((r) => r.cps).sort((a, b) => a - b);
const median = sorted[Math.floor(sorted.length / 2)];

console.log(`rate check: ${slug} — ${rows.length} chapters, median ${median.toFixed(2)} c/s\n`);
console.log(`  ${"ch".padEnd(4)} ${"num".padStart(3)}  ${"mm:ss".padStart(6)} ${"chars".padStart(6)} ${"c/s".padStart(6)} ${"wpm".padStart(5)} ${"vs med".padStart(7)}  flag`);
let flagged = 0;
for (const r of rows) {
  const dev = r.cps / median - 1;
  const flag = Math.abs(dev) > TOL ? (dev > 0 ? "FAST" : "SLOW") : "";
  if (flag) flagged++;
  const mmss = `${Math.floor(r.dur / 60)}:${String(Math.round(r.dur % 60)).padStart(2, "0")}`;
  console.log(
    `  ${r.id.padEnd(4)} ${String(r.num).padStart(3)}  ${mmss.padStart(6)} ${String(r.chars).padStart(6)} ` +
    `${r.cps.toFixed(2).padStart(6)} ${r.wpm.toFixed(0).padStart(5)} ${((dev * 100 >= 0 ? "+" : "") + (dev * 100).toFixed(0) + "%").padStart(7)}  ${flag}`
  );
}
console.log(flagged
  ? `\n${flagged} chapter(s) >${TOL * 100}% off median — re-synth (lower MAX_SYNTH_CHARS if a long chapter is rushing).`
  : `\nall chapters within ${TOL * 100}% of median — pace is consistent ✓`);
process.exit(flagged ? 1 : 0);
