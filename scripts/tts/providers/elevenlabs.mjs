import { postJson } from "./_http.mjs";

export const id = "elevenlabs";
export const label = "ElevenLabs · Multilingual v2";
// "Daniel" — British, measured, news-presenter delivery. Suits the subject.
export const defaultVoice = "onwK4e9ZLuTAKqWW03F9";
export const envKey = "ELEVENLABS_API_KEY";

export async function synthesize(text, { voice = defaultVoice, apiKey }) {
  const res = await postJson(
    `https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`,
    {
      headers: { "xi-api-key": apiKey },
      accept: "audio/mpeg",
      body: {
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.0, use_speaker_boost: true },
      },
    }
  );
  return { audio: Buffer.from(await res.arrayBuffer()), format: "mp3" };
}
