import { postJson } from "./_http.mjs";

export const id = "gemini";
export const label = "Gemini · 2.5 Flash TTS";
// "Charon" — informative, lower register.
export const defaultVoice = "Charon";
export const envKey = "GEMINI_API_KEY";

// Gemini TTS takes natural-language direction inline, so the style note is part
// of the prompt rather than a separate parameter.
const DIRECTION =
  "Read the following aloud as a measured, articulate audiobook narrator. " +
  "Calm and documentary in tone. Read only the text, do not add commentary:\n\n";

export async function synthesize(text, { voice = defaultVoice, apiKey }) {
  const res = await postJson(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent",
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
