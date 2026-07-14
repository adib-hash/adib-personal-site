/** Prints the narration exactly as it will be spoken. Sanity-check before spending credits. */
import { readFileSync } from "node:fs";
import { renderChunks } from "./render.mjs";

const slug = process.argv[2] ?? "bond-broccoli";
const script = JSON.parse(readFileSync(`src/data/audio/${slug}.script.json`, "utf8"));
const chunks = renderChunks(script);

let chars = 0;
for (const c of chunks) {
  chars += c.text.length;
  console.log(`\n${"=".repeat(78)}\n[${c.id}] ${c.text.length} chars\n${"=".repeat(78)}`);
  console.log(c.text);
}
console.log(`\n${chunks.length} chunks, ${chars.toLocaleString()} chars total`);
