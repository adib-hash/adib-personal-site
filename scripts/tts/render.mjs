/**
 * Turns an extracted narration script into the exact text each provider speaks.
 *
 * Kept separate from the providers so every provider narrates identical text —
 * otherwise the bake-off would be comparing scripts, not voices.
 */

const NUMBER_WORDS = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six",
  "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
];

/**
 * "Chapter 00" would be read aloud as "chapter double-zero" by most engines,
 * so the number is spelled out.
 */
function spokenChapter(num) {
  const n = Number(num);
  return NUMBER_WORDS[n] ?? String(n);
}

/** Square brackets mark editorial insertions in quotes; keep the words, drop the brackets. */
function unbracket(s) {
  return s.replace(/\[([^\]]*)\]/g, "$1");
}

/**
 * Financial shorthand that reads correctly on the page but mis-speaks aloud.
 * The prose stays visually compact ("$190B", "~$59/share"); only the narrator
 * hears the expanded form. Done here, not on the page, so the visual source of
 * truth and the extract/--check drift hash stay untouched. A no-op for prose
 * without these tokens (e.g. the Bond and Apple pieces).
 */
const MAGNITUDE = { K: "thousand", M: "million", B: "billion", T: "trillion" };

const ROMAN = { II: "Two", III: "Three", IV: "Four", V: "Five", VI: "Six" };

function spokenNumbers(s) {
  return s
    // "GTA V", "Grand Theft Auto III" -> "GTA Five", "Grand Theft Auto Three":
    // roman numerals after a game title otherwise speak as letters ("GTA vee").
    .replace(/\b(GTA|Grand Theft Auto)\s+(III|II|IV|VI|V)\b/g, (_, t, r) => `${t} ${ROMAN[r]}`)
    // "Lapsus$" (the hacking group) -> "Lapsus"; "GTA$500,000" -> "500,000 GTA dollars".
    .replace(/Lapsus\$/g, "Lapsus")
    .replace(/GTA\$(\d[\d,]*)/g, "$1 GTA dollars")
    // "The Athletic & Wordle" -> "... and ...": a bare ampersand otherwise
    // speaks as "ampersand". Spacing is normalized so "A & B" reads cleanly.
    .replace(/\s*&\s*/g, " and ")
    // "3.6x" -> "3.6 times"; a bare trailing x otherwise speaks as the letter.
    .replace(/(\d(?:\.\d+)?)x\b/g, "$1 times")
    // "#MeToo" -> "hashtag MeToo".
    .replace(/#(?=[A-Za-z])/g, "hashtag ")
    // $12.4B -> $12.4 billion. The suffix must sit right after a dollar-amount,
    // so credit ratings and initialisms (BBB+, AAA, EPS, FCF) are never touched.
    .replace(/(\$\d[\d,]*(?:\.\d+)?)\s?([KMBT])\b/g, (_, num, suf) => `${num} ${MAGNITUDE[suf]}`)
    // ~$59, ~76% -> around $59, around 76% (a bare "~" is read "tilde" or dropped).
    .replace(/~(?=[\d$])/g, "around ")
    // $0.01/share, ~$59/share -> ... a share ("/" otherwise speaks as "slash").
    .replace(/\/(share|year)\b/g, " a $1")
    // "EV/Revenue", "IAC/Ask" -> separate tokens, not a spoken "slash".
    .replace(/([A-Za-z])\/([A-Za-z])/g, "$1 $2");
}

function renderSegment(seg) {
  if (seg.type === "quote") {
    // Spoken attribution, assembled from what the page already shows visually.
    const who = [seg.author, seg.role].filter(Boolean).join(", ");
    return who ? `${who}: ${unbracket(seg.text)}` : unbracket(seg.text);
  }
  return unbracket(seg.text);
}

/**
 * @returns {Array<{id: string, kind: "intro"|"chapter", title: string, text: string}>}
 *   One chunk per synthesis request. The intro is its own chunk so that seeking
 *   to "Chapter 00" skips it rather than replaying the headline.
 */
export function renderChunks(script, { intro = true } = {}) {
  const chunks = [];

  if (intro) {
    chunks.push({
      id: "intro",
      kind: "intro",
      title: script.title,
      text: [`${script.title}.`, script.dek].filter(Boolean).join("\n\n"),
    });
  }

  for (const ch of script.chapters) {
    const heading = `Chapter ${spokenChapter(ch.num)}. ${ch.title}.`;
    const body = ch.segments.map(renderSegment).join("\n\n");
    chunks.push({
      id: ch.id,
      kind: "chapter",
      num: ch.num,
      title: ch.title,
      text: `${heading}\n\n${body}`,
    });
  }

  // Spoken-form normalization runs last, over the fully assembled chunk text,
  // so it applies uniformly to the intro, chapter headings, and body prose.
  return chunks.map((c) => ({ ...c, text: spokenNumbers(c.text) }));
}
