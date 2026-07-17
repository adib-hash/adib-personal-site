/**
 * Generates the narration audio for a research piece.
 *
 *   node scripts/tts/generate.mjs --slug bond-broccoli --provider gemini --sample
 *   node scripts/tts/generate.mjs --slug bond-broccoli --provider gemini --full
 *
 * --sample  synthesizes only the intro + chapter zero, for comparing voices.
 * --full    synthesizes the whole piece and writes the player's manifest.
 *
 * Synthesis is one chapter at a time: Gemini drifts on long outputs, and
 * per-chapter files give exact chapter offsets for the scrub bar from any
 * provider without needing timestamp APIs.
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

// ---------- synthesize (cache-aware, guarded) ----------
const parts = [];
for (const [i, chunk] of chunks.entries()) {
  const key = createHash("sha256").update(`${variant}\n${chunk.text}`).digest("hex").slice(0, 24);
  const cacheFile = resolve(cacheDir, `${key}.wav`);
  const cps = (dur) => chunk.text.length / dur;
  const ok = (dur) => dur > 0.5 && cps(dur) >= MIN_CPS && cps(dur) <= MAX_CPS;

  process.stdout.write(`  [${String(i + 1).padStart(2)}/${chunks.length}] ${chunk.id.padEnd(6)} ${String(chunk.text.length).padStart(5)} chars ... `);

  let duration = existsSync(cacheFile) ? probeDuration(cacheFile) : 0;
  if (duration && ok(duration)) {
    console.log(`cached ${duration.toFixed(1)}s`);
  } else {
    if (duration) rmSync(cacheFile); // stale/bad cache entry
    duration = 0;
    for (let attempt = 1; attempt <= MAX_TRIES; attempt++) {
      const t0 = Date.now();
      const { audio, format } = await provider.synthesize(chunk.text, { voice, apiKey });
      const tmp = resolve(work, `try-${key}.wav`);
      toWav(audio, format, tmp);
      const d = probeDuration(tmp);
      if (ok(d)) {
        copyFileSync(tmp, cacheFile);
        rmSync(tmp);
        duration = d;
        console.log(`${d.toFixed(1)}s (${((Date.now() - t0) / 1000).toFixed(1)}s${attempt > 1 ? `, try ${attempt}` : ""})`);
        break;
      }
      rmSync(tmp);
      process.stdout.write(`\n      rejected: ${cps(d).toFixed(1)} chars/s (${d.toFixed(0)}s) — retry ${attempt}/${MAX_TRIES} ... `);
    }
    if (!duration) {
      console.log();
      throw new Error(`chunk "${chunk.id}" failed the plausibility guard ${MAX_TRIES}x — provider kept looping/garbling`);
    }
  }
  parts.push({ ...chunk, wav: cacheFile, duration });
}

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
  writeFileSync(`src/data/audio/${slug}.json`, JSON.stringify({
    slug, src: `/audio/${slug}.mp3`,
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
