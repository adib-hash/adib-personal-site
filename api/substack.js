export default async function handler(req, res) {
  try {
    const response = await fetch("https://notesfromadib.substack.com/feed");
    if (!response.ok) {
      return res.status(502).json({ error: "Failed to fetch RSS feed" });
    }

    const xml = await response.text();

    // Simple XML parsing for RSS items
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];
      const title = extractTag(itemXml, "title");
      const link = extractTag(itemXml, "link");
      const pubDate = extractTag(itemXml, "pubDate");
      const description = extractTag(itemXml, "description");

      items.push({ title, link, pubDate, description });
    }

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=600");
    return res.status(200).json(items);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

function extractTag(xml, tag) {
  const cdataRegex = new RegExp(
    `<${tag}>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`
  );
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  const simpleRegex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`);
  const simpleMatch = xml.match(simpleRegex);
  return simpleMatch ? simpleMatch[1].trim() : "";
}
