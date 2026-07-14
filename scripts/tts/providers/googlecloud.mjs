import { execFileSync } from "node:child_process";
import { postJson } from "./_http.mjs";

export const id = "googlecloud";
export const label = "Google Cloud · Chirp 3 HD";
// Chirp 3 HD, British English — the register the subject wants.
export const defaultVoice = "en-GB-Chirp3-HD-Charon";
export const envKey = null; // OAuth, not an API key

/**
 * Cloud TTS does not accept a plain API key (unlike the Gemini API) — it wants
 * an OAuth bearer token. Application Default Credentials via the gcloud CLI is
 * the least painful path:
 *
 *   gcloud auth application-default login
 *   gcloud services enable texttospeech.googleapis.com
 */
let cachedToken = null;
function accessToken() {
  if (cachedToken) return cachedToken;
  if (process.env.GOOGLE_ACCESS_TOKEN) return (cachedToken = process.env.GOOGLE_ACCESS_TOKEN);
  try {
    cachedToken = execFileSync("gcloud", ["auth", "application-default", "print-access-token"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
    return cachedToken;
  } catch (err) {
    throw new Error(
      "Google Cloud TTS needs an OAuth token and none was available.\n" +
      "  Run:  gcloud auth application-default login\n" +
      "        gcloud services enable texttospeech.googleapis.com\n" +
      "  Then set GOOGLE_CLOUD_PROJECT in .env.local to your project id.\n" +
      `  (gcloud said: ${String(err.stderr || err.message).trim().slice(0, 200)})`
    );
  }
}

export async function synthesize(text, { voice = defaultVoice }) {
  const project = process.env.GOOGLE_CLOUD_PROJECT;
  const res = await postJson("https://texttospeech.googleapis.com/v1/text:synthesize", {
    headers: {
      authorization: `Bearer ${accessToken()}`,
      // Required when billing against user ADC rather than a service account.
      ...(project ? { "x-goog-user-project": project } : {}),
    },
    body: {
      input: { text },
      voice: { languageCode: voice.slice(0, 5), name: voice },
      // Chirp 3 HD ignores pitch/speakingRate, so they're deliberately omitted.
      audioConfig: { audioEncoding: "MP3" },
    },
  });
  const json = await res.json();
  if (!json.audioContent) {
    throw new Error(`no audioContent: ${JSON.stringify(json).slice(0, 300)}`);
  }
  return { audio: Buffer.from(json.audioContent, "base64"), format: "mp3" };
}
