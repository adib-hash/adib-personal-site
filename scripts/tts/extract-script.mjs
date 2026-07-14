/**
 * Extracts the narratable prose from a research page into a narration script.
 *
 * The research pages embed their prose directly in JSX, interleaved with
 * citation superscripts and interactive graphics that have no spoken form.
 * This pulls out just the text a narrator should read, in document order,
 * grouped by chapter so the TTS layer can synthesize one file per chapter.
 *
 *   node scripts/tts/extract-script.mjs --slug bond-broccoli
 *   node scripts/tts/extract-script.mjs --slug bond-broccoli --check
 *
 * --check re-extracts and compares against the committed script, exiting
 * non-zero if the article's prose has drifted from the audio.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "../..");

// Prose-bearing components. Everything else on the page (StatCard, AssetGrid,
// OwnershipLedger, Faceoff, the timelines and charts) is visual-only and is
// deliberately not narrated.
const NARRATABLE = ["H2", "P", "Quote", "Ed"];

const ENTITIES = {
  "&ldquo;": "\u201c", "&rdquo;": "\u201d",
  "&lsquo;": "\u2018", "&rsquo;": "\u2019",
  "&mdash;": "\u2014", "&ndash;": "\u2013",
  "&nbsp;": " ", "&amp;": "&", "&hellip;": "\u2026",
  "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'",
  "&pound;": "\u00a3", "&euro;": "\u20ac", "&cent;": "\u00a2", "&yen;": "\u00a5",
  "&deg;": "\u00b0", "&times;": "\u00d7", "&frac12;": "\u00bd", "&eacute;": "\u00e9",
  "&uuml;": "\u00fc", "&ouml;": "\u00f6", "&auml;": "\u00e4", "&ntilde;": "\u00f1",
};

function decode(s) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&[a-z][a-z0-9]*;/gi, (m) => {
      const hit = ENTITIES[m.toLowerCase()];
      // An unrecognised entity would be spoken literally ("ampersand pound
      // semicolon"). Fail loudly rather than ship a mispronounced word.
      if (hit === undefined) {
        throw new Error(
          `unknown HTML entity ${m} in prose — add it to ENTITIES in extract-script.mjs`
        );
      }
      return hit;
    });
}

/** Strip JSX down to the words a narrator would actually say. */
function clean(raw) {
  let t = raw;
  t = t.replace(/<Rf\s+n=\{?["']?[^/>]*?\/>/g, "");  // citation superscripts
  t = t.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");        // JSX comments
  t = t.replace(/<[^>]+>/g, "");                     // any remaining inline tags
  t = decode(t);
  t = t.replace(/\{["'`]([^"'`]*)["'`]\}/g, "$1");   // {"literal"} -> literal
  return t.replace(/\s+/g, " ").trim();
}

function extract(slug, componentFile) {
  const src = readFileSync(resolve(root, componentFile), "utf8");

  // Only scan the rendered body, not the data arrays or component definitions
  // above it (those contain <P>-like strings in `sources` and chapter metadata).
  const bodyStart = src.search(/export default function \w+\(\)/);
  if (bodyStart === -1) throw new Error(`no default export in ${componentFile}`);
  const body = src.slice(bodyStart);

  const title = "The Family Behind the Gun Barrel";
  const dekMatch = body.match(/<HeroReveal delay=\{420\}>([\s\S]*?)<\/HeroReveal>/);
  const dek = dekMatch ? clean(dekMatch[1]) : "";

  // Single ordered pass so segments come out in the order they're read.
  const tagRe = new RegExp(`<(${NARRATABLE.join("|")})\\b([^>]*)>([\\s\\S]*?)</\\1>`, "g");

  const chapters = [];
  let current = null;
  let m;
  while ((m = tagRe.exec(body)) !== null) {
    const [, tag, attrs, inner] = m;
    const text = clean(inner);
    if (!text) continue;

    if (tag === "H2") {
      const num = (attrs.match(/num="(\d+)"/) || [])[1] ?? String(chapters.length).padStart(2, "0");
      current = { id: `ch${chapters.length}`, num, title: text, segments: [] };
      chapters.push(current);
      continue;
    }
    if (!current) continue; // prose above chapter 00 is hero furniture; skip

    const type = tag === "P" ? "para" : tag === "Quote" ? "quote" : "ed";
    const seg = { type, text };
    if (tag === "Quote") {
      const author = (attrs.match(/author="([^"]*)"/) || [])[1];
      const role = (attrs.match(/role="([^"]*)"/) || [])[1];
      if (author) seg.author = author;
      if (role) seg.role = role;
    }
    current.segments.push(seg);
  }

  const words = chapters.flatMap((c) => [c.title, ...c.segments.map((s) => s.text)])
    .join(" ").split(/\s+/).filter(Boolean).length;
  const chars = chapters.flatMap((c) => [c.title, ...c.segments.map((s) => s.text)])
    .join(" ").length;

  return {
    slug,
    sourceFile: componentFile,
    // Hash of the narrated text only — cosmetic/styling edits to the page
    // won't trip the drift check, but a prose edit will.
    proseHash: createHash("sha256")
      .update(chapters.map((c) => c.title + c.segments.map((s) => s.text).join("")).join(""))
      .digest("hex").slice(0, 16),
    title,
    dek,
    wordCount: words,
    charCount: chars,
    chapters,
  };
}

// ---- cli ----
const args = process.argv.slice(2);
const slug = args[args.indexOf("--slug") + 1];
const check = args.includes("--check");
if (!slug || slug.startsWith("--")) {
  console.error("usage: extract-script.mjs --slug <slug> [--check]");
  process.exit(1);
}

const { researchItems } = await import(resolve(root, "src/data/research.js"));
const item = researchItems.find((i) => i.slug === slug);
if (!item) throw new Error(`unknown slug: ${slug}`);

const componentFile = `src/pages/research/${
  { "bond-broccoli": "BondBroccoli" }[slug] ?? slug
}.jsx`;

const out = extract(slug, componentFile);
const dest = resolve(root, `src/data/audio/${slug}.script.json`);

if (check) {
  if (!existsSync(dest)) {
    console.error(`no committed script at ${dest} — run without --check first`);
    process.exit(1);
  }
  const prev = JSON.parse(readFileSync(dest, "utf8"));
  if (prev.proseHash !== out.proseHash) {
    console.error(
      `DRIFT: ${slug} prose has changed since the audio was generated.\n` +
      `  committed: ${prev.proseHash}\n  current:   ${out.proseHash}\n` +
      `  The narration no longer matches the page. Re-extract and regenerate.`
    );
    process.exit(1);
  }
  console.log(`ok: ${slug} prose matches the generated audio (${out.proseHash})`);
  process.exit(0);
}

writeFileSync(dest, JSON.stringify(out, null, 2) + "\n");
console.log(
  `${slug}: ${out.chapters.length} chapters, ${out.wordCount.toLocaleString()} words, ` +
  `${out.charCount.toLocaleString()} chars -> src/data/audio/${slug}.script.json`
);
for (const c of out.chapters) {
  const w = c.segments.reduce((n, s) => n + s.text.split(/\s+/).length, 0);
  const kinds = c.segments.reduce((a, s) => ((a[s.type] = (a[s.type] || 0) + 1), a), {});
  console.log(
    `  ${c.num}  ${String(w).padStart(4)}w  ${c.title.slice(0, 44).padEnd(44)} ` +
    Object.entries(kinds).map(([k, n]) => `${n} ${k}`).join(", ")
  );
}
