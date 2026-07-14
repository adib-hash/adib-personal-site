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

  return chunks;
}
