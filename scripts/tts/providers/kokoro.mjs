import { execFile } from "node:child_process";
import { readFileSync, rmSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { tmpdir } from "node:os";
import { randomBytes } from "node:crypto";

export const id = "kokoro";
// Kokoro-82M, run locally through MLX. Free, offline, ~8x realtime on an
// M-series Mac, and immune to the end-of-chunk muffling Gemini 3.1 develops
// because it synthesizes sentence by sentence. Set up with
// scripts/tts/kokoro/setup.sh.
export const label = "Local · Kokoro 82M";
// am_michael: American male, lower register — the closest Kokoro voice to the
// Gemini "Charon" read the earlier pieces use. Try others with --voice
// (am_fenrir, am_puck, bm_george, bm_fable; af_heart is Kokoro's best-rated).
export const defaultVoice = "am_michael";
export const envKey = null; // runs locally, no key
const speed = process.env.KOKORO_SPEED || "1.0";
// Part of the cache key, so a different speed or engine version re-synthesizes.
export const model = `kokoro-82m-bf16@mlx-audio-0.6.1@${speed}x`;
// Each call loads the model onto the GPU; two at once is the sweet spot.
export const concurrency = 2;

const PY = resolve(".tts-venv/bin/python");
const SYNTH = resolve("scripts/tts/kokoro/synth.py");

export async function synthesize(text, { voice = defaultVoice }) {
  if (!existsSync(PY)) {
    throw new Error("Kokoro environment missing. Run: scripts/tts/kokoro/setup.sh");
  }
  const out = resolve(tmpdir(), `kokoro-${randomBytes(6).toString("hex")}.wav`);
  await new Promise((ok, fail) => {
    const child = execFile(PY, [SYNTH, "--voice", voice, "--out", out, "--speed", speed],
      { maxBuffer: 1 << 24 },
      (err, _stdout, stderr) => (err ? fail(new Error(`kokoro failed: ${String(stderr).trim().slice(-600)}`)) : ok()));
    child.stdin.end(text);
  });
  const audio = readFileSync(out);
  rmSync(out, { force: true });
  return { audio, format: "wav" };
}
