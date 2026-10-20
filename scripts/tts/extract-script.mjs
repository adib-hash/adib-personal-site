/**
 * Extracts the narratable prose from a research page into a narration script.
 *
 * The research pages embed prose directly in JSX, interleaved with citation
 * superscripts and interactive graphics that have no spoken form. This pulls out
 * just the text a narrator should read, in document order, grouped by chapter so
 * the TTS layer can synthesize one file per chapter.
 *
 *   node scripts/tts/extract-script.mjs --slug <slug>
 *   node scripts/tts/extract-script.mjs --slug <slug> --check
 *
 * The component file and title are read from src/data/research.js. Anything a
 * given page does differently — its standfirst, which components are prose, what
 * tag marks a chapter — comes from an optional per-piece config:
 *
 *   src/data/audio/<slug>.narrate.json   (all fields optional)
 *   {
 *     "componentFile": "src/pages/research/Foo.jsx", // else derived from registry
 *     "title":       "...",          // else the registry title
 *     "dek":         "...",          // spoken standfirst before chapter 00; else none
 *     "chapterTag":  "H2",           // component that marks a chapter heading
 *     "chapterNumAttr": "num",       // attribute holding the chapter number
 *     "narratable":  ["P","Quote","Ed","Lead"],  // prose components to read
 *     "quoteTags":   ["Quote"],      // which of those are quotes (get spoken attribution)
 *     "quoteAuthorAttr": "author",    // quote attribute holding the speaker
 *     "chapterTitleAttr": "title",    // chapter tag is self-closing; title lives here
 *     "stopAt":      'id="sources"',  // stop reading at the first occurrence of this
 *     "lists": [{ "name": "lessons", "title": "h", "body": "b" }]
 *   }
 *
 * A narratable entry can be class-qualified, e.g. "p.closer", to read one styled
 * plain element without reading every <p> on the page. A list names an array
 * literal in the component (`var lessons = [{ h: "...", b: "..." }]`) that the
 * body renders with `{lessons.map(...)}`; its items are read where the map sits.
 *
 * --check re-extracts and compares against the committed script, exiting non-zero
 * if the page's prose has drifted from the audio.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "../..");

const DEFAULTS = {
  chapterTag: "H2",
  chapterNumAttr: "num",
  narratable: ["P", "Quote", "Ed", "Lead"],
  quoteTags: ["Quote"],
  quoteAuthorAttr: "author",
  lists: [],
};

const ENTITIES = {
  "&ldquo;": "“", "&rdquo;": "”",
  "&lsquo;": "‘", "&rsquo;": "’",
  "&mdash;": "—", "&ndash;": "–",
  "&nbsp;": " ", "&amp;": "&", "&hellip;": "…",
  "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'",
  "&pound;": "£", "&euro;": "€", "&cent;": "¢", "&yen;": "¥",
  "&deg;": "°", "&times;": "×", "&frac12;": "½", "&eacute;": "é",
  "&uuml;": "ü", "&ouml;": "ö", "&auml;": "ä", "&ntilde;": "ñ",
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
        throw new Error(`unknown HTML entity ${m} in prose — add it to ENTITIES in extract-script.mjs`);
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

/** Pull the component import path and title for a slug straight from the registry text. */
function registryLookup(slug) {
  const reg = readFileSync(resolve(root, "src/data/research.js"), "utf8");
  const block = reg.match(new RegExp(`\\{[^{}]*slug:\\s*["']${slug}["'][\\s\\S]*?\\n  \\}`));
  if (!block) throw new Error(`slug "${slug}" not found in src/data/research.js`);
  const imp = block[0].match(/import\(\s*["']([^"']+)["']\s*\)/);
  const title = block[0].match(/title:\s*"((?:[^"\\]|\\.)*)"/);
  return {
    componentFile: imp ? imp[1].replace(/^\.\.\//, "src/") : null,
    title: title ? title[1].replace(/\\"/g, '"') : null,
  };
}

function attr(attrs, name) {
  const m = attrs.match(new RegExp(`\\b${name}="([^"]*)"`));
  return m ? decode(m[1]) : undefined;
}

/** Items of an array literal like `var lessons = [{ h: "...", b: "..." }]`, as "Title. Body". */
function listItems(src, { name, title, body }, file) {
  const decl = src.match(new RegExp(`(?:var|let|const)\\s+${name}\\s*=\\s*\\[([\\s\\S]*?)\\n\\];`));
  if (!decl) throw new Error(`list "${name}" not found in ${file}`);
  const field = (obj, key) => {
    const m = obj.match(new RegExp(`\\b${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`));
    return m ? clean(m[1].replace(/\\"/g, '"')) : "";
  };
  const items = (decl[1].match(/\{[^{}]*\}/g) || [])
    .map((obj) => [field(obj, title), field(obj, body)].filter(Boolean))
    .filter((parts) => parts.length)
    .map(([h, b]) => (b ? `${h.replace(/[.!?]?$/, ".")} ${b}` : h));
  if (!items.length) throw new Error(`list "${name}" in ${file} has no readable items`);
  return items;
}

function loadConfig(slug) {
  const f = resolve(root, `src/data/audio/${slug}.narrate.json`);
  return existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : {};
}

function extract(slug) {
  const reg = registryLookup(slug);
  const cfg = { ...DEFAULTS, ...loadConfig(slug) };
  const componentFile = cfg.componentFile || reg.componentFile;
  const title = cfg.title || reg.title;
  if (!componentFile) throw new Error(`no componentFile for "${slug}" (not in registry, none in config)`);
  if (!title) throw new Error(`no title for "${slug}"`);

  const src = readFileSync(resolve(root, componentFile), "utf8");
  // Only scan the rendered body, not the data arrays or component definitions
  // above it (those hold <P>-like strings in `sources` and chapter metadata).
  const bodyStart = src.search(/export default function \w+\(\)/);
  if (bodyStart === -1) throw new Error(`no default export in ${componentFile}`);
  let body = src.slice(bodyStart);
  if (cfg.stopAt) {
    const stop = body.indexOf(cfg.stopAt);
    if (stop === -1) throw new Error(`stopAt marker ${JSON.stringify(cfg.stopAt)} not found in ${componentFile}`);
    body = body.slice(0, stop);
  }

  // Every narratable thing is located first, then read in document order: the
  // page mixes paired prose tags, a self-closing chapter tag, class-qualified
  // plain elements and mapped arrays, and no single regex covers all of them.
  const hits = [];
  const collect = (re, toHit) => {
    let m;
    while ((m = re.exec(body)) !== null) hits.push({ at: m.index, ...toHit(m) });
  };

  const bare = cfg.narratable.filter((t) => !t.includes(".") && t !== cfg.chapterTag);
  const paired = cfg.chapterTitleAttr ? bare : [cfg.chapterTag, ...bare];
  if (paired.length) {
    collect(new RegExp(`<(${paired.join("|")})\\b([^>]*)>([\\s\\S]*?)</\\1>`, "g"),
      ([, tag, attrs, inner]) => ({ tag, attrs, text: clean(inner) }));
  }
  for (const q of cfg.narratable.filter((t) => t.includes("."))) {
    const [tag, cls] = q.split(".");
    collect(new RegExp(`<(${tag})\\b([^>]*\\bclassName="[^"]*\\b${cls}\\b[^"]*"[^>]*)>([\\s\\S]*?)</\\1>`, "g"),
      ([, , attrs, inner]) => ({ tag: q, attrs, text: clean(inner) }));
  }
  if (cfg.chapterTitleAttr) {
    collect(new RegExp(`<${cfg.chapterTag}\\b([^>]*?)/>`, "g"),
      ([, attrs]) => ({ tag: cfg.chapterTag, attrs, text: clean(attr(attrs, cfg.chapterTitleAttr) ?? "") }));
  }
  for (const list of cfg.lists) {
    const items = listItems(src, list, componentFile);
    collect(new RegExp(`\\{\\s*${list.name}\\.map\\(`, "g"), () => ({ tag: "list", items }));
  }
  hits.sort((a, b) => a.at - b.at);

  const chapters = [];
  let current = null;
  for (const { tag, attrs, text, items } of hits) {
    if (tag === "list") {
      if (current) items.forEach((it, i) => current.segments.push({ type: "lesson", n: i + 1, text: it }));
      continue;
    }
    if (!text) continue;

    if (tag === cfg.chapterTag) {
      const num = attr(attrs, cfg.chapterNumAttr) ?? String(chapters.length).padStart(2, "0");
      current = { id: `ch${chapters.length}`, num, title: text, segments: [] };
      chapters.push(current);
      continue;
    }
    if (!current) continue; // prose above the first chapter is hero furniture; skip

    const isQuote = cfg.quoteTags.includes(tag);
    const type = isQuote ? "quote" : tag === "Ed" ? "ed" : "para";
    // Drop-cap paragraphs pass their leading letter as a `first="X"` prop and
    // render the body starting at the second letter. Restore it so the narrator
    // speaks the whole word ("t was" -> "It was"). No-op where the prop is absent.
    const dropCap = (attrs.match(/first="([^"]*)"/) || [])[1];
    const seg = { type, text: dropCap ? dropCap + text : text };
    if (isQuote) {
      const author = attr(attrs, cfg.quoteAuthorAttr);
      const role = (attrs.match(/role="([^"]*)"/) || [])[1];
      if (author) seg.author = author;
      if (role) seg.role = role;
    }
    current.segments.push(seg);
  }

  if (!chapters.length) {
    throw new Error(`no <${cfg.chapterTag}> chapter headings found in ${componentFile} — set "chapterTag" in ${slug}.narrate.json`);
  }

  const flat = chapters.flatMap((c) => [c.title, ...c.segments.map((s) => s.text)]).join(" ");
  return {
    slug,
    sourceFile: componentFile,
    // Hash of the narrated prose only — cosmetic/styling edits to the page won't
    // trip the drift check, but a prose edit will.
    proseHash: createHash("sha256")
      .update(chapters.map((c) => c.title + c.segments.map((s) => s.text).join("")).join(""))
      .digest("hex").slice(0, 16),
    title,
    dek: cfg.dek || "",
    wordCount: flat.split(/\s+/).filter(Boolean).length,
    charCount: flat.length,
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

const out = extract(slug);
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
