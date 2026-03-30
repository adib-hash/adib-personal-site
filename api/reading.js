import { getRedis } from "./_redis.js";

export default async function handler(req, res) {
  try {
    const redis = getRedis();

    // Get all items from sorted set, newest first
    const raw = await redis.zrange("reading_links", 0, -1, { rev: true });

    const items = raw.map((entry, i) => {
      const item = typeof entry === "string" ? JSON.parse(entry) : entry;
      return { id: i, ...item };
    });

    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=600");
    return res.status(200).json(items);
  } catch (err) {
    console.error("reading error:", err);
    return res.status(500).json({ error: "Failed to fetch reading list" });
  }
}
