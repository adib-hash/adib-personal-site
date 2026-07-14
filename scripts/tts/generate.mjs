/**
 * Generates the narration audio for a research piece.
 *
 *   node scripts/tts/generate.mjs --slug bond-broccoli --provider gemini --sample
 *   node scripts/tts/generate.mjs --slug bond-broccoli --provider googlecloud --full
 *
 * --sample  synthesizes only the intro + chapter zero, for comparing voices.
 *           Cheap enough to be free on every provider.
 * --full    synthesizes the whole piece and writes the player's manifest.
 *
 * Synthesis is done one chapter at a time. That is deliberate: Gemini warns that
 * quality drifts on outputs longer than a few minutes, and per-chapter files give
 * us exact chapter offsets for the scrub bar from any provider, without relying
 * on timestamp APIs that only some of them have.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { renderChunks } from "./render.mjs";

const PROVIDERS = ["elevenlabs", "openai", "gemini", "googlecloud"];
const GAP_SECONDS = 0.7;   // breathing room between chapters
const BITRATE = "64k";     // CBR mono — plenty for speech, ~10MB for 22 min

// ---------- env ----------
// Keys are local-only. Nothing here is ever bundled or sent to Vercel.
function loadEnv() {
  const f = resolve(".env.local");
  if (!existsSync(f)) return;
  for (const line of readFileSync(f, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

// ---------- ffmpeg ----------
const ff = (args) => execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args], { stdio: ["ignore", "pipe", "pipe"] });

function probeDuration(file) {
  const out = execFileSync("ffprobe", [
    "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file,
  ], { encoding: "utf8" });
  return parseFloat(out.trim());
}

/** Normalize whatever the provider returned into a uniform WAV, padded with a gap. */
function toWav(raw, format, dest, { pad }) {
  const ext = format === "mp3" ? "mp3" : format.startsWith("pcm_") ? "pcm" : format;
  const tmp = `${dest}.${ext}`;
  writeFileSync(tmp, raw);
  const input = format.startsWith("pcm_s16le_")
    ? ["-f", "s16le", "-ar", format.split("_").pop(), "-ac", "1", "-i", tmp]
    : ["-i", tmp];
  const filter = pad ? ["-af", `apad=pad_dur=${GAP_SECONDS}`] : [];
  ff([...input, ...filter, "-ar", "44100", "-ac", "1", "-c:a", "pcm_s16le", dest]);
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
  console.error(
    `usage: generate.mjs --slug <slug> --provider <${PROVIDERS.join("|")}> (--sample | --full) [--voice <v>]`
  );
  process.exit(1);
}

const provider = await import(`./providers/${providerId}.mjs`);
const voice = arg("voice", provider.defaultVoice);

const apiKey = provider.envKey ? process.env[provider.envKey] : undefined;
if (provider.envKey && !apiKey) {
  console.error(`missing ${provider.envKey} — add it to .env.local`);
  process.exit(1);
}

// ---------- render ----------
const script = JSON.parse(readFileSync(`src/data/audio/${slug}.script.json`, "utf8"));
let chunks = renderChunks(script);
if (sample) chunks = chunks.filter((c) => c.id === "intro" || c.id === "ch0");

const chars = chunks.reduce((n, c) => n + c.text.length, 0);
console.log(
  `${provider.label}\n  voice: ${voice}\n  ${chunks.length} chunks, ${chars.toLocaleString()} chars` +
  `${sample ? " (sample)" : ""}\n`
);

const work = resolve(".tts-work", `${slug}.${providerId}`);
rmSync(work, { recursive: true, force: true });
mkdirSync(work, { recursive: true });

// ---------- synthesize ----------
const parts = [];
for (const [i, chunk] of chunks.entries()) {
  const t0 = Date.now();
  process.stdout.write(`  [${String(i + 1).padStart(2)}/${chunks.length}] ${chunk.id.padEnd(6)} ${String(chunk.text.length).padStart(5)} chars ... `);

  const { audio, format } = await provider.synthesize(chunk.text, { voice, apiKey });

  const wav = resolve(work, `${String(i).padStart(2, "0")}-${chunk.id}.wav`);
  toWav(audio, format, wav, { pad: i < chunks.length - 1 });
  const duration = probeDuration(wav);
  parts.push({ ...chunk, wav, duration });

  console.log(`${duration.toFixed(1)}s (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
}

// ---------- concat (single encode, so no seam is re-compressed twice) ----------
const listFile = resolve(work, "list.txt");
writeFileSync(listFile, parts.map((p) => `file '${p.wav}'`).join("\n") + "\n");

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
const expected = parts.reduce((n, p) => n + p.duration, 0);
const actual = probeDuration(outFile);
const drift = Math.abs(actual - expected);
if (drift > 0.5) {
  throw new Error(`duration mismatch: parts sum to ${expected.toFixed(2)}s but file is ${actual.toFixed(2)}s`);
}

const sizeMb = (readFileSync(outFile).length / 1e6).toFixed(1);
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;

if (full) {
  let t = 0;
  const chapters = [];
  for (const p of parts) {
    if (p.kind === "chapter") {
      chapters.push({
        id: p.id, num: p.num, title: p.title,
        start: Number(t.toFixed(2)),
        end: Number((t + p.duration).toFixed(2)),
      });
    }
    t += p.duration;
  }
  writeFileSync(
    `src/data/audio/${slug}.json`,
    JSON.stringify({
      slug,
      src: `/audio/${slug}.mp3`,
      provider: providerId,
      providerLabel: provider.label,
      voice,
      duration: Number(actual.toFixed(2)),
      proseHash: script.proseHash,   // ties the audio to the prose it was made from
      chapters,
    }, null, 2) + "\n"
  );
  console.log(`\n  manifest -> src/data/audio/${slug}.json (${chapters.length} chapters)`);
}

rmSync(work, { recursive: true, force: true });
console.log(`  audio    -> ${outFile.replace(process.cwd() + "/", "")}  ${mmss(actual)}, ${sizeMb} MB`);
