import { getRedis } from "./_redis.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url, password } = req.body || {};

  if (!password || password !== process.env.READING_ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "URL is required" });
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return res.status(400).json({ error: "Invalid URL" });
  }

  const domain = parsed.hostname.replace(/^www\./, "");

  try {
    // Fetch the page and extract metadata
    let title = "";
    let ogImage = "";

    try {
      const pageRes = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; ReadingListBot/1.0)",
          Accept: "text/html",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(8000),
      });

      if (pageRes.ok) {
        const html = await pageRes.text();

        // Extract <title>
        const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
        if (titleMatch) {
          title = titleMatch[1].trim();
          title = title
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&#x27;/g, "'")
            .replace(/&#x2F;/g, "/");
        }

        // Extract og:image
        const ogMatch = html.match(
          /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
        );
        if (ogMatch) {
          ogImage = ogMatch[1];
        } else {
          const ogMatch2 = html.match(
            /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i
          );
          if (ogMatch2) ogImage = ogMatch2[1];
        }
      }
    } catch {
      // Page fetch failed — save with domain as title
    }

    if (!title) title = domain;

    const item = {
      url,
      title,
      ogImage,
      domain,
      createdAt: new Date().toISOString(),
    };

    // Store in Redis sorted set (score = timestamp for ordering)
    const redis = getRedis();
    const score = Date.now();
    await redis.zadd("reading_links", { score, member: JSON.stringify(item) });

    return res.status(200).json(item);
  } catch (err) {
    console.error("reading-add error:", err);
    return res.status(500).json({ error: "Failed to save link" });
  }
}
