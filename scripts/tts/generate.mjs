/**
 * Generates the narration audio for a research piece.
 *
 *   node scripts/tts/generate.mjs --slug bond-broccoli --provider gemini --sample
 *   node scripts/tts/generate.mjs --slug bond-broccoli --provider gemini --full
 *
 * --sample  synthesizes only the intro + chapter zero, for comparing voices.
 * --full    synthesizes the whole piece and writes the player's manifest.
 *
 * Synthesis is one chapter per file: Gemini drifts on long outputs, and
 * per-chapter files give exact chapter offsets for the scrub bar from any
 * provider without needing timestamp APIs. Those files are independent, so
 * several are synthesized at once (TTS_CONCURRENCY, default 4) and stitched
 * afterwards in input order.
 *
 * Two things make this survive flaky TTS:
 *   - A plausibility guard. Preview TTS models sometimes loop, emitting minutes
 *     of audio for a short chunk (observed: 655s for 1,182 chars). Any chunk
 *     outside a sane speaking-rate band is rejected and re-synthesized.
 *   - A content-hash cache. A chunk that already synthesized cleanly is reused,
 *     so re-running after one bad chunk only redoes that chunk, not all 14.
 */
import { readFileSync, writeFileSync, copyFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { renderChunks } from "./render.mjs";

const PROVIDERS = ["elevenlabs", "openai", "gemini", "googlecloud"];
const GAP_SECONDS = 0.7;   // breathing room between chapters
const BITRATE = "64k";     // CBR mono — plenty for speech, ~10MB for 22 min
const MIN_CPS = 6;         // below this a chunk has looped/garbled
const MAX_CPS = 40;        // above this it was truncated or came back near-empty
const MAX_TRIES = 4;
const MAX_SYNTH_CHARS = 3000; // Gemini's pace/quality drifts on long single
                              // outputs; split longer chapters at paragraph
                              // breaks so every synthesized piece reads at the
                              // same natural rate, then stitch them back.
const PARA_GAP = 0.45;        // pause stitched between a chapter's sub-pieces

// ---------- env ----------
// Keys are local-only. Nothing here is ever bundled or sent to Vercel.
function loadEnv() {
  const f = resolve(".env.local");
  if (!existsSync(f)) return;
  for (const line of readFileSync(f, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

// ---------- ffmpeg ----------
const ff = (args) => execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args], { stdio: ["ignore", "pipe", "pipe"] });

function probeDuration(file) {
  return parseFloat(execFileSync("ffprobe", [
    "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file,
  ], { encoding: "utf8" }).trim());
}

/** Normalize whatever the provider returned into a uniform, unpadded WAV. */
function toWav(raw, format, dest) {
  const ext = format === "mp3" ? "mp3" : format.startsWith("pcm_") ? "pcm" : format;
  const tmp = `${dest}.${ext}`;
  writeFileSync(tmp, raw);
  const input = format.startsWith("pcm_s16le_")
    ? ["-f", "s16le", "-ar", format.split("_").pop(), "-ac", "1", "-i", tmp]
    : ["-i", tmp];
  ff([...input, "-ar", "44100", "-ac", "1", "-c:a", "pcm_s16le", dest]);
  rmSync(tmp);
}

// ---------- cli ----------
loadEnv();
const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};

const slug = arg("slug", "bond-broccoli");
const providerId = arg("provider");
const full = args.includes("--full");
const sample = args.includes("--sample");

if (!PROVIDERS.includes(providerId) || (!full && !sample)) {
  console.error(`usage: generate.mjs --slug <slug> --provider <${PROVIDERS.join("|")}> (--sample | --full) [--voice <v>]`);
  process.exit(1);
}

const provider = await import(`./providers/${providerId}.mjs`);
const voice = arg("voice", provider.defaultVoice);
const apiKey = provider.envKey ? process.env[provider.envKey] : undefined;
if (provider.envKey && !apiKey) {
  console.error(`missing ${provider.envKey} — add it to .env.local`);
  process.exit(1);
}

// Cache variant: anything that changes the audio for identical text.
const variant = [providerId, voice, provider.model ?? ""].join("|");

// ---------- render ----------
const script = JSON.parse(readFileSync(`src/data/audio/${slug}.script.json`, "utf8"));
let chunks = renderChunks(script);
if (sample) chunks = chunks.filter((c) => c.id === "intro" || c.id === "ch0");

const chars = chunks.reduce((n, c) => n + c.text.length, 0);
console.log(`${provider.label}\n  voice: ${voice}\n  ${chunks.length} chunks, ${chars.toLocaleString()} chars${sample ? " (sample)" : ""}\n`);

const cacheDir = resolve(".tts-cache", slug);
mkdirSync(cacheDir, { recursive: true });
const work = resolve(".tts-work", `${slug}.${providerId}`);
rmSync(work, { recursive: true, force: true });
mkdirSync(work, { recursive: true });

// Split text into pieces <= MAX_SYNTH_CHARS on paragraph (\n\n) boundaries,
// never mid-paragraph. Short text returns [text] unchanged.
function splitForSynthesis(text) {
  if (text.length <= MAX_SYNTH_CHARS) return [text];
  const pieces = [];
  let buf = "";
  for (const para of text.split("\n\n")) {
    const cand = buf ? `${buf}\n\n${para}` : para;
    if (cand.length > MAX_SYNTH_CHARS && buf) { pieces.push(buf); buf = para; }
    else buf = cand;
  }
  if (buf) pieces.push(buf);
  return pieces;
}

// Split a piece roughly in half, preferring a paragraph break, then a sentence
// boundary. Returns null when the text is too small or has no seam to cut on.
function halve(text) {
  const mid = Math.floor(text.length / 2);
  const seams = [];
  for (const re of [/\n\n/g, /(?<=[.!?])\s+/g]) {
    let m;
    while ((m = re.exec(text))) seams.push({ i: m.index, len: m[0].length });
    if (seams.length) break; // paragraph breaks win outright if any exist
  }
  if (!seams.length) return null;
  const best = seams.reduce((a, b) => (Math.abs(b.i - mid) < Math.abs(a.i - mid) ? b : a));
  const head = text.slice(0, best.i).trim();
  const tail = text.slice(best.i + best.len).trim();
  return head && tail ? [head, tail] : null;
}

// Synthesize one piece, falling back to splitting it when the provider refuses
// the whole thing.
//
// Gemini's preview TTS rejects some payloads with 400 far more often than
// others, and the effect is specific to the exact text — a 1,455-char piece here
// failed every attempt across a 5s..80s backoff ladder, while its own halves
// each synthesized fine, and an unrelated 2,900-char payload succeeded first try
// at the same spacing. Rather than lower MAX_SYNTH_CHARS globally (which rekeys
// every cached piece and re-bills a finished run), cut only the piece that is
// actually stuck and stitch the halves back with the same paragraph gap used
// elsewhere. Recursion is depth-limited; the pace guard still applies per piece.
async function synthOne(text, destWav, label, depth = 0) {
  try {
    return await synthOneDirect(text, destWav, label);
  } catch (err) {
    const halves = depth < 3 ? halve(text) : null;
    if (!halves) throw err;
    process.stdout.write(`\n      splitting ${label ?? ""} (${text.length} chars) after repeated provider refusals ... `);
    const wavs = [];
    let secs = 0;
    for (let i = 0; i < halves.length; i++) {
      const sub = resolve(work, `split-${createHash("sha256").update(halves[i]).digest("hex").slice(0, 16)}.wav`);
      const r = await synthOne(halves[i], sub, `${label ?? ""}/${i + 1}`, depth + 1);
      secs += r.secs;
      wavs.push(sub);
    }
    const list = resolve(work, `splitlist-${createHash("sha256").update(text).digest("hex").slice(0, 16)}.txt`);
    const lines = [];
    wavs.forEach((w, i) => { lines.push(`file '${w}'`); if (i < wavs.length - 1) lines.push(`file '${paraGap}'`); });
    writeFileSync(list, lines.join("\n") + "\n");
    ff(["-f", "concat", "-safe", "0", "-i", list, "-c:a", "pcm_s16le", "-ar", "44100", "-ac", "1", destWav]);
    return { d: probeDuration(destWav), secs, attempt: 1 };
  }
}

// Synthesize one piece of text into destWav, guarded + retried (per-piece cps).
async function synthOneDirect(text, destWav, label) {
  for (let attempt = 1; attempt <= MAX_TRIES; attempt++) {
    const t0 = Date.now();
    const { audio, format } = await provider.synthesize(text, { voice, apiKey });
    toWav(audio, format, destWav);
    const d = probeDuration(destWav);
    const c = text.length / d;
    if (d > 0.5 && c >= MIN_CPS && c <= MAX_CPS) return { d, secs: (Date.now() - t0) / 1000, attempt };
    process.stdout.write(`\n      rejected: ${c.toFixed(1)} chars/s (${d.toFixed(0)}s)${label ? ` [${label}]` : ""} — retry ${attempt}/${MAX_TRIES} ... `);
  }
  rmSync(destWav, { force: true });
  throw new Error(`piece ${label ?? ""} failed the plausibility guard ${MAX_TRIES}x — provider kept looping/garbling`);
}

// ---------- synthesize (cache-aware, guarded, bounded-parallel) ----------
// Each chunk lands in its own cache file and is only stitched afterwards, so
// chunks have no ordering dependency on each other. Synthesis runs at roughly
// 2x realtime and is spent almost entirely waiting on the provider, so running
// a few at once turns wall-clock time from the sum of the chunks into about the
// sum divided by the pool size. Lower this if the provider starts returning
// 429s faster than its backoff clears them.
const CONCURRENCY = Math.max(1, Number(process.env.TTS_CONCURRENCY) || 4);

// Built once, before the pool starts: two chunks stitching sub-pieces at the
// same moment would otherwise race to create this file while ffmpeg reads it.
const paraGap = resolve(work, "paragap.wav");
ff(["-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", String(PARA_GAP), "-c:a", "pcm_s16le", paraGap]);

// Indexed rather than pushed: completion order varies with the pool, concat
// order must stay the order the chapters are read in.
const parts = new Array(chunks.length);

async function processChunk(chunk, i) {
  const head = `  [${String(i + 1).padStart(2)}/${chunks.length}] ${chunk.id.padEnd(6)} ${String(chunk.text.length).padStart(5)} chars ... `;
  const key = createHash("sha256").update(`${variant}\n${chunk.text}`).digest("hex").slice(0, 24);
  const cacheFile = resolve(cacheDir, `${key}.wav`);

  const chunkOk = (dur) => dur > 0.5 && chunk.text.length / dur >= MIN_CPS && chunk.text.length / dur <= MAX_CPS;
  let duration = existsSync(cacheFile) ? probeDuration(cacheFile) : 0;
  let note;

  if (duration && chunkOk(duration)) {
    note = `cached ${duration.toFixed(1)}s`;
  } else {
    if (duration) rmSync(cacheFile); // stale/bad cache entry
    const pieces = splitForSynthesis(chunk.text);
    if (pieces.length === 1) {
      const { d, secs, attempt } = await synthOne(chunk.text, cacheFile, chunk.id);
      duration = d;
      note = `${d.toFixed(1)}s (${secs.toFixed(1)}s${attempt > 1 ? `, try ${attempt}` : ""})`;
    } else {
      // Long chapter: synthesize each paragraph-group piece (cached per piece),
      // then stitch with a short pause so the pace stays natural throughout.
      const pieceWavs = [];
      let synthSecs = 0;
      for (let pi = 0; pi < pieces.length; pi++) {
        const pkey = createHash("sha256").update(`${variant}\n${pieces[pi]}`).digest("hex").slice(0, 24);
        const pfile = resolve(cacheDir, `${pkey}.wav`);
        const pd = existsSync(pfile) ? probeDuration(pfile) : 0;
        const pOk = pd > 0.5 && pieces[pi].length / pd >= MIN_CPS && pieces[pi].length / pd <= MAX_CPS;
        if (!pOk) {
          if (pd) rmSync(pfile);
          const { secs } = await synthOne(pieces[pi], pfile, `${chunk.id}.${pi + 1}`);
          synthSecs += secs;
        }
        pieceWavs.push(pfile);
      }
      const plist = resolve(work, `plist-${key}.txt`);
      const plines = [];
      pieceWavs.forEach((w, pi) => { plines.push(`file '${w}'`); if (pi < pieceWavs.length - 1) plines.push(`file '${paraGap}'`); });
      writeFileSync(plist, plines.join("\n") + "\n");
      ff(["-f", "concat", "-safe", "0", "-i", plist, "-c:a", "pcm_s16le", "-ar", "44100", "-ac", "1", cacheFile]);
      duration = probeDuration(cacheFile);
      note = `${duration.toFixed(1)}s (${pieces.length} pieces stitched, ${synthSecs.toFixed(1)}s synth)`;
    }
  }
  // One line written on completion. A pool writing partial lines as it goes
  // would interleave them into nonsense.
  console.log(head + note);
  parts[i] = { ...chunk, wav: cacheFile, duration };
}

let cursor = 0;
async function worker() {
  for (let i = cursor++; i < chunks.length; i = cursor++) await processChunk(chunks[i], i);
}
await Promise.all(Array.from({ length: Math.min(CONCURRENCY, chunks.length) }, worker));

// ---------- concat: cached chunks interleaved with a silence gap ----------
const silence = resolve(work, "gap.wav");
ff(["-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", String(GAP_SECONDS), "-c:a", "pcm_s16le", silence]);

const listFile = resolve(work, "list.txt");
const lines = [];
parts.forEach((p, i) => {
  lines.push(`file '${p.wav}'`);
  if (i < parts.length - 1) lines.push(`file '${silence}'`);
});
writeFileSync(listFile, lines.join("\n") + "\n");

const outDir = sample ? "public/audio/samples" : "public/audio";
mkdirSync(outDir, { recursive: true });
const outFile = resolve(outDir, sample ? `${slug}.${providerId}.mp3` : `${slug}.mp3`);

ff([
  "-f", "concat", "-safe", "0", "-i", listFile,
  "-c:a", "libmp3lame", "-b:a", BITRATE, "-ac", "1", "-ar", "44100",
  "-write_xing", "1",           // proper header => accurate duration + seeking on iOS
  outFile,
]);

// ---------- verify + manifest ----------
const gaps = (parts.length - 1) * GAP_SECONDS;
const expected = parts.reduce((n, p) => n + p.duration, 0) + gaps;
const actual = probeDuration(outFile);
if (Math.abs(actual - expected) > 0.75) {
  throw new Error(`duration mismatch: parts+gaps = ${expected.toFixed(2)}s but file is ${actual.toFixed(2)}s`);
}

const sizeMb = (readFileSync(outFile).length / 1e6).toFixed(1);
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;

if (full) {
  let t = 0;
  const chapters = [];
  parts.forEach((p, i) => {
    if (p.kind === "chapter") {
      chapters.push({ id: p.id, num: p.num, title: p.title, start: Number(t.toFixed(2)), end: Number((t + p.duration).toFixed(2)) });
    }
    t += p.duration;
    if (i < parts.length - 1) t += GAP_SECONDS;
  });
  // The MP3 is served immutable for a year (see vercel.json), so re-recording a
  // narration at the same URL would leave every browser that already fetched it
  // playing the old take until 2027. Fingerprint the URL with a hash of the audio
  // itself: identical audio keeps the identical URL and stays cached, while a new
  // recording becomes a new URL that every client fetches fresh.
  const audioHash = createHash("sha256").update(readFileSync(outFile)).digest("hex").slice(0, 8);
  writeFileSync(`src/data/audio/${slug}.json`, JSON.stringify({
    slug, src: `/audio/${slug}.mp3?v=${audioHash}`,
    provider: providerId, providerLabel: provider.label, voice,
    duration: Number(actual.toFixed(2)),
    proseHash: script.proseHash,
    title: script.title,
    chapters,
  }, null, 2) + "\n");
  console.log(`\n  manifest -> src/data/audio/${slug}.json (${chapters.length} chapters)`);
}

rmSync(work, { recursive: true, force: true });
console.log(`  audio    -> ${outFile.replace(process.cwd() + "/", "")}  ${mmss(actual)}, ${sizeMb} MB`);
