import { postJson } from "./_http.mjs";

export const id = "gemini";
// 3.1 is the newer TTS preview — chosen by ear over 2.5 Flash, and it sits in
// its own free-tier quota bucket. Override with GEMINI_TTS_MODEL to compare.
export const model = process.env.GEMINI_TTS_MODEL || "gemini-3.1-flash-tts-preview";
const NAMES = {
  "gemini-3.1-flash-tts-preview": "Gemini · 3.1 Flash TTS",
  "gemini-2.5-flash-preview-tts": "Gemini · 2.5 Flash TTS",
  "gemini-2.5-pro-preview-tts": "Gemini · 2.5 Pro TTS",
};
export const label = NAMES[model] ?? `Gemini · ${model}`;
// "Charon" — informative, lower register.
export const defaultVoice = "Charon";
export const envKey = "GEMINI_API_KEY";

// Gemini TTS takes natural-language direction inline, so the style note is part
// of the prompt rather than a separate parameter.
const DIRECTION =
  "You are a seasoned audiobook narrator recording a piece of narrative " +
  "nonfiction for a general audience. Perform it — don't just pronounce it. " +
  "Vary your pace and pitch naturally, lean on the words that carry the meaning, " +
  "take a real beat at each paragraph break, and let the dry wit land. " +
  "Sound like a person telling a story, not a machine reading text. " +
  "Read only the words below, and add nothing of your own:\n\n";

export async function synthesize(text, { voice = defaultVoice, apiKey }) {
  const res = await postJson(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      headers: { "x-goog-api-key": apiKey },
      body: {
        contents: [{ parts: [{ text: DIRECTION + text }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
        },
      },
    }
  );
  const json = await res.json();
  const part = json?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part) {
    throw new Error(`no audio in Gemini response: ${JSON.stringify(json).slice(0, 400)}`);
  }
  // Gemini returns raw signed 16-bit PCM at 24kHz — no container, so it needs
  // an ffmpeg pass with the format declared explicitly.
  return { audio: Buffer.from(part.inlineData.data, "base64"), format: "pcm_s16le_24000" };
}
