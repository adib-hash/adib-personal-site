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
      const image = extractEnclosureUrl(itemXml);
      const readingTime = estimateReadingTime(description);

      items.push({ title, link, pubDate, description, image, readingTime });
    }

    res.setHeader(
      "Cache-Control",
      "s-maxage=1800, stale-while-revalidate=3600"
    );
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

function extractEnclosureUrl(xml) {
  const enclosureMatch = xml.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
  if (enclosureMatch) return enclosureMatch[1];

  const mediaMatch = xml.match(/<media:content[^>]+url=["']([^"']+)["']/i);
  return mediaMatch ? mediaMatch[1] : "";
}

function estimateReadingTime(description) {
  const text = description.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (!words) return null;
  return Math.max(1, Math.ceil(words / 230));
}
