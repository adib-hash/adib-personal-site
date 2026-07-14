import { postJson } from "./_http.mjs";

export const id = "openai";
export const label = "OpenAI · gpt-4o-mini-tts";
export const defaultVoice = "onyx";
export const envKey = "OPENAI_API_KEY";

const INSTRUCTIONS =
  "Read as an audiobook narrator for a longform piece of business journalism. " +
  "Measured, articulate, and calm. Let the sentences breathe. Do not sound salesy or overly bright.";

export async function synthesize(text, { voice = defaultVoice, apiKey }) {
  const res = await postJson("https://api.openai.com/v1/audio/speech", {
    headers: { authorization: `Bearer ${apiKey}` },
    accept: "audio/mpeg",
    body: {
      model: "gpt-4o-mini-tts",
      voice,
      input: text,
      instructions: INSTRUCTIONS,
      response_format: "mp3",
    },
  });
  return { audio: Buffer.from(await res.arrayBuffer()), format: "mp3" };
}
